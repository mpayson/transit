import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {toJS} from 'mobx';

import {
  ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Input } from 'reactstrap';

const SelectFilter = observer(class SelectFilter extends Component {

  constructor(props, context){
    super(props, context);

    this.filterObj = props.filterObj;
    this.filterStore = props.filterStore;

    this.onTextChange = this.onTextChange.bind(this);
    this.toggle = this.toggle.bind(this);
    this.onClick = this.onClick.bind(this);
    this.state = {
      dropdownOpen: false,
      filterStr: ''
    };
    this.fieldMap = {};
  }

  toggle(e) {
    if(e.target.id !== 'droptoggle'){
      return;
    }
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  onClick(e){
    const v = e.target.id;
    const field = this.fieldMap[v];
    const fieldFlt = this.filterObj.filterMap.get(field);
    const isChecked = fieldFlt.optionMap.has(v);
    fieldFlt.setMultiOption(v, !isChecked);
  }

  onTextChange(e){
    this.setState({filterStr: e.target.value});
  }

  render() {

    const fieldFlts = this.filterObj.fields.map(f => this.filterObj.filterMap.get(f));
    fieldFlts.forEach(f => 
      f.options.forEach(o => this.fieldMap[o[0]] = f.fieldName)
    )
    
    const lf = this.state.filterStr.toLowerCase();
    const allViews = fieldFlts.map(f => {
      const field = f.fieldName;
      const label = f.label;
      const options = f.options.filter(o => {
        const lo = o[0].toLowerCase();
        return lo.includes(lf);
      })
      const optionViews = options.map(o => {
        const isChecked = f.optionMap.has(o[0]);
        if(isChecked){
          return <DropdownItem
            key={o[0]} id={o[0]} onClick={this.onClick}>
            {o[0]}
            <svg className="float-right" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32"><path fill="#5a9359" d="M11.927 22l-6.882-6.883-3 3L11.927 28 31.204 8.728l-3.001-3.001z"/></svg>
          </DropdownItem>
        }
        return <DropdownItem key={o[0]} id={o[0]} onClick={this.onClick}>{o[0]}</DropdownItem>;
      })
      return (
        <div key={field}>
          <DropdownItem key={field} header>{label}</DropdownItem>
          {optionViews}
        </div>
      )

    })

    const isActive = this.state.dropdownOpen || this.filterObj.isActive;
    const color = isActive ? "success" : "secondary";

    return (
      <ButtonDropdown id="dropbutton" isOpen={this.state.dropdownOpen} toggle={this.toggle}>
      
        <DropdownToggle outline={!isActive} color={color} id="droptoggle" caret>
          {this.filterObj.label}
        </DropdownToggle>
        <DropdownMenu>
          <Input
            placeholder="sm"
            bsSize="sm"
            placeholder="filter"
            value={this.state.filterStr}
            onChange={this.onTextChange}
            style={{paddingRight:'5px', paddingLeft:'5px'}}/>
          {allViews}
        </DropdownMenu>
      </ButtonDropdown>
    );
  }


})

export default SelectFilter;