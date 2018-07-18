import React, {Component} from 'react';
import {observer} from 'mobx-react';
import SelectFilter from './SelectFilter';
import SlideFilter from './SlideFilter';

import {
  Container, Row, Col, Button, ButtonGroup, Input } from 'reactstrap';

const CompositeFilter = observer(class CompositeFilter extends Component {

  constructor(props, context){
    super(props, context);

    this.filterObj = props.filterObj;

    this.onTextChange = this.onTextChange.bind(this);
    this.onClearClicked = this.onClearClicked.bind(this);
    this.onAndClicked = this.onAndClicked.bind(this);
    this.onOrClicked = this.onOrClicked.bind(this);
    this.onFilterClicked = this.onFilterClicked.bind(this);

    this.refs = [];
    this.searchRef = React.createRef();

    this.state = {
      filterStr: ''
    };

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

  onFilterClicked(e){
    const sid = e.target.id;
    if(sid === 'search'){
      this.searchRef.current.scrollIntoView({block: 'start', behavior: 'smooth'});
      return;
    }
    const id = parseInt(sid, 10);
    if(this.refs && id < this.refs.length){
      const node = this.refs[id];
      node.current.scrollIntoView({block: 'start', behavior: 'smooth'});
    }

    
  }

  render() {
    
    const lf = this.state.filterStr.toLowerCase();
    const fields = this.filterObj.fields;
    
    this.refs = [];
    let allViews = [];
    let headers = [];

    for(let i = 0; i < fields.length; i++){
      const field = fields[i];
      const f = this.filterObj.filterMap.get(field);
      const label = f.label;

      const newRef = React.createRef();
      this.refs.push(newRef);

      let filterView;
      switch(f.type){
        case 'multi-split':
          filterView = <SelectFilter multi filterStr={lf} filterObj={f}/>;
          break;
        case 'num':
          filterView = <SlideFilter filterObj={f}/>;
          break;
        case 'time-since':
          filterView = <SlideFilter filterObj={f}/>;
          break;
        default:
          throw new Error("UNKNOWN FILTER TYPE");
      }

      const newView = (
        <div ref={newRef} key={field}>
          {filterView}
        </div>
      )
      allViews.push(newView);

      const newHeader = (
        <div key={`${field}-nav`}>
          <Button
            id={i}
            size="sm"
            color="link"
            className="text-secondary clearfix"
            onClick={this.onFilterClicked}>
            {label}
          </Button>
        </div>
      )
      headers.push(newHeader);
    }

    return (
      <div style={{width: '22rem', maxWidth: '60vw'}}>
      <Container fluid>
          <Row>
            <Col md="4" className="d-none d-sm-block mt-1 pr-0" >
              <div style={{maxHeight:"20rem", overflowY:"scroll"}}>
                <Button
                  id='search'
                  size="sm"
                  color="link"
                  className="text-secondary clearfix"
                  onClick={this.onFilterClicked}>
                  Search
                </Button>
                {headers}
              </div>
            </Col>
            <Col md="8">
            <div style={{maxHeight:"20rem", overflowY:"scroll"}}>
              <div ref={this.searchRef} id='search' className="mb-2 mt-1">
                <Input
                  bsSize="sm"
                  placeholder="search"
                  value={this.state.filterStr}
                  onChange={this.onTextChange}
                  />
              </div>
              <Button
                  size="sm"
                  color="link"
                  className="pt-0 pl-0 ml-1"
                  onClick={this.onClearClicked}>
                  Clear
              </Button>
              <ButtonGroup className="float-right mr-1">
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
          </Col>
        </Row>
        
      </Container>
      </div>
    );
  }


})

export default CompositeFilter;