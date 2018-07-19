import NumFilter from './NumFilter';
import {layerConfig} from  '../../config/config';
import moment from 'moment';


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

export default TimeSinceFilter;