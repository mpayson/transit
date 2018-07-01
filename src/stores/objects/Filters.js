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
      if(flt.isClientFiltered(featureAttrs)){
        return true;
      }
    }
    return false;
  }

}

decorate(MultiFieldFilter, {
  filterMap: observable,
  isActive: computed
})


class NumFilter extends BaseFilter{
  _min = -1;
  _max = 100;

  constructor(fieldName, featureStore){
    super(fieldName);
    this.type = 'num';
    this.featureStore = featureStore;
  }

  setNumber(value, isMax){
    if(isMax){
      this._max = value;
    } else {
      this._min = value;
    }
  }

  setMinMax(values){
    this.setNumber(values[0], false);
    this.setNumber(values[1], true);
  }

  get min(){
    if(this._min > this.low){
      return this._min;
    }
    return this.low;
  }

  get max(){
    if(this._max < this.high){
      return this._max;
    }
    return this.high;
  }

  get isActive(){
    return this.min > this.low || this.max < this.high;
  }

  get low(){
    let low = 100;
    for(let f of this.featureStore.features){
      const atrs = f.attributes;
      const v = atrs[this.fieldName];
      if(v < low){
        low = v;
      }
    }
    return low;
  }

  get high(){
    let high = 0;
    for(let f of this.featureStore.features){
      const atrs = f.attributes;
      const v = atrs[this.fieldName];
      if(v > high){
        high = v;
      }
    }
    return high;
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
    this._min = this.low;
    this._max = this.high;
  }
}
decorate(NumFilter, {
  _min: observable,
  _max: observable,
  min: computed,
  max: computed,
  low: computed,
  high: computed,
  isActive: computed,
  setMinMax: action.bound,
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

  isClientFiltered(featureAttrs){
    if(this.optionMap.size < 1){
      return false;
    }
    if(!featureAttrs.hasOwnProperty(this.fieldName) || !featureAttrs[this.fieldName]){
      console.log("HERE");
      return true;
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