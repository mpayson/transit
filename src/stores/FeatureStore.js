import {decorate, observable, action, computed, autorun, values } from 'mobx';
import {mapConfig, layerConfig} from '../config/config';
import {NumFilter, MultiSplitFilter, MultiFieldFilter, TimeSinceFilter} from './objects/Filters';
import Utils from '../utils/Utils';
import moment from 'moment';

// Store that fetches and manages all app feature data
class FeatureStore {

  genSearchString
  layer
  featureAttachments
  featureRelates
  map
  selObjId
  selFeatureIndex
  activeFilterMap
  isLoaded
  featureIdMap
  features
  mappedFeatures
  isFilterByExtent

  constructor(service){
    this.service = service;

    this.featureAttachments = new Map();
    this.features = [];
    this.genSearchString = '';
    this.selFeatureIndex = null;
    this.activeFilterMap = new Map();
    this.filters = [];
    this._featureIds = [];
    this.featureIdMap = new Map();
    this.featureRelates = new Map();
    this.loadStatus = {
      mapLoaded: false,
      layerLoaded: false,
      featsLoaded: false
    }

    let keys = [...Object.keys(layerConfig.filters)];
    let interestKeys = keys.filter(k => layerConfig.filters[k] === 'interests');
    let interestFilter = new MultiFieldFilter('Interests', interestKeys, 'multi-split', this);
    this.filters.push(interestFilter);

    let otherKeys = keys.filter(k => layerConfig.filters[k] !== 'interests')
    for(let key of otherKeys){
      let newFilter;
      switch(layerConfig.filters[key]){
        case 'multi-split':
          newFilter = new MultiSplitFilter(key, ',', this);
          break;
        case 'num':
          newFilter = new NumFilter(key, this);
          break;
        case 'time-since':
          newFilter = new TimeSinceFilter(key, 'year', this);
          break;
        default:
          throw "UNKNOWN FILTER TYPE"
      }
      this.filters.push(newFilter);
    }

    this.autoHandler = autorun(() => {
      let defExp;
      for(let f of this.filters){
        if(!defExp){
          defExp = f.definitionExpression;
        } else if(f.definitionExpression) {
          defExp += ` AND ${f.definitionExpression}`
        }
      }
      if(!this.layer){
        return;
      }
      let fDefExp = defExp ? defExp : "1=1";
      this.layer.definitionExpression = fDefExp;
    })

  }

  get filteredAttributes(){
    return this.filteredFeatures.map(f => f.attributes) || [];
  }

  get filteredFeatures(){
    const fsToFilter = this.mappedFeatures ? this.mappedFeatures : this.features;
    let t = fsToFilter.filter(f => {
      if(this.selObjId){
        return f.attributes.ObjectId === this.selObjId;
      }
      const ftypes = layerConfig.fieldTypes;

      if(this.genSearchString){
        const subst = this.genSearchString.toLowerCase();
        let isVis = false;
        for(let s of layerConfig.search){
          if(isVis){
            continue;
          }
          if(!f.attributes.hasOwnProperty(s) || !f.attributes[s]){
            continue;
          }
          const slwr = f.attributes[s].toLowerCase();
          isVis = slwr.includes(subst);
        }
        if(!isVis){
          return false;
        }
      } 

      // AND LOGIC
      for(let v of this.filters){
        if(!v.clientIsVisible(f.attributes)){
          return false;
        }
      }
      return true;
    })
    return t;
  }

  get selFeatureAttributes(){
    if(this.selFeatureIndex){
      return this.filteredAttributes[this.selFeatureIndex];
    }
    return null;
  }

  get emailEventMap(){
    let emap = new Map();
    let kemail = layerConfig.fieldTypes.relateemail;
    let kstart = layerConfig.fieldTypes.start;
    let kend = layerConfig.fieldTypes.end;

    this.featureRelates.forEach((v, k) => {
      v.forEach( (f,i) => {
        const atrs = f.attributes;
        if(!atrs.hasOwnProperty(kemail) || !atrs.hasOwnProperty(kstart) || !atrs.hasOwnProperty(kend)){
          return;
        }

        const start = moment(atrs[kstart]);
        const end = moment(atrs[kend]);
        const email = atrs[kemail].toLowerCase();
        
        const event = {
          id: i,
          title: email,
          start: start,
          end: end
        }

        if(emap.has(email)){
          let cAr = emap.get(email);
          cAr.push(event);
          emap.set(email, cAr);
        } else {
          emap.set(email, [event]);
        }

      })
    });

    return emap;
  }

  getEmailFromId(featureId){
    let id = typeof featureId === "string" ? parseInt(featureId) : featureId;

    if(!this.featureIdMap.has(id)){
      return null;
    }
    const f = this.featureIdMap.get(id);
    const rEmail = f.attributes[layerConfig.fieldTypes.email];
    return rEmail.toLowerCase();
  }

  get events(){
    let events = [];
    this.emailEventMap.forEach((v, k) => {
      events = events.concat(v);
    })
    return events;
  }

  get filteredEmailIdMap(){
    let emap = new Map();
    for(let f of this.filteredFeatures){
      const rEmail = f.attributes[layerConfig.fieldTypes.email];
      const email = rEmail.toLowerCase();
      const oid = f.attributes[layerConfig.fieldTypes.oid];
      emap.set(email, oid);
    }
    return emap;
  }

  get filteredEvents(){
    let events = [];
    this.emailEventMap.forEach((v, k) => {
      if(this.filteredEmailIdMap.has(k)){
        events = events.concat(v);
      }
    })
    return events;
  }

  get upcomingEmailEventMap(){
    let emap = new Map();
    const cDate = moment();

    this.emailEventMap.forEach((v,k) => {
      const events = v.filter(e => cDate.isBefore(e.start));
      emap.set(k, events);
    })
    return emap;
  }

  get emailStreakMap(){
    const cDate = moment();
    const cMonth = cDate.get('month');
    const cYear = cDate.get('year');
    let emap = new Map();

    this.emailEventMap.forEach((v,k) => {
      let events = v;
      let count = 0;
      const sortEvents = events.sort((a,b) => a.start.isBefore(b.start));
      
      let diffYr = cYear;
      let diffM = cMonth;
      for(let e of sortEvents){
        let s = e.start;
        const y = s.get('year');
        const m = s.get('month');
        if(y < diffYr || (y === diffYr && m < diffM)){
          break;
        }
        if(y > diffYr || (y === diffYr && m > diffM)){
          continue;
        }
        if(y === diffYr && (m === diffM + 1)){
          continue;
        }
        count += 1;
        diffM -= 1;
        if(diffM < 0){
          diffM = 11;
          diffYr -= 1;
        }
      }
      emap.set(k, count);
    })
    return emap;

  }

  _buildFeautres(features, layer){
    return features.reduce((acc, c) => {
      for(let f of layer.fields){
        let n = f.name;
        if(f.type === 'date'){
          c.attributes[n] = moment(c.attributes[n])
        }
      }
      acc.push(c);
      return acc;

    }, [])
  }

  filterByFeature(featureId){
    if(!featureId){
      return;
    }
    let id = typeof featureId === "string" ? parseInt(featureId) : featureId;
    const f = this.featureIdMap.get(id);
    for(let v of this.filters){
      v.setFromAttr(f.attributes);
    }
  }

  load(){
    this.service.getMap(mapConfig.webmapid)
      .then(map => {
        this.loadStatus.mapLoaded = true;
        this.map = map;
        return this.service.loadMap(this.map);
      })
      .then(() => {
        this.layer = this.map.layers.find(l => 
          l.title === mapConfig.layerTitle
        );
        this.loadStatus.layerLoaded = true;
        this.layer.outFields = "*";
        return this.service.queryAllLayerFeatures(this.layer);
      })
      .then(res => {
        const t = this._buildFeautres(res.features, this.layer);
        const ftypes = layerConfig.fieldTypes;
        for(let i=0; i < t.length; i++){
          this.featureIdMap.set(t[i].attributes[ftypes.oid], t[i])
        }
        this.features = Utils.shuffleArr(t);
        this.loadStatus.featsLoaded = true;
        return this.service.fetchAttachMap(this.layer, this.features)
      })
      .then(map => {
        this.featureAttachments = map;
        return this.service.queryRelatedRecords(this.layer);
      })
      .then(map => {
        this.featureRelates = map;
      })
      .catch(err => {
        console.error(err);
      });

  }

  onCalendarEvent(event, synthEvent){
    this.selObjId = this.selObjId === event.id ? null : event.id;
  }

  setGeneralSearchString(strVal){
    this.genSearchString = strVal;
  }

  setSelectedFeature(index){
    this.selFeatureIndex = index;
  }

  updateFilterExtent(extent){
    if(!this.isFilterByExtent || !extent){
      return;
    }
    this.mappedFeatures = this.features.filter(f => extent.contains(f.geometry));
  }
  setIsFilterByExtent(isByExtent, extent=null){
    this.isFilterByExtent = isByExtent;
    if(isByExtent){
      this.updateFilterExtent(extent);
    } else {
      this.mappedFeatures = null;
    }
  }

}

decorate(FeatureStore, {
  genSearchString: observable,
  features: observable,
  featureAttachments: observable,
  selObjId: observable,
  selFeatureIndex: observable,
  activeFilterMap: observable,
  loadStatus: observable,
  featureIdMap: observable,
  featureRelates: observable,
  isFilterByExtent: observable,
  mappedFeatures: observable,
  filteredFeatures: computed,
  filteredAttributes: computed,
  events: computed,
  selFeatureAttributes: computed,
  emailEventMap: computed,
  emailStreakMap: computed,
  upcomingEmailEventMap: computed,
  filteredEvents: computed,
  filteredEmailIdMap: computed,
  setGeneralSearchString: action.bound,
  load: action.bound,
  loadAttachments: action.bound,
  onCalendarEvent: action.bound,
  setSelectedFeature: action.bound,
  applyFilter: action.bound,
  deleteActiveFilter: action.bound,
  filterByFeature: action.bound,
  updateFilterExtent: action.bound,
  setIsFilterByExtent: action.bound
})

export default FeatureStore;