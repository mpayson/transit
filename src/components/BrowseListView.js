import React from 'react';
import { observer } from "mobx-react";
import { layerConfig, cardConfig } from '../config/config';
import Utils from '../utils/Utils';

import {
  Badge, Card, CardImg, CardText, CardBody,
  CardTitle, CardSubtitle, Panel, Button, Row, Col, Container
} from 'reactstrap';

// Displays cards for all the users
const BrowseListView = observer(({ featureStore, appState }) => {

  const featureAttrs = featureStore.filteredAttributes;
  const attachMap = featureStore.featureAttachments;

  // Iterates over all features to create a new card for each
  const fTypes = layerConfig.fieldTypes;
  const indexLast = appState.currentPage * appState.itemsPerPage;
  const indexFirst = indexLast - appState.itemsPerPage;
  const cards = featureAttrs.slice(indexFirst, indexLast).map(fa => {
    const objId = fa[fTypes.oid];
    const att = attachMap.get(objId);
    const bc = Utils.getBadges(cardConfig.description, fa);
    const badges = bc.map(b =>{
      const label = layerConfig.labels[b[0]] || b[0];
      return <Badge className="badge-outline mr-1">{`${label} (${b[1]})`}</Badge>
    })


    return (
      
      <Card key={objId} className="mt-2">
        <Row className="align-items-center">
          <Col xs="4">
            <img src={att} style={{padding:"0.2rem", width:"100%", height:"100%"}}/>
          </Col>
          <Col xs="8">
            <h6>
              <span className="h4">{fa[fTypes.name]}</span>
              <small className={'font-weight-light ml-2'}>4 years</small>
            </h6>
            <div>
              {badges}
            </div>
            <Button size="sm" color="primary" className="mt-4 mb-2">Learn more</Button>
            <Button size="sm" color="primary" className="mt-4 mb-2 ml-2">
              In
            </Button>
          </Col>
        </Row>
      </Card>
      
    )
  })

  return (
    <Container>
        {cards}
    </Container>
  )
});

export default BrowseListView;