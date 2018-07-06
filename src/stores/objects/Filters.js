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
  setFromAttr(featureAttrs){
    return;
  }

}

decorate(BaseFilter, {
  label: computed
})

class MultiFieldFilter{

  filterMap
  type

  constructor(label, fields, filterType, featureStore=null, isAnd=false){
    this.label = label;
    this.fields = fields;
    this.filterMap = new Map();
    this.isAnd = isAnd;
    if(filterType === 'multi-split'){
      this.type = 'multi-multi-split';
      fields.forEach(f => {
        this.filterMap.set(f, new MultiSplitFilter(f, ',', featureStore, isAnd));
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

  clientIsVisible(featureAttrs){
    let count = 0;

    if(!this.isActive){
      return true;
    }

    for(let f of this.fields){
      const flt = this.filterMap.get(f);
      if(flt.isActive && flt.clientIsVisible(featureAttrs)){
        count += 1;
      }
    }
    let t = this.isAnd ? count === this.fields.length : count > 0;
    return t;
  }

  setFromAttr(featureAttrs){
    for(let f of this.fields){
      const flt = this.filterMap.get(f);
      flt.setFromAttr(featureAttrs);
    }
  }

  get definitionExpression(){
    const sep = this.isAnd ? "AND" : "OR";
    let defExp = null;
    for(let f of this.fields){
      const flt = this.filterMap.get(f);
      if(!flt.definitionExpression){
        continue;
      }
      if(!defExp){
        defExp = flt.definitionExpression;
      } else {
        defExp += ` ${sep} ${flt.definitionExpression}`
      }
    }
    return defExp;
  }

  setIsAnd(isAnd){
    this.isAnd = isAnd;
  }
}

decorate(MultiFieldFilter, {
  filterMap: observable,
  isAnd: observable,
  isActive: computed,
  setIsAnd: action.bound,
  setFromAttr: action.bound
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

  get definitionExpression(){
    if(this.min === null && this.max === null){
      return null;
    }
    const isMin = this.min || this.min === 0;
    const isMax = this.max || this.max === 0;
    if(isMin && isMax){
      return this.fieldName + " <= " + this.max + " AND " + this.fieldName + " >= " + this.min;
    }
    if(isMax){
      return this.fieldName + " <= " + this.max;
    }
    if(isMin){
      return this.fieldName + " >= " + this.min;
    }
    return null
  }

  clientIsVisible(featureAttrs){

    if(!this.isActive){
      return true;
    }

    if (typeof featureAttrs[this.fieldName] === 'undefined'){
      return false;
    }

    let t = true;

    const v = featureAttrs[this.fieldName];
    const isMin = this.min || this.min === 0;
    const isMax = this.max || this.max === 0;

    if(isMin && isMax){
      t = (v >= this.min && v <= this.max)
    }
    else if(isMin){
      t = (v >= this.min)
    }
    else if(isMax){
      t = (v <= this.max)
    }
    return t;
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
  constructor(fieldName, delimeter, featureStore, isAnd=false){
    super(fieldName);
    this.type = 'multi-split';
    this.featureStore = featureStore;
    this.optionMap = new Map();
    this.delimeter = delimeter;
    this.isSetAll = false;
    this.isAnd = isAnd;
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
decorate(MultiSplitFilter, {
  optionMap: observable,
  isSetAll: observable,
  isAnd: observable,
  isActive: computed,
  // options: computed,
  setMultiOption: action.bound,
  setAll: action.bound,
  clear: action.bound,
  setIsAnd: action.bound,
  setFromAttr: action.bound
})

export {NumFilter, MultiSplitFilter, MultiFieldFilter}