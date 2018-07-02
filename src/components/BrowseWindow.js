import React, { Component } from 'react';
import FilterGroup from './UIComponents/FilterGroup';

import { observer } from "mobx-react";
import { layerConfig } from '../config/config';
import {
  Button,
  ButtonGroup,
  Container,
  Row,
  Col,
  Pagination, PaginationItem, PaginationLink
} from 'reactstrap';

import BrowseListView from './BrowseListView'
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
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(number) {
    this.appState.currentPage = Number(number);
  }


  render() {
    const featureAttrs = this.featureStore.filteredAttributes;
    
    let pane;
    let isMap;
    if(this.appState.browsePane === 'map'){
      pane = <MapWindow />;
      isMap = true;
    }
    
    // pagination
    const indexLast = this.appState.currentPage * this.appState.itemsPerPage;
    const indexFirst = indexLast - this.appState.itemsPerPage;
    const listview = <BrowseListView featureStore={this.featureStore} appState={this.appState} />
    // Logic for displaying page numbers
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(featureAttrs.length / this.appState.itemsPerPage); i++) {
      pageNumbers.push(i);
    }

    const renderPageNumbers = pageNumbers.map(number => {
      return (
        <PaginationItem>
          <PaginationLink key={number} id={number} onClick={this.handleClick.bind(this, number)}>
            {number}
          </PaginationLink>
        </PaginationItem>
      );
    });

    return (
      <Container className="mt-3">
        <Row style={{ marginBottom: '5px' }}>
          <FilterGroup dark featureStore={this.featureStore} appState={this.appState}/>
        </Row>
        <hr className="my-4"/>
        <Row>
          <Col><h6>{featureAttrs.length} volunteers can't wait to meet with you!</h6></Col>
          <Col>
            <ButtonGroup className="float-right mb-2 d-none d-lg-block">
              <Button outline={isMap} color={isMap ? "secondary" : "primary"} size="sm">
                Calendar
              </Button>
              <Button outline={!isMap} color={isMap ? "primary" : "secondary"} size="sm">
                Map
              </Button>
            </ButtonGroup>
          </Col>
        </Row>
        <Row>
          <Col>
            <div className="view-div mb-2">
              {listview}
            </div>
            <Pagination className="align-self-center">
              {renderPageNumbers}
            </Pagination>
          </Col>
          <Col className="d-none d-lg-block">
            {pane}
          </Col>
        </Row>
      </Container>
    )
  }
})

export default BrowseWindow;