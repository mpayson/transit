import {decorate, observable, action, computed, autorun} from 'mobx';
import {mapConfig, layerConfig} from '../config/config';
import {NumFilter, MultiSplitFilter, MultiFilter,
  CompositeFilter, TimeSinceFilter, CustomAvailFilter} from './objects/Filters';
import Utils from '../utils/Utils';
import moment from 'moment';

// Store that fetches and manages all app feature data
class FeatureStore {

  homeSearchString
  genSearchString
  layer
  featureAttachments
  attIsLoadMap
  _featureRelates
  map

  featureIdMap
  features

  mappedFeatures
  isFilterByExtent = true

  constructor(service){
    this.service = service;
    this.featureAttachments = new Map();
    this.features = [];
    this.genSearchString = '';
    this.homeSearchString = '';
    this.filters = [];
    this.featureIdMap = new Map();
    this._featureRelates = new Map();
    this.attIsLoadMap = new Map();
    this.loadStatus = {
      mapLoaded: false,
      layerLoaded: false,
      featsLoaded: false
    }

    let keys = [...Object.keys(layerConfig.filters)];

    let availFilter = new CustomAvailFilter(layerConfig.fieldTypes.email, this);
    this.filters.push(availFilter);

    for(let k of keys){
      const v = layerConfig.filters[k];
      let newFilter;
      if(Array.isArray(v)){
        newFilter = new CompositeFilter(k, v, this);
      } else if (v === 'multi-split'){
        newFilter = new MultiSplitFilter(k, ',', this);
      } else if (v === 'multi'){
        newFilter = new MultiFilter(k, this);
      } else if (v === 'num'){
        newFilter = new NumFilter(k, this);
      } else if (v === 'time-since'){
        newFilter = new TimeSinceFilter(k, 'year', this);
      } else {
        throw new Error("UNKNOWN FILTER TYPE");
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

  get emailEventMap(){
    let emap = new Map();
    let kemail = layerConfig.fieldTypes.relateemail;
    let kstart = layerConfig.fieldTypes.start;
    let kend = layerConfig.fieldTypes.end;

    this._featureRelates.forEach((v, k) => {
      v.forEach( (f,i) => {
        const atrs = f.attributes;
        if(!atrs.hasOwnProperty(kemail) || !atrs.hasOwnProperty(kstart) || !atrs.hasOwnProperty(kend)){
          return;
        }

        if(!atrs[kstart] || !atrs[kend]){
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
    let id = typeof featureId === "string" ? parseInt(featureId, 10) : featureId;

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

  get emailIdMap(){
    let emap = new Map();
    for(let f of this.features){
      const rEmail = f.attributes[layerConfig.fieldTypes.email];
      const email = rEmail.toLowerCase();
      const oid = f.attributes[layerConfig.fieldTypes.oid];
      emap.set(email, oid);
    }
    return emap;
  }

  get filteredEvents(){
    let events = [];
    let addedEmails = new Set();

    for(let f of this.filteredFeatures){
      const rEmail = f.attributes[layerConfig.fieldTypes.email];
      const email = rEmail.toLowerCase();
      if(addedEmails.has(email) || !this.emailEventMap.has(email)){
        continue;
      }
      addedEmails.add(email);
      const newEvents = this.emailEventMap.get(email);
      events = events.concat(newEvents);
    }

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

      const sortEvents = events.sort((a,b) => b.start.diff(a.start));
      
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

  get sortedStreaks(){
    const t = Utils.numSort([...this.emailStreakMap.entries()], 1);
    return t;
  }

  get homeFilterOptions(){
    let homeFilters = new Set(layerConfig.homeSearchFilters);
    let typeOptions = new Set(['composite', 'multi-split', 'multi']);
    let options = []

    for(let f of this.filters){
      if(!homeFilters.has(f.fieldName) || !typeOptions.has(f.type)){
        continue;
      }
      let newOptions;
      if(f.type === 'composite'){
        newOptions = f.subFilters.reduce((acc, sf) => {
          if(!typeOptions.has(sf.type)){
            return acc;
          }
          const sfOpts = sf.options.map(o => [sf, o[0]]);
          acc = acc.concat(sfOpts);
          return acc;
        }, []);
      } else {
        newOptions = f.options.map(o => [f, o[0]]);
      }
      options = options.concat(newOptions);
    }
    return options;
  }

  get filteredHomeFilterOptions(){
    if(!this.homeSearchString || this.homeSearchString.length < 1){
      return this.homeFilterOptions;
    }
    let searchLower = this.homeSearchString.toLowerCase();

    return this.homeFilterOptions.filter(o => {
      let optionValue = o[1];
      if(!optionValue){
        return false;
      }
      let lwrV = o[1].toLowerCase();
      return lwrV.includes(searchLower);
    });
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
    let id = typeof featureId === "string" ? parseInt(featureId, 10) : featureId;
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
        this.features = t;
        this.loadStatus.featsLoaded = true;
        return this.service.fetchAttachMap(this.layer, this.features)
      })
      .then(map => {
        this.featureAttachments = map;
        return this.service.queryRelatedRecords(this.layer);
      })
      .then(map => {
        this._featureRelates = map;
      })
      .catch(err => {
        console.error(err);
      });

  }

  setAttIsLoad(att, isLoad){
    this.attIsLoadMap.set(att, isLoad);
  }

  setGeneralSearchString(strVal){
    this.genSearchString = strVal;
  }

  updateFilterExtent(extent){
    if(!this.isFilterByExtent || !extent || this.features.length < 1){
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

  setHomeSearchString(str){
    this.homeSearchString = str;
  }

  setFilterOption(filter, option){
    let typeOptions = new Set(['multi-split', 'multi']);
    if(!filter || !typeOptions.has(filter.type)){
      return;
    }
    filter.setMultiOption(option, true);
  }

}

decorate(FeatureStore, {
  homeSearchString: observable,
  genSearchString: observable,
  features: observable,
  featureAttachments: observable,
  loadStatus: observable,
  featureIdMap: observable,
  _featureRelates: observable,
  isFilterByExtent: observable,
  mappedFeatures: observable,
  filteredFeatures: computed,
  filteredAttributes: computed,
  events: computed,
  emailEventMap: computed,
  emailStreakMap: computed,
  upcomingEmailEventMap: computed,
  filteredEvents: computed,
  emailIdMap: computed,
  sortedStreaks: computed,
  homeFilterOptions: computed,
  filteredHomeFilterOptions: computed,
  setGeneralSearchString: action.bound,
  load: action.bound,
  loadAttachments: action.bound,
  filterByFeature: action.bound,
  updateFilterExtent: action.bound,
  setIsFilterByExtent: action.bound,
  attIsLoadMap: observable,
  setAttIsLoad: action.bound,
  setHomeSearchString: action.bound,
  setFilterOption: action.bound
})

export default FeatureStore;