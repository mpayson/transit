import React from 'react';
import { observer } from 'mobx-react';
import DropdownFilter from './DropdownFilter';
import CompositeFilter from './CompositeFilter';
import SelectFilter from './SelectFilter';
import SlideFilter from './SlideFilter';


const FilterGroup = observer(({filterObjs, dark}) => {

  const filterViews = filterObjs.map((f, i) => {
    let filterView;
    switch(f.type){
      case 'composite':
        filterView = <CompositeFilter filterObj={f}/>;
        break;
      case 'multi-split':
        filterView = <SelectFilter filterObj={f}/>;
        break;
      case 'multi':
        filterView = <SelectFilter filterObj={f}/>
        break;
      case 'num':
        filterView = <SlideFilter filterObj={f}/>;
        break;
      case 'time-since':
        filterView = <SlideFilter filterObj={f}/>;
        break;
      default:
        throw new Error("UNKNOWN FILTER TYPE");
    }
    const dropdownFilter = (
      <DropdownFilter className="mr-2" dark={dark} filterObj={f}>
        {filterView}
      </DropdownFilter>
    )
    if(i > 1){
      return (
        <div key={f.label} className="float-right d-none d-sm-block">
          {dropdownFilter}
        </div>
      )
    }

    return (
      <DropdownFilter key={f.label} className="mr-2" dark={dark} filterObj={f}>
        {filterView}
      </DropdownFilter>
    )
  })

  return (
    <div>
      {filterViews}
    </div>
  )
})

export default FilterGroup