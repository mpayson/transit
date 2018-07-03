import React from 'react';
import {observer} from "mobx-react";
import {layerConfig, cardConfig} from '../config/config';
import { Link } from "react-router-dom";
import Utils from '../utils/Utils';


import { Badge, Card, CardImg, Fade, CardBody,
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
      return <Badge key={label} className="badge-outline mr-1">{`${label} (${b[1]})`}</Badge>
    })

    return (
      <Col key={objId} sm="4">
        <Fade in>
          <Card className="text-center">
            <div style={{width: "100%", backgroundColor:"#e9ecef"}}>
              <CardImg top src={att} className="rounded-circle" style={{height:"10rem", width:"10rem", objectFit:"cover"}}/>
            </div>
            <CardBody>
              <CardTitle>{fa[fTypes.name]}</CardTitle>
              <CardSubtitle>Interests</CardSubtitle>
              <div>
                {badges}
              </div>

              <Link to={Utils.url(`/browse/${objId}`)}>
                <Button className="mt-3" color="primary">Learn more</Button>
              </Link>
            </CardBody>
          </Card>
        </Fade>
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