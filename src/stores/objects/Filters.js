import {decorate, observable, action, computed, toJS} from 'mobx';
import {layerConfig} from '../../config/config';
import Utils from '../../utils/Utils';


class BaseFilter{
  constructor(fieldName){
    this.fieldName = fieldName
  }
  get label(){
    return layerConfig.labels[this.fieldName];
  }
  isClientFiltered(featureAttrs){
    console.log("IMPLEMENT IS CLIENT FILTERED");
  }

}

decorate(BaseFilter, {
  label: computed
})

class MultiFieldFilter{

  filterMap
  type

  constructor(label, fields, filterType, featureStore=null){
    this.label = label;
    this.fields = fields;
    this.filterMap = new Map();
    if(filterType === 'multi-split'){
      this.type = 'multi-multi-split';
      fields.forEach(f => {
        this.filterMap.set(f, new MultiSplitFilter(f, ',', featureStore));
      })

    }
  }

  get isActive(){
    for(let f of this.fields){
      const flt = this.filterMap.get(f);
      if(flt.isActive){
        return true
      }
    }
    return false;
  }

  isClientFiltered(featureAttrs){
    for(let f of this.fields){
      const flt = this.filterMap.get(f);
      if(!flt.isClientFiltered(featureAttrs)){
        return false;
      }
    }
    return true;
  }

}

decorate(MultiFieldFilter, {
  filterMap: observable,
  isActive: computed
})


class NumFilter extends BaseFilter{
  min
  max

  constructor(fieldName){
    super(fieldName);
    this.type = 'num';
  }

  setNumber(value, isMax){
    if(isMax){
      this.max = value;
    } else {
      this.min = value;
    }
  }

  isClientFiltered(featureAttrs){
    if (typeof featureAttrs[this.fieldName] === 'undefined'){
      return true;
    }
    const min = parseInt(this.min, 10);
    const max = parseInt(this.max, 10);
    const v = featureAttrs[this.fieldName];
    if(min && max){
      return (v < min || v > max);
    }
    if(min){
      return (v < min)
    }
    if(max){
      return (v > max)
    }
  }
  clear(){
    this.min = null;
    this.max = null;
  }
}
decorate(NumFilter, {
  min: observable,
  max: observable,
  clear: action.bound,
  setNumber: action.bound
})



class MultiSplitFilter extends BaseFilter{
  constructor(fieldName, delimeter, featureStore){
    super(fieldName);
    this.type = 'multi-split';
    this.featureStore = featureStore;
    this.optionMap = new Map();
    this.delimeter = delimeter;
    this.isSetAll = false;
  }

  get isActive(){
    return this.optionMap.size > 0;
  }

  get options(){
    let optionMap = new Map();
    for(let f of this.featureStore.features){
      const atrs = f.attributes;
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

  isClientFiltered(featureAttrs){
    if (typeof featureAttrs[this.fieldName] === 'undefined'){
      return true;
    }
    if(this.optionMap.size < 1){
      return false;
    }
    let attrArr = featureAttrs[this.fieldName].split(this.delimeter);
    for(let i = 0; i < attrArr.length; i++){
      const tAttr = attrArr[i].trim();
      if (this.optionMap.has(tAttr)){
        return false;
      }
    }
    return true;
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
  clear(){
    this.setAll(false);
  }
}
decorate(MultiSplitFilter, {
  optionMap: observable,
  isSetAll: observable,
  isActive: computed,
  // options: computed,
  setMultiOption: action.bound,
  setAll: action.bound,
  clear: action.bound
})

export {NumFilter, MultiSplitFilter, MultiFieldFilter}