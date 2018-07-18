import React, { Component } from 'react';
import FilterGroup from './filters/FilterGroup';
import BrowseList from './BrowseList';
import { observer } from "mobx-react";
import { Route, Switch, Link } from "react-router-dom";
import Profile from './Profile';
import Utils from '../utils/Utils';

import {
  Button,
  ButtonGroup,
  Container,
  Row,
  Col,
} from 'reactstrap';

import MapWindow from './MapWindow'
import CalendarWindow from './CalendarWindow';
import './BrowseWindow.css'

const BrowseWindow = observer(class BrowseWindow extends Component {
  view

  constructor(props, context) {
    super(props, context)
    this.featureStore = props.featureStore;
    this.appState = props.appState;
    this._onMapClicked = this._onMapClicked.bind(this);
    this._onCalendarClicked = this._onCalendarClicked.bind(this);
  }

  _onMapClicked(e){
    this.appState.setBrowsePane("map");
  }
  _onCalendarClicked(e){
    this.appState.setBrowsePane("cal");
  }

  render() {
    
    let pane;
    let isMap;
    if(this.appState.browsePane === 'map'){
      pane = <Route path={Utils.url("/browse/:id?")} render={(props) => <MapWindow {...props} featureStore={this.featureStore}/>}/>;
      isMap = true;
    } else {
      pane = <Route path={Utils.url("/browse/:id?")} render={(props) => <CalendarWindow {...props} featureStore={this.featureStore}/>}/>;
      isMap = false;
    }

    return (
      <Container className="mt-3">
        <Row style={{ marginBottom: '5px' }}>
          <FilterGroup dark filterObjs={this.featureStore.filters}/>
        </Row>
        <hr className="my-4"/>
        <Row>
          <Col>
            <Switch>
              <Route 
                exact
                path={Utils.url("/browse")}
                render={(props) => <BrowseList {...props} appState={this.appState} featureStore={this.featureStore}/>}
              />
              <Route path={Utils.url("/browse/:id")} render={(props) => <Profile {...props} appState={this.appState} featureStore={this.featureStore}/>}/>
            </Switch>
          </Col>
          <Col className="d-none d-lg-block">
              <ButtonGroup className="float-right clearfix mb-1 d-none d-lg-block">
                  <Button onClick={this._onCalendarClicked} outline={isMap} color={isMap ? "secondary" : "primary"} size="sm">
                    Calendar
                  </Button>
                  <Button onClick={this._onMapClicked} outline={!isMap} color={isMap ? "primary" : "secondary"} size="sm">
                    Map
                  </Button>
              </ButtonGroup>
            <div style={{clear:"both", width:"100%", height:"calc(80vh - 5rem)"}}>
              {pane}
            </div>
          </Col>
        </Row>
      </Container>
    )
  }
})

export default BrowseWindow;