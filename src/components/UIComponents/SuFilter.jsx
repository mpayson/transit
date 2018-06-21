import React from 'react';
import DropPanel from '../UIComponents/DropPanel'
import './SuFilter.css';

// A util component that creates a dropdown filter (adds "apply" and "clear")
// It handles it's own dropdown state
class SuFilter extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.state = {open: false}
    this.controlToggle = this.controlToggle.bind(this)
    this.onApplyClick = this.onApplyClick.bind(this)
    this.onClearClick = this.onClearClick.bind(this)

  }

  controlToggle(isOpen){
    this.setState({open: isOpen})
  }

  onApplyClick(){
    this.setState({open: false})
    this.props.onApplyClick()
  }

  onClearClick(){
    this.setState({open: false})
    this.props.onClearClick()
  }

  render(){
    const label = this.props.label
    const children = this.props.children
    return (
      <DropPanel 
        label={label}
        open={this.state.open}
        active={this.props.active}
        controlToggle={this.controlToggle}>

        {children}
        <button onClick={this.onApplyClick} className="btn filter-btn">Apply</button>
        <button onClick={this.onClearClick} className="btn btn-clear filter-btn">Clear</button>
      </DropPanel>
    )
  }
}

export default SuFilter