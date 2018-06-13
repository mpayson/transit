import React, {Component} from 'react';
import { observer } from 'mobx-react';
import './ExpSearchInput.css'

// An expandable search component, could be made more interoperable
const ExpSearchInput = observer (class ExpSearchInput extends Component {
  constructor(props, context){
    super(props, context)
    this.onExpClick = props.onExpClick
    this.onTextChange = props.onTextChange
    this.state = {
      isExpanded: false
    }
    this.onButtonClick = this.onButtonClick.bind(this)
  }

  // Manage the expanded state for the search component
  onButtonClick(){
    const isExpanded = !this.state.isExpanded
    this.setState({isExpanded: isExpanded})
    this.onExpClick(isExpanded)
  }

  render(){
    const searchClass = this.state.isExpanded ? "exp-search exp-search-open" : "exp-search"
    let searchInpClass = this.state.isExpanded
      ? "sb-search-input input-minimal"
      : "sb-search-input input-minimal no-border"
    searchInpClass += this.props.isActive ? " active-border" : ""
    let iconClass = "icon-ui-flush font-size-2 sb-icon-search text-off-black"
    iconClass += this.state.isExpanded ? " icon-ui-close" : " icon-ui-search"
    const placeHolderText = this.state.isExpanded ? "Name or keyword..." : ""
    return(
      <div className={searchClass}>
        <a
          className={iconClass}
          onClick={this.onButtonClick}
          href="#"/>
        <input
          className={searchInpClass}
          placeholder={placeHolderText}
          value={this.props.value}
          onChange={this.onTextChange}/>
      </div>
    )
  }

});

export default ExpSearchInput