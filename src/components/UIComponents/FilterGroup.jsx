import React from 'react';
import { observer } from 'mobx-react';
import SelectFilter from '../SelectFilter';
import SlideFilter from '../SlideFilter';

const getFilterView = (f) => {

  switch(f.type){
    case 'multi-multi-split':
      return <SelectFilter filterStore={this.featureStore} filterObj={f}/>
    case 'num':
      return <SlideFilter filterStore={this.featureStore} filterObj={f}/>
    default:
      return null;
  }
}

const FilterGroup = observer(({featureStore, appState}) => {

  return (
    <div>
      {getFilterView(featureStore.filters[1])}
      &nbsp;&nbsp;&nbsp;
      {getFilterView(featureStore.filters[0])}
    </div>
  )
})

export default FilterGroup