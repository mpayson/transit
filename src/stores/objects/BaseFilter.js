import {decorate, computed} from 'mobx';
import {layerConfig} from  '../../config/config';

class BaseFilter{
  constructor(fieldName){
    this.fieldName = fieldName
  }
  get label(){
    return layerConfig.labels[this.fieldName] || this.fieldName;
  }
  clientIsVisible(featureAttrs){
    console.log("IMPLEMENT IS CLIENT FILTERED");
  }
  setFromAttr(featureAttrs){
    return;
  }

}

decorate(BaseFilter, {
  label: computed
})

export default BaseFilter;