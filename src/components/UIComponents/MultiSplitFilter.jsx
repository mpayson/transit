import React, {Component} from 'react';
import { observer } from 'mobx-react';
import SuFilter from '../UIComponents/SuFilter';
import './MultiSplitFilter.css';

//A component that controls a multi-select query for the filter field
//When clicked the filter is automatically applied

const MultiSplitFilter = observer(class MultiSplitFilter extends Component {

  constructor(props, context){
    super(props, context);

    this.filterObj = props.filterObj
    this.filterStore = props.filterStore
    

    this.onApplyClick = this.onApplyClick.bind(this)
    this.onClearClick = this.onClearClick.bind(this)
    this.onCheckboxClick = this.onCheckboxClick.bind(this)
    this.onSelectAllClick = this.onSelectAllClick.bind(this)
    this._getItemView = this._getItemView.bind(this)
  }

  onCheckboxClick(e) {
    const target = e.target;
    const isChecked = target.checked;
    const option = target.name
    this.filterObj.setMultiOption(option, isChecked)
  }
  onSelectAllClick(e){
    const target = e.target;
    const isChecked = target.checked;
    this.filterObj.setAll(isChecked)
  }

  _getItemView(opt, optStates){
    const name = opt[0];
    const label = name + ' (' + opt[1].toString() +')';
    const val = this.filterObj.optionMap.has(name);
    return(
      <label key={name}>
        <input
          name={name}
          type="checkbox"
          checked={val}
          onChange={this.onCheckboxClick} />
        {label}
      </label>
    )
  }

  _getItems() {
    return this.filterObj.options.map(this._getItemView);
  }

  onApplyClick(){
    this.filterStore.applyFilter(this.filterObj);
  }

  onClearClick(){
    this.filterStore.deleteActiveFilter(this.filterObj);
    this.filterObj.clear();
  }

  render() {
    let isActive = this.filterStore.activeFilterMap.has(this.filterObj.fieldName);
    const allActive = this.filterObj.isSetAll;
    return(
      <SuFilter 
        label={this.filterObj.label}
        active={isActive}
        onApplyClick={this.onApplyClick}
        onClearClick={this.onClearClick}>
        <label id="top-filter">
          <input
            type="checkbox"
            checked={allActive}
            onChange={this.onSelectAllClick} />
          All
        </label>
        <div className="panel panel-white children-container">
          <fieldset className="fieldset-checkbox">
            {this._getItems()}
          </fieldset>
        </div>
      </SuFilter>
    )
  }
})

export default MultiSplitFilter;
