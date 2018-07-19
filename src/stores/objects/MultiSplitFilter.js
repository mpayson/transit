import {decorate, computed, action} from 'mobx';
import MultiFilter from './MultiFilter';
import Utils from '../../utils/Utils';

class MultiSplitFilter extends MultiFilter{
  constructor(fieldName, delimeter, featureStore, isAnd=false){
    super(fieldName, featureStore, isAnd);
    this.supportsAndOr = true;
    this.type = 'multi-split';
    this.delimeter = delimeter;
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
      const newOpts = atrs[this.fieldName].split(this.delimeter);
      for(let opt of newOpts){
        const tOpt = opt.trim();
        if(optionMap.has(tOpt)){
          const count = optionMap.get(tOpt);
          optionMap.set(tOpt, count + 1);
        } else {
          optionMap.set(tOpt, 1);
        }
      }
    }
    return Utils.alphSort([...optionMap.entries()], 0);
  }

  clientIsVisible(featureAttrs){
    if(!this.isActive){
      return true;
    }

    if(!featureAttrs.hasOwnProperty(this.fieldName) || !featureAttrs[this.fieldName]){
      return false;
    }

    let attrArr = featureAttrs[this.fieldName].split(this.delimeter);
    let count = 0;
    for(let i = 0; i < attrArr.length; i++){
      const tAttr = attrArr[i].trim();
      if(this.optionMap.has(tAttr)){
        count += 1;
      }
    }
    let t = this.isAnd ? count === this.optionMap.size : count > 0;
    return t;
  }

  get definitionExpression(){
    const sep = this.isAnd ? "AND" : "OR";
    let defExp = null;
    for(let i of this.optionMap.keys()){
      if(!defExp){
        defExp = `${this.fieldName} LIKE '%${i}%'`;
      } else {
        defExp += ` ${sep} ${this.fieldName} LIKE '%${i}%'`;
      }
    }
    return defExp;
  }

  setFromAttr(featureAttrs){
    this.clear();
    if(!featureAttrs.hasOwnProperty(this.fieldName) || !featureAttrs[this.fieldName]){
      return;
    }
    let attrArr = featureAttrs[this.fieldName].split(this.delimeter);
    for(let i = 0; i < attrArr.length; i++){
      const tAttr = attrArr[i].trim();
      this.setMultiOption(tAttr, true);
    }
  }

}
decorate(MultiSplitFilter, {
  definitionExpression: computed,
  options: computed,
  setFromAttr: action.bound
})

export default MultiSplitFilter;