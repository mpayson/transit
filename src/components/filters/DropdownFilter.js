import React, {Component} from 'react';
import {observer} from 'mobx-react';

import {ButtonDropdown, DropdownToggle, DropdownMenu} from 'reactstrap';

const DropdownFilter = observer(class SlideFilter extends Component {
  constructor(props, context){
    super(props, context);
    this.filterObj = props.filterObj;
    
    this._toggle = this._toggle.bind(this);
    this.state = {
      dropdownOpen: false
    }
  }

  _toggle(e){
    if(e.target.id !== 'droptoggle'){
      return;
    }
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  render(){

    const isActive = this.filterObj.isActive;
    const dark = this.props.dark ? "secondary" : "light";
    const color = isActive ? "success" : dark;

    return (
      <ButtonDropdown
        className={this.props.className} id="dropbutton" isOpen={this.state.dropdownOpen} toggle={this._toggle}>
        <DropdownToggle outline={!isActive} color={color} id="droptoggle" caret>
          {this.filterObj.label}
        </DropdownToggle>
        <DropdownMenu>
          {this.props.children}
        </DropdownMenu>
      </ButtonDropdown>
    )

  }

})

export default DropdownFilter