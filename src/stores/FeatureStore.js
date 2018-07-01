import {decorate, observable, action, computed } from 'mobx';
import {mapConfig, layerConfig} from '../config/config';
import {NumFilter, MultiSplitFilter, MultiFieldFilter} from './objects/Filters';
import moment from 'moment';

// Store that fetches and manages all app feature data
class FeatureStore {

  genSearchString
  layer
  features
  featureAttachments
  map
  selObjId
  selFeatureIndex
  activeFilterMap
  _allFeatures
  loaded

  constructor(service){
    this.service = service;

    this.featureAttachments = new Map();
    this.features = [];
    this.genSearchString = '';
    this.selFeatureIndex = null;
    this.activeFilterMap = new Map();
    this.loaded = false;
    this.filters = [];

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
          newFilter = new NumFilter(key);
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

  // this.features = this._allFeatures.filter(f => {
  //   for(let [k,v] of this.activeFilterMap){
  //     if(v.isClientFiltered(f.attributes)){
  //       return false;
  //     }
  //   }
  //   return true;
  // })

  get filteredFeatures(){
    return this.features.filter(f => {
      if(this.selObjId){
        return f.attributes.ObjectId === this.selObjId;
      }
      const ftypes = layerConfig.fieldTypes;
      if(this.genSearchString){
        const name = f.attributes[ftypes.name].toLowerCase();
        const tags = f.attributes[ftypes.tags].toLowerCase();
        const subst = this.genSearchString.toLowerCase();
        if(!(name.includes(subst) || tags.includes(subst))){
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

  load(){
    this.service.loadMap(mapConfig.webmapid)
      .then(map => {
        this.map = map;
        this.layer = this.map.layers.find(l => l.title === mapConfig.layerTitle);
        const date = new Date();
        const dField = layerConfig.fieldTypes.date;
        this.layer.definitionExpression = `${dField} >= '${date.toISOString()}'`
        this.layer.outFields = "*";
        return this.service.queryAllLayerFeatures(this.layer);
      })
      .then(res => {
        const ftypes = layerConfig.fieldTypes;
        let t = res.features.reduce((acc, c) => {
          let date = moment(c.attributes[ftypes.date]);
          c.attributes[ftypes.date] = date;
          let start = c.attributes[ftypes.start].split(":");
          let end = c.attributes[ftypes.end].split(":");
          c.attributes[ftypes.start] = moment(date).add(start[0], 'hours').add(start[1], 'minutes');
          c.attributes[ftypes.end] = moment(date).add(end[0], 'hours').add(end[1], 'minutes');
          acc.push(c);
          return acc;
        }, []);
        this.features = t;
        this._allFeatures = t;
        t.forEach((f,i) => {
          this.service.queryFeatureAttachments(this.layer, f)
            .then(atch => {
              const firstObj = atch[0];
              this.featureAttachments.set(firstObj.id, firstObj.url)
            })
        })
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

  // applyFilter(filterObj){
  //   this.activeFilterMap.set(filterObj.fieldName, filterObj);
  //   this.features = this._allFeatures.filter(f => {
  //     for(let [k,v] of this.activeFilterMap){
  //       if(v.isClientFiltered(f.attributes)){
  //         return false;
  //       }
  //     }
  //     return true;
  //   })
  // }

  // deleteActiveFilter(filterObj){
  //   this.activeFilterMap.delete(filterObj.fieldName);
  //   this.features = this._allFeatures.filter(f => {
  //     for(let v of this.activeFilterMap.values()){
  //       if(v.isClientFiltered(f.attributes)){
  //         return false;
  //       }
  //     }
  //     return true;
  //   })

  // }

}

decorate(FeatureStore, {
  genSearchString: observable,
  features: observable,
  featureAttachments: observable,
  selObjId: observable,
  selFeatureIndex: observable,
  activeFilterMap: observable,
  loaded: observable,
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