import React, { Component } from 'react';
import { observer, Observer } from "mobx-react";
import {MockCard, BrowseCard} from './BrowseCard';
import {layerConfig} from '../config/config';
import {List, AutoSizer} from 'react-virtualized';
import {Container} from 'reactstrap';
import './BrowseWindow.css';


const BrowseCardsVirt = observer(class BrowseCardsVirt extends Component{
  constructor(props, context){
    super(props, context);
    this.featureStore = props.featureStore;

    this._renderRow = this._renderRow.bind(this);
    this.state = {}

  }

  _renderRow({index, key, style}){
    let fs = this.featureStore.filteredFeatures[index];
    let ats = fs.attributes;
    let oid = fs.attributes[layerConfig.fieldTypes.oid];
    let attUrl = this.featureStore.featureAttachments.get(oid);
    return (
      <div key={key} style={style}>
        <BrowseCard  featureAttrs={ats} attachmentUrl={attUrl}/>
      </div>
    )
  }

  render(){
    let features = this.featureStore.filteredFeatures;

    let cardView;
    if(!features || features.length < 1){
      let mockCards = ['1','2','3'].map(i => <MockCard key={i}/>);
      cardView = (
        <Container>
          {mockCards}
        </Container>
      )
    } else {


      cardView = (
        <Container style={{width:"100%", height:"100%"}}>
          <AutoSizer>
            {({ height, width }) => (
              <List
                width={width}
                height={height}
                rowHeight={170}
                rowCount={features.length}
                rowRenderer={({ index, key, style }) => (
                  <Observer key={key} style={style}>
                    {() => this._renderRow({ index, key, style })}
                  </Observer>
                )}
                overscanRowCount={1}
              />
            )}
          </AutoSizer>
        </Container>
      )
    }

    return(
      <div>
        <h6>{this.featureStore.filteredFeatures.length} volunteers can't wait to meet with you!</h6>
        <div className="view-div pt-2">
          {cardView}
        </div>
      </div>
    )
  

  }


})

export default BrowseCardsVirt;