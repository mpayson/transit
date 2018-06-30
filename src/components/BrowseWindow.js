import React, { Component } from 'react';
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

class BrowseWindow extends Component {
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
    const map = <MapWindow />

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
          <Col>
            <Button outline color="secondary">secondary</Button>
            &nbsp;&nbsp;&nbsp;
          <Button outline color="secondary">secondary</Button>
          </Col>
        </Row>
        <Row>
          <Col><p>{featureAttrs.length} volunteers can't wait to meet with you!</p></Col>
          <Col>
            <ButtonGroup className="float-right">
              <Button outline color="secondary">Calendar</Button>
              <Button outline color="secondary">Map</Button>
            </ButtonGroup>
          </Col>
        </Row>
        <Row>
          <Col>
            {listview}
              <Pagination>
                {renderPageNumbers}
              </Pagination>
          </Col>
          <Col>
            {map}
          </Col>
        </Row>
      </Container>
    )
  }
}

export default BrowseWindow;