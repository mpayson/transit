import React, {Component} from 'react';
import { observer } from 'mobx-react';
import SuFilter from '../UIComponents/SuFilter';
import './NumFilter.css';

const NumFilter = observer(class NumFilter extends Component{
  constructor(props, context){
    super(props,)
    this.filterObj = props.filterObj;
    this.filterStore = props.filterStore;

    this.onApplyClick = this.onApplyClick.bind(this);
    this.onClearClick = this.onClearClick.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    const target = e.target
    const name = target.name
    const value = target.value
    this.filterObj.setNumber(value, name==='max')
  }

  onApplyClick(){
    this.filterStore.applyFilter(this.filterObj);
  }

  onClearClick(){
    this.filterStore.deleteActiveFilter(this.filterObj);
  }

  render() {
    let isActive = this.filterStore.activeFilterMap.has(this.filterObj.fieldName);
    let min = this.filterObj.min || ''
    let max = this.filterObj.max || ''
    return(
      <SuFilter 
        label={this.filterObj.label}
        active={isActive}
        onApplyClick={this.onApplyClick}
        onClearClick={this.onClearClick}>
        <label className="range-left">
          Min
          <input 
            name={"min"}
            type="number"
            value={min}
            placeholder="is..."
            onChange={this.onChange}
          />
        </label>
        <label className="range-right">
          Max
          <input 
            name={"max"}
            type="number"
            value={max}
            placeholder="is..."
            onChange={this.onChange}
          />
        </label>
      </SuFilter>
    )
  }
  
})

export default NumFilter;