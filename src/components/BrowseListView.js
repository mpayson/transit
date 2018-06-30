import React from 'react';
import {observer} from "mobx-react";
import {layerConfig} from '../config/config';


import { Card, CardImg, CardText, CardBody,
  CardTitle, CardSubtitle, Panel, Button, Row, Col, Container } from 'reactstrap';

// Displays cards for all the users
const BrowseListView = observer(({featureStore, appState}) => {

  const featureAttrs = featureStore.filteredAttributes;
  const attachMap = featureStore.featureAttachments;

  // Iterates over all features to create a new card for each
  const fTypes = layerConfig.fieldTypes;
  const indexLast = appState.currentPage * appState.itemsPerPage;
  const indexFirst = indexLast - appState.itemsPerPage;
  const cards = featureAttrs.slice(indexFirst, indexLast).map(fa => {
    const objId = fa.ObjectId;
    const att = attachMap.get(objId);
    return (
      <Col sm="12" lg="12">
        <Card className="m-1">
            <Row>
                <Col>
                    <CardImg src={att}/>
                </Col>
                <Col style={{padding:"0.5rem"}}>
                    <h4>{fa[fTypes.name]}</h4>
                    <h6>4 years at Esri</h6>
                    <p>Interests: <i>{fa[fTypes.tags]}</i><br />
                    <i>{fa[fTypes.bio]}</i></p>
                    <Row>
                        <Col><Button size="sm" color="blue">Schedule a meeting</Button></Col>
                    </Row>
                </Col>
            </Row>
        </Card>
      </Col>
    )
  })
  
  return (
    <Container>
      <Row>
        {cards}
      </Row>
    </Container>
  )
});

export default BrowseListView;