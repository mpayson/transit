import {decorate, observable, action, computed } from 'mobx';
import {mapConfig, layerConfig, loaderOptions} from '../config/config';
import esriLoader from 'esri-loader';
import MockService from '../services/MockService';
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
    this.selFeatureIndex = null;
  }

  get filteredAttributes(){
    return this.filteredFeatures.map(f => f.attributes) || [];
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

  loadAttachments(){
    this.features.forEach( (f,i) => {
      MockService.loadAttachment(f)
        .then(res => {
          this.featureAttachments.set(res.id, res.url)
        })
      this.layer.queryFeatureAttachments(f)
      .then(res => {
        const firstObj = res[0];
        this.featureAttachments.set(firstObj.id, firstObj.url)
      })
    })
  }

  load(){
    // MockService.loadFeatures()
    //   .then(res => {
    //     this.features = res.features
    //     this.loadAttachments();
    //   })
    esriLoader.loadModules(['esri/WebMap'], loaderOptions)
    .then(([WebMap]) => {

      this.map = new WebMap({
        portalItem: {
          id: mapConfig.webmapid
        }
      });
      return this.map.load();
    })
    .then(() => {
      this.layer = this.map.layers.find(l => l.title === mapConfig.layerTitle);
      return this.layer.queryFeatures()
    })
    .then(res => {
      const ftypes = layerConfig.fieldTypes;
      let t = res.features.reduce((acc, c) => {
        let date = moment(c.attributes[ftypes.date]);
        c.attributes[ftypes.date] = date;
        c.attributes[ftypes.start] = moment(date).add(moment(c.attributes[ftypes.start], "HH:mm"));
        c.attributes[ftypes.end] = moment(date).add(moment(c.attributes[ftypes.end], "HH:mm"));
        acc.push(c);
        return acc;
      }, []);
      console.log(t);
      this.features = t;
      this.loadAttachments();
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