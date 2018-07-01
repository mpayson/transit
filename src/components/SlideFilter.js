import React, {Component} from 'react';
import {observer} from 'mobx-react';
import Rheostat from 'rheostat';
import './SlideFilter.css';

import {
  ButtonDropdown, DropdownToggle, DropdownMenu,
  Button} from 'reactstrap';

const SlideFilter = observer(class SlideFilter extends Component {

  constructor(props, context){
    super(props, context);

    this.filterObj = props.filterObj;
    this.filterStore = props.filterStore;

    this.handle = this.handle.bind(this);
    this.toggle = this.toggle.bind(this);
    this.onClear = this.onClear.bind(this);
    this.state = {
      dropdownOpen: false
    };

  }

  toggle(e) {
    if(e.target.id !== 'droptoggle'){
      return;
    }
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  handle(e) {
    this.filterObj.setMinMax(e.values);
  }

  onClear(){
    this.filterObj.clear();
  }

  render() {

    const isActive = this.filterObj.isActive;
    const color = isActive ? "success" : "light";

    return (
      <ButtonDropdown id="dropbutton" isOpen={this.state.dropdownOpen} toggle={this.toggle}>
      
        <DropdownToggle outline={!isActive} color={color} id="droptoggle" caret>
          {this.filterObj.label}
        </DropdownToggle>
        <DropdownMenu>
          <div
            style={{width:"15rem", height:"5rem"}}
            className="pt-2 pr-4 pl-4 pb-2 mw-25">
            <Rheostat
              min={this.filterObj.low}
              max={this.filterObj.high}
              values={[this.filterObj.min, this.filterObj.max]}
              onValuesUpdated={this.handle}
            />
              <div className="float-left">{`${this.filterObj.low} years`}</div>
              <div className="float-right">{`${this.filterObj.high} years`}</div>
          </div>
          <Button onClick={this.onClear} outline size="sm" className="float-right mr-2 mb-2">Clear range</Button>
        </DropdownMenu>
      </ButtonDropdown>
    );
  }


})

export default SlideFilter;