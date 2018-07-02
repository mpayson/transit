import React, { Component } from 'react';
import FilterGroup from './UIComponents/FilterGroup';
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
import './BrowseWindow.css'

const BrowseWindow = observer(class BrowseWindow extends Component {
  view

  constructor(props, context) {
    super(props, context)
    this.featureStore = props.featureStore;
    this.appState = props.appState
    this.appState.currentPage = 1
    this.appState.itemsPerPage = 4
  }


  render() {
    const featureAttrs = this.featureStore.filteredAttributes;
    
    let pane;
    let isMap;
    if(this.appState.browsePane === 'map'){
      pane = <MapWindow />;
      isMap = true;
    }
  

    return (
      <Container className="mt-3">
        <Row style={{ marginBottom: '5px' }}>
          <FilterGroup dark featureStore={this.featureStore} appState={this.appState}/>
        </Row>
        <hr className="my-4"/>
        <Row>
          <Col>
            <Switch>
              <Route exact path={Utils.url("/browse")} render={(props) => <BrowseList {...props} appState={this.appState} featureStore={this.featureStore}/>}/>
              <Route path={Utils.url("/browse/:id")} render={(props) => <Profile {...props} appState={this.appState} featureStore={this.featureStore}/>}/>
            </Switch>
          </Col>
          <Col>
            <ButtonGroup className="float-right mb-2 d-none d-lg-block">
                <Button outline={isMap} color={isMap ? "secondary" : "primary"} size="sm">
                  Calendar
                </Button>
                <Button outline={!isMap} color={isMap ? "primary" : "secondary"} size="sm">
                  Map
                </Button>
            </ButtonGroup>
            <div className="d-none d-lg-block">
              {pane}
            </div>
          </Col>
        </Row>
      </Container>
    )
  }
})

export default BrowseWindow;