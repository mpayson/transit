import React, {Component} from 'react';
import {observer} from 'mobx-react';
import Utils from '../../utils/Utils';
import {toJS} from 'mobx';

import {
  Button, ButtonGroup, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Input } from 'reactstrap';

const SelectFilter = observer(class SelectFilter extends Component {

  constructor(props, context){
    super(props, context);

    this.filterObj = props.filterObj;

    this.onTextChange = this.onTextChange.bind(this);
    this.onClearClicked = this.onClearClicked.bind(this);
    this.onAndClicked = this.onAndClicked.bind(this);
    this.onOrClicked = this.onOrClicked.bind(this);

    this.onClick = this.onClick.bind(this);
    this.state = {
      filterStr: ''
    };
    this.fieldMap = {};
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

  onAndClicked(e){
    this.filterObj.setIsAnd(true);
  }
  onOrClicked(e){
    this.filterObj.setIsAnd(false);
  }
  onClearClicked(e){
    this.filterObj.clear();
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
        const optionStr = Utils.formatSurveyStr(o[0]);
        if(isChecked){
          return <DropdownItem style={{whiteSpace: "normal"}}
            key={o[0]} id={o[0]} onClick={this.onClick}>
            {optionStr}
            <svg className="float-right" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32"><path fill="#47BCAD" d="M11.927 22l-6.882-6.883-3 3L11.927 28 31.204 8.728l-3.001-3.001z"/></svg>
          </DropdownItem>
        }
        return <DropdownItem key={o[0]} id={o[0]} onClick={this.onClick}>{optionStr}</DropdownItem>;
      })
      const header = optionViews.length > 0
        ? <DropdownItem key={field} header>{label}</DropdownItem>
        : null;
      const divider = optionViews.length > 0
        ? <DropdownItem divider />
        : null;
      return (
        <div key={field}>
          {header}
          {optionViews}
          {divider}
        </div>
      )

    })

    return (

      <div style={{minWidth:"12rem", maxHeight:"20rem", overflowY:"scroll"}}>
        <div className="mr-1 ml-1">
          <Input
            placeholder="sm"
            bsSize="sm"
            placeholder="filter"
            value={this.state.filterStr}
            onChange={this.onTextChange}
            />
        </div>
        <Button
          className="ml-2 mt-1"
          size="sm"
          color="link"
          style={{padding: '0.25rem'}}
          onClick={this.onClearClicked}>
          Clear
        </Button>
        <ButtonGroup className="float-right mt-1 mr-2">
            <Button
              outline={!this.filterObj.isAnd}
              color={this.filterObj.isAnd ? 'primary' : 'secondary'}
              size="sm"
              style={{padding: '0.25rem', fontSize:'0.65rem'}}
              onClick={this.onAndClicked}>
              and
            </Button>
            <Button
              outline={this.filterObj.isAnd}
              color={this.filterObj.isAnd ? 'secondary': 'primary'}
              size="sm"
              style={{padding: '0.25rem', fontSize:'0.65rem'}}
              onClick={this.onOrClicked}>
              or
            </Button>
        </ButtonGroup>
        {allViews}
      </div>
    );
  }


})

export default SelectFilter;