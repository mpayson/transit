import BaseFilter from './BaseFilter';
import {decorate, observable, action, computed} from 'mobx';

class CustomAvailFilter extends BaseFilter{

  constructor(fieldName, featureStore){
    super(fieldName);
    this.featureStore = featureStore;
    this.type = 'binary';
    this.isActive = false;
  }

  get availOptions(){
    let t = this.featureStore.upcomingEmailEventMap;
    return t;
  }

  get label(){
    return 'Available';
  }

  clientIsVisible(featureAttrs){
    if(!this.isActive){
      return true;
    }

    const key = featureAttrs[this.fieldName];
    const lwrKey = key.toLowerCase();
    if(!this.availOptions.has(lwrKey)){
      return false;
    }
    let v = this.availOptions.get(lwrKey);
    return Array.isArray(v) && v.length > 0;
  }

  get definitionExpression(){
    return null;
  }

  setIsActive(isActive){
    this.isActive = isActive;
  }

  toggleIsActive(){
    this.isActive = !this.isActive;
  }

}

decorate(CustomAvailFilter, {
  isActive: observable,
  availOptions: computed,
  setIsActive: action.bound,
  toggleIsActive: action.bound
})

export default CustomAvailFilter;