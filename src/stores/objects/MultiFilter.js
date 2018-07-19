import BaseFilter from './BaseFilter';
import Utils from '../../utils/Utils';

import {decorate, computed, action, observable} from 'mobx';

class MultiFilter extends BaseFilter{
  constructor(fieldName, featureStore, isAnd=false){
    super(fieldName);
    this.type = 'multi';
    this.featureStore = featureStore;
    this.optionMap = new Map();
    this.isSetAll = false;
    this.isAnd = isAnd;
  }

  get isActive(){
    return this.optionMap.size > 0
  }

  get options(){
    let optionMap = new Map();
    let fs = this.isAnd
      ? this.featureStore.filteredFeatures
      : this.featureStore.features;

    for(let f of fs){
      const atrs = f.attributes;
      if(!atrs.hasOwnProperty(this.fieldName) || !atrs[this.fieldName]){
        continue;
      }
      let v = atrs[this.fieldName];
      if(optionMap.has(v)){
        const count = optionMap.get(v);
        optionMap.set(v, count + 1);
      } else {
        optionMap.set(v);
      }
    }
    return Utils.alphSort([...optionMap.entries()], 0);
  }

  get definitionExpression(){
    if(!this.isActive){
      return null;
    }
    const actOpts = [...this.optionMap.keys()];
    const wstr = actOpts.join("','");
    return `${this.fieldName} IN ('${wstr}')`;
  }

  clientIsVisible(featureAttrs){
    if(!this.isActive){
      return true
    }
    if(!featureAttrs.hasOwnProperty(this.fieldName) || !featureAttrs[this.fieldName]){
      return false;
    }
    const v = featureAttrs[this.fieldName];
    return this.optionMap.has(v);
  }

  setMultiOption(option, isChecked){
    if(isChecked){
      this.optionMap.set(option, isChecked);
    } else if (this.optionMap.has(option)){
      this.optionMap.delete(option);
    }
  }
  setAll(isAll){
    this.isSetAll = isAll;
    if(isAll){
      this.options.forEach(opt => this.optionMap.set(opt[0], true));
    } else {
      this.optionMap.clear();
    }
  }
  setIsAnd(isAnd){
    this.isAnd = isAnd;
  }
  clear(){
    this.setAll(false);
  }

}

decorate(MultiFilter, {
  optionMap: observable,
  isSetAll: observable,
  isAnd: observable,
  isActive: computed,
  options: computed,
  definitionExpression: computed,
  setMultiOption: action.bound,
  setAll: action.bound,
  setIsAnd: action.bound,
  clear: action.bound
})

export default MultiFilter;