import React from 'react';
import { observer } from 'mobx-react';
import SelectFilter from '../SelectFilter';

const getFilterView = (f) => {

  switch(f.type){
    case 'multi-multi-split':
      return <SelectFilter filterStore={this.featureStore} filterObj={f}/>
    // case 'num':
    //   return <NumFilter filterStore={this.featureStore} filterObj={f}/>
    default:
      return null;
  }
}

const FilterGroup = observer(({featureStore, appState}) => {

  return (
    <div>
      {getFilterView(featureStore.filters[0])}
    </div>
  )
})

export default FilterGroup