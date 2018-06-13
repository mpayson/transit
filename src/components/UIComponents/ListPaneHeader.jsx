import React from 'react';
import { observer } from 'mobx-react';
import DayTimeFilter from './DayTimeFilter';
import './ListPaneHeader.css';

//A component that wraps the filter headers for the list pane
const ListPaneHeader = observer (class ListPaneHeader extends React.PureComponent {

  constructor(props, context){
    super(props, context)
    this.featureStore = props.featureStore
    this.appState = props.appState
  }

  getFilter(index){
    return <DayTimeFilter/>
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