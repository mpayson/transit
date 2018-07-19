import {decorate, computed, action, observable} from 'mobx';
import BaseFilter from './BaseFilter';

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

export default NumFilter;