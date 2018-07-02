import React from 'react';
import { observer } from 'mobx-react';
import SelectFilter from '../SelectFilter';
import SlideFilter from '../SlideFilter';

const getFilterView = (f, dark) => {
  switch(f.type){
    case 'multi-multi-split':
      return <SelectFilter dark={dark} filterStore={this.featureStore} filterObj={f}/>
    case 'num':
      return <SlideFilter dark={dark} filterStore={this.featureStore} filterObj={f}/>
    default:
      return null;
  }
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