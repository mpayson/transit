import React from 'react';
import {observer} from "mobx-react";
import {layerConfig, cardConfig} from '../config/config';
import Utils from '../utils/Utils';


import { Badge, Card, CardImg, CardText, CardBody,
  CardTitle, CardSubtitle, Button, Row, Col, Container } from 'reactstrap';

// Displays cards for all the users
const CardGallery = observer(({featureStore, appState}) => {

  const featureAttrs = featureStore.filteredAttributes;
  const attachMap = featureStore.featureAttachments;

  // Iterates over all features to create a new card for each
  const fTypes = layerConfig.fieldTypes;
  const cards = featureAttrs.slice(0,3).map(fa => {
    const objId = fa[fTypes.oid];
    const att = attachMap.get(objId);
    const bc = Utils.getBadges(cardConfig.description, fa);
    const badges = bc.map(b =>{
      const label = layerConfig.labels[b[0]] || b[0];
      return <Badge className="badge-outline mr-1">{`${label} (${b[1]})`}</Badge>
    })

    return (
      <Col key={objId} sm="4">
        <Card className="text-center">
          <div style={{width: "100%", backgroundColor:"#e9ecef"}}>
            <div style={{marginRight:"20%", marginLeft:"20%"}}>
              <CardImg top src={att} className="rounded-circle"/>
            </div>
          </div>
          <CardBody>
            <CardTitle>{fa[fTypes.name]}</CardTitle>
            <CardSubtitle>Interests</CardSubtitle>
            <div>
              {badges}
            </div>

            <Button className="mt-3" color="primary">See availability</Button>
          </CardBody>
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

export default CardGallery;