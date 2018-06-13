import {decorate, observable, action, computed } from 'mobx';
import esriLoader from 'esri-loader';
import {mapConfig, layerConfig, loaderOptions} from '../config/config';
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

  constructor(){
    this.featureAttachments = new Map();
    this.features = [];
    this.genSearchString = '';
    this.selFeatureIndex = 1;
  }

  get filteredAttributes(){
    console.log("called")
    const test = this.filteredFeatures.map(f => f.attributes) || [];
    console.log(test);
    return test;
  }

  get filteredFeatures(){
    return this.features.filter(f => {
      if(this.selObjId){
        return f.attributes.ObjectId === this.selObjId;
      }
      if(!this.genSearchString || this.genSearchString.length === 0){
        return true
      }
      const ftypes = layerConfig.fieldTypes;
      const name = f.attributes[ftypes.name].toLowerCase();
      const tags = f.attributes[ftypes.tags].toLowerCase();
      const subst = this.genSearchString.toLowerCase();
      return (name.includes(subst) || tags.includes(subst));
    })
  }

  get events(){
    const ftypes = layerConfig.fieldTypes;
    return this.filteredAttributes.map(a => {
      let dayStart = a[ftypes.start].split(':')
      let dayEnd = a[ftypes.end].split(':')
      let start = moment.unix(a[ftypes.date]/1000).add(dayStart[0], 'hours').add(dayStart[1], 'minutes')
      let end = moment.unix(a[ftypes.date]/1000).add(dayEnd[0], 'hours').add(dayEnd[1], 'minutes')
      return {
        id: a.ObjectId,
        title: a[ftypes.name],
        start: start.toDate(),
        end: end.toDate()
      }
    });
  }

  get selFeatureAttributes(){
    if(this.selFeatureIndex){
      return this.filteredAttributes[this.selFeatureIndex];
    }
    return null;
  }

  loadAttachments(){
    this.features.forEach( (f,i) => {
      this.layer.queryFeatureAttachments(f)
      .then(res => {
        const firstObj = res[0];
        this.featureAttachments.set(firstObj.id, firstObj.url)
      })
    })
  }

  load(){
    esriLoader.loadModules(['esri/WebMap'], loaderOptions)
    .then(([WebMap]) => {

      this.map = new WebMap({
        portalItem: {
          id: mapConfig.webmapid
        }
      });

      this.map.load();
      this.map.when(() => {
        this.layer = this.map.layers.find(l => l.title === mapConfig.layerTitle);
        return this.layer.queryFeatures()
      })
      .then(res => {
        this.features = res.features;
        this.loadAttachments();
      })
      .catch(er => console.log(er));
      
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
  filteredFeatures: computed,
  filteredAttributes: computed,
  events: computed,
  selFeatureAttributes: computed,
  setGeneralSearchString: action.bound,
  load: action.bound,
  loadAttachments: action.bound,
  onCalendarEvent: action.bound,
  setSelectedFeature: action.bound
})

export default FeatureStore;