import React from 'react';
import { observer } from 'mobx-react';
import SuFilter from '../UIComponents/SuFilter';

//A component that controls a text query for the filter field
//TODO

const DayTimeFilter = observer(class DayTimeFilter extends React.PureComponent{
  constructor(props, context){
    super(props, context)
    this.filterState = props.filterState
    this.filterStore = props.filterStore

    // this.onChange = this.onChange.bind(this)
    // this.onApplyClick = this.onApplyClick.bind(this)
    // this.onClearClick = this.onClearClick.bind(this)
  }

  // onChange(e) {
  //   const target = e.target
  //   const value = target.value
  //   this.filterState.setVal(value)
  // }

  // onClick(){
  //   this.filterStore.applyFilter(this.filterState.filter)
  // }

  // onClearClick(){
  //   this.filterStore.deleteActiveFilter(this.filterState.filter)
  //   this.filterState.clear()
  // }

  render(){
    // const field = this.filterState.filter
    // const isActive = this.filterState.isActive
    // const val = this.filterState.val
    const isActive = true;  
    return(
      <SuFilter 
        label={"TEST"}
        active={isActive}
        // onApplyClick={this.onApplyClick}
        // onClearClick={this.onClearClick}
        >
        <label className="range-left">
            Min
            <input 
              name={"min"}
              type="number"
              value={0}
              placeholder="is..."
              // onChange={this.onChange}
            />
          </label>
          <label className="range-right">
            Max
            <input 
              name={"max"}
              type="number"
              value={1}
              placeholder="is..."
              // onChange={this.onChange}
            />
          </label>

      </SuFilter>
    )
  }
})


export default DayTimeFilter

