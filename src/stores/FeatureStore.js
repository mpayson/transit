import {decorate, observable, action, computed } from 'mobx';
import {mapConfig, layerConfig} from '../config/config';
import {NumFilter, MultiSplitFilter, MultiFieldFilter} from './objects/Filters';
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
  loaded
  featureIdMap
  features

  constructor(service){
    this.service = service;

    this.featureAttachments = new Map();
    this.features = [];
    this.genSearchString = '';
    this.selFeatureIndex = null;
    this.activeFilterMap = new Map();
    this.loaded = false;
    this.filters = [];
    this._featureIds = [];
    this.featureIdMap = new Map();
    this.featureRelates = new Map();

    let keys = [...Object.keys(layerConfig.filters)];
    let interestKeys = keys.filter(k => layerConfig.filters[k] === 'interests');
    let interestFilter = new MultiFieldFilter('Interests', interestKeys, 'multi-split', this);
    this.filters.push(interestFilter);

    let otherKeys = keys.filter(k => layerConfig.filters[k] !== 'interests')
    for(let key of otherKeys){
      let newFilter;
      switch(layerConfig.filters[key]){
        case 'multi-split':
          console.log("multi")  
          newFilter = new MultiSplitFilter(key, ',', this);
          break;
        case 'num':
          console.log("num")
          newFilter = new NumFilter(key, this);
          break;
        default:
          console.log("default")
          newFilter = new NumFilter(key);
      }
      this.filters.push(newFilter);
    }
  }

  get filteredAttributes(){
    return this.filteredFeatures.map(f => f.attributes) || [];
  }

  get filteredFeatures(){
    let t = this.features.filter(f => {
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

      for(let v of this.filters){
        if(v.isClientFiltered(f.attributes)){
          return false;
        }
      }
      return true;
    })
    // console.log(t);
    return t;
  }

  get events(){
    const ftypes = layerConfig.fieldTypes;
    return this.filteredAttributes.map(a => {
      return {
        id: a.ObjectId,
        title: a[ftypes.name],
        start: a[ftypes.start].toDate(),
        end: a[ftypes.end].toDate()
      }
    });
  }

  get selFeatureAttributes(){
    if(this.selFeatureIndex){
      return this.filteredAttributes[this.selFeatureIndex];
    }
    return null;
  }

  _buildFeautres(features){
    const ftypes = layerConfig.fieldTypes;
    return features.reduce((acc, c) => {
      // let date = moment(c.attributes[ftypes.date]);
      // c.attributes[ftypes.date] = date;
      // let start = c.attributes[ftypes.start].split(":");
      // let end = c.attributes[ftypes.end].split(":");
      // c.attributes[ftypes.start] = moment(date).add(start[0], 'hours').add(start[1], 'minutes');
      // c.attributes[ftypes.end] = moment(date).add(end[0], 'hours').add(end[1], 'minutes');
      c.attributes[ftypes.years] = moment().diff(moment(c.attributes[ftypes.years]), 'years');
      acc.push(c);
      return acc;
    }, [])
  }

  load(){
    this.service.loadMap(mapConfig.webmapid)
      .then(map => {
        this.map = map;
        this.layer = this.map.layers.find(l => 
          l.title === mapConfig.layerTitle
        );
        this.layer.outFields = "*";
        return this.service.queryAllLayerFeatures(this.layer);
      })
      .then(res => {
        const t = this._buildFeautres(res.features);
        const ftypes = layerConfig.fieldTypes;
        for(let i=0; i < t.length; i++){
          this.featureIdMap.set(t[i].attributes[ftypes.oid], t[i])
        }
        this.features = Utils.shuffleArr(t);
        return this.service.fetchAttachMap(this.layer, this.features)
      })
      .then(map => {
        this.featureAttachments = map;
        return this.service.queryRelatedRecords(this.layer);
      })
      .then(map => {
        console.log(map);
        this.featureRelates = map;
        this.loaded = true;
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

}

decorate(FeatureStore, {
  genSearchString: observable,
  features: observable,
  featureAttachments: observable,
  selObjId: observable,
  selFeatureIndex: observable,
  activeFilterMap: observable,
  loaded: observable,
  featureIdMap: observable,
  featureRelates: observable,
  filteredFeatures: computed,
  filteredAttributes: computed,
  events: computed,
  selFeatureAttributes: computed,
  setGeneralSearchString: action.bound,
  load: action.bound,
  loadAttachments: action.bound,
  onCalendarEvent: action.bound,
  setSelectedFeature: action.bound,
  applyFilter: action.bound,
  deleteActiveFilter: action.bound
})

export default FeatureStore;