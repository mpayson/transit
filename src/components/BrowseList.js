import React, { Component } from 'react';
import { observer } from "mobx-react";
import BrowseCards from './BrowseCards';
import {
  Pagination, PaginationItem, PaginationLink
} from 'reactstrap';

const BrowseList = observer(class BrowseList extends Component {

  itemsPerPage = 4;

  constructor(props, context){
    super(props, context);
    this.featureStore = props.featureStore;
    this.appState = props.appState;
    this.handleClick = this.handleClick.bind(this);
    this.featureStore.filterByFeature(props.similar);
  }

  handleClick(e){
   const number = e.target.id;
   this.appState.currentPage = Number(number);
  }

  render(){
    const allAttrs = this.featureStore.filteredAttributes;
    
    const maxPages = Math.ceil(allAttrs.length / this.appState.itemsPerPage);

    let cPage = Math.min(this.appState.currentPage, maxPages)

    const indexLast = cPage * this.appState.itemsPerPage;
    const indexFirst = indexLast - this.appState.itemsPerPage;
    const featureAttrs = this.featureStore.filteredAttributes.slice(indexFirst, indexLast);
    const listView = <BrowseCards featureStore={this.featureStore} featureAttrs={featureAttrs}/>

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(allAttrs.length / this.appState.itemsPerPage); i++) {
      pageNumbers.push(i);
    }

    const renderPageNumbers = pageNumbers.map(number => {
      const isActive = number === cPage;
      return (
        <PaginationItem key={number} active={isActive}>
          <PaginationLink id={number} onClick={this.handleClick}>
            {number}
          </PaginationLink>
        </PaginationItem>
      );
    });

    return(
      <div>
        <h6>{this.featureStore.filteredAttributes.length} volunteers can't wait to meet with you!</h6>
        <div className="view-div mb-2">
          {listView}
        </div>
        <Pagination className="align-self-center">
          {renderPageNumbers}
        </Pagination>
      </div>
    )
  }


});

export default BrowseList;