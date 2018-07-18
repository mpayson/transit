import {decorate, observable, action, computed} from 'mobx';
import {layerConfig} from '../../config/config';
import Utils from '../../utils/Utils';
import moment from 'moment';


class BaseFilter{
  constructor(fieldName){
    this.fieldName = fieldName
  }
  get label(){
    return layerConfig.labels[this.fieldName] || this.fieldName;
  }
  clientIsFiltered(featureAttrs){
    console.log("IMPLEMENT IS CLIENT FILTERED");
  }
  setFromAttr(featureAttrs){
    return;
  }

}

decorate(BaseFilter, {
  label: computed
})

class CompositeFilter extends BaseFilter{

  filterMap
  type

  constructor(name, fieldTypeArr, featureStore=null, isAnd=false){
    super(name);
    this.isAnd = isAnd;
    this.type = 'composite';

    this.fields = [];
    this.filterMap = new Map();
    for(let ft of fieldTypeArr){
      this.fields.push(ft.name);

      let filter;
      switch(ft.type){
        case 'multi-split':
          filter = new MultiSplitFilter(ft.name, ',', featureStore, isAnd);
          break;
        default:
          throw new Error("UNKNOWN FILTER TYPE");
      }
      this.filterMap.set(ft.name, filter);
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
  
  get totalActive(){
    let active = 0;
    for(let f of this.fields){
      const flt = this.filterMap.get(f);
      if(flt.isActive){
        active += 1;
      }
    }
    return active;
  }

  clear(){
    for(let f of this.fields){
      const flt = this.filterMap.get(f);
      flt.clear();
    }
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
    let t = this.isAnd ? count === this.totalActive : count > 0;
    return t;
  }

  setFromAttr(featureAttrs){
    this.setIsAnd(false);
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
    for(let f of this.fields){
      const flt = this.filterMap.get(f);
      flt.setIsAnd(isAnd);
    }
  }
}

decorate(CompositeFilter, {
  filterMap: observable,
  isAnd: observable,
  isActive: computed,
  definitionExpression: computed,
  setIsAnd: action.bound,
  clear: action.bound,
  setFromAttr: action.bound
})

class NumFilter extends BaseFilter{
  _min;
  _max;

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
    let low;
    for(let f of this.featureStore.features){
      const atrs = f.attributes;
      const v = this._transformValue(atrs);
      if(v < low || !low){
        low = v;
      }
    }
    return Math.floor(low);
  }

  get high(){
    let high;
    for(let f of this.featureStore.features){
      const atrs = f.attributes;
      const v = this._transformValue(atrs);
      if(v > high || !high){
        high = v;
      }
    }
    return Math.ceil(high);
  }

  get definitionExpression(){
    if(!this.min && !this.max){
      return null;
    }
    if(this.min <= this.low && this.max >= this.high){
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

    const v = this._transformValue(featureAttrs);
    
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

  _transformValue(atrs){
    return atrs[this.fieldName];
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
  definitionExpression: computed,
  setMinMax: action.bound,
  clear: action.bound,
  setNumber: action.bound
})

class TimeSinceFilter extends NumFilter{
  _mapCache = new Map();

  constructor(fieldName, unit, featureStore, cache=true){
    super(fieldName, featureStore);
    this.unit = unit;
    this.type = 'time-since';
    this.cache = cache;
  }

  _transformValue(atrs) {
    
    const id = atrs[layerConfig.fieldTypes.oid];
    const rv = atrs[this.fieldName];
    
    if(this._mapCache.has(id)){
      return this._mapCache.get(id);
    } else if (this.cache){
      const v = moment().diff(rv, this.unit, true);
      this._mapCache.set(id, v);
      return v;
    } else {
      return moment().diff(rv, this.unit, true);
    }
  }

  get definitionExpression(){
    if(!this.isActive){
      return null;
    }

    let eD;
    if(this.min || this.min === 0){
      moment().subtract(this.min, this.unit);
      eD = moment().subtract(this.min, this.unit).format();
    }
    let sD;
    if(this.max || this.max === 0){
      sD = moment().subtract(this.max, this.unit).format();
    }
    if(sD && eD){
      return this.fieldName + " <= '" + eD + "' AND " + this.fieldName + " >= '" + sD + "'";
    }
    if(eD){
      return this.fieldName + " <= '" + eD + "'"
    }
    if(sD){
      return this.fieldName + " >= '" + sD + "'"
    }
    return null
    
  }

}

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

export {NumFilter, MultiFilter, MultiSplitFilter, CompositeFilter, TimeSinceFilter}