import React from 'react';
import { observer } from 'mobx-react';
import DropdownFilter from './DropdownFilter';
import SelectFilter from './SelectFilterOld';
import SlideFilter from './SlideFilter';

const getFilterView = (f, dark) => {

  let FilterView;

  switch(f.type){
    case 'composite':
      FilterView = SelectFilter;
      break;
    case 'num':
      FilterView = SlideFilter;
      break;
    case 'time-since':
      FilterView = SlideFilter;
      break;
    default:
      throw "UNKNOWN FILTER TYPE";
  }

  return (
    <DropdownFilter dark={dark} filterObj={f}>
      <FilterView filterObj={f}/>
    </DropdownFilter>
  )
}

const FilterGroup = observer(({featureStore, appState, dark}) => {

  return (
    <div>
      {getFilterView(featureStore.filters[1], dark)}
      &nbsp;&nbsp;&nbsp;
      {getFilterView(featureStore.filters[0], dark)}
    </div>
  )
})

export default FilterGroup