import {decorate, computed, action, observable} from 'mobx';
import BaseFilter from './BaseFilter';
import MultiSplitFilter from './MultiSplitFilter';

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

export default CompositeFilter;