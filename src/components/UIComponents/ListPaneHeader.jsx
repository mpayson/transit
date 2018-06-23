import React from 'react';
import { observer } from 'mobx-react';
import MultiSplitFilter from '../UIComponents/MultiSplitFilter';
import NumFilter from '../UIComponents/NumFilter'
import './ListPaneHeader.css';

//A component that wraps the filter headers for the list pane
const ListPaneHeader = observer (class ListPaneHeader extends React.Component {

  constructor(props, context){
    super(props, context)
    this.featureStore = props.featureStore
    this.appState = props.appState
  }

  getFilter(index){
    const f = this.featureStore.filters[index];
    switch(f.type){
      case 'multi-split':
        return <MultiSplitFilter filterStore={this.featureStore} filterObj={f}/>
      case 'num':
        return <NumFilter filterStore={this.featureStore} filterObj={f}/>
      default:
        return null;
    }
    
  }

  render() {
    return(
      <div className="header">
        {this.getFilter(0)}
        {this.getFilter(1)}
      </div>
    )
  }
})

export default ListPaneHeader