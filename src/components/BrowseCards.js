import React from 'react';
import { observer } from "mobx-react";
import { layerConfig, cardConfig } from '../config/config';
import { Link } from "react-router-dom";
import inImg from '../resources/linkedin.svg';
import conImg from '../resources/contact.svg';
import Utils from '../utils/Utils';
import moment from 'moment';

import {
  Badge, Card, Fade, Button, Row, Col, Container
} from 'reactstrap';
import { ftruncate } from 'fs';

// Displays cards for all the users
const BrowseListView = observer(({ featureAttrs, featureStore }) => {

  const attachMap = featureStore.featureAttachments;

  // Iterates over all features to create a new card for each
  const fTypes = layerConfig.fieldTypes;
  const cards = featureAttrs.map(fa => {
    const objId = fa[fTypes.oid];
    const att = attachMap.get(objId);
    const bc = Utils.getBadges(cardConfig.description, fa);
    const badges = bc.map(b =>{
      const label = layerConfig.labels[b[0]] || b[0];
      return <Badge key={label} className="badge-outline mr-1">{`${label} (${b[1]})`}</Badge>
    })

    const dt = fa[fTypes.years];
    const yrs = moment().diff(dt, 'years', false);
    const yrLabel = yrs === 1 ? 'year' : 'years';

    const inUrl = fa[layerConfig.fieldTypes.linkedin];
    let inButton;
    console.log(inUrl);
    if(inUrl){
      inButton = (
        <Button href={inUrl} target="__blank" size="sm" className="mt-4 mb-2 ml-2" color='linkedin'
          style={{backgroundImage: `url(${inImg})`, width: '2rem', height: '2rem'}}
          />
      );
    }

    const email = fa[layerConfig.fieldTypes.email];
    const hrefEmail = `mailto:${email}`;

    return (
      <Fade in key={objId}>
        <Card className="mt-2">
          <Row className="align-items-center">
            <Col xs="4">
              <img src={att} style={{padding:"0.2rem", width:"100%", height:"10rem", objectFit:"cover", maxWidth:"30vw", maxHeight:"30vw"}}/>
            </Col>
            <Col xs="8">
              <h6>
                <span className="h4">{fa[fTypes.name]}</span>
                <small className={'font-weight-light ml-2'}>{`${yrs} ${yrLabel}`}</small>
              </h6>
              <div>
                {badges}
              </div>
              <Link to={Utils.url(`/browse/${objId}`)}>
                <Button size="sm" color="primary" className="mt-4 mb-2">Learn more</Button>
              </Link>
              {inButton}
              <Button href={hrefEmail} size="sm" className="mt-4 mb-2 ml-2"
                style={{backgroundImage: `url(${conImg})`, width: '2rem', height: '2rem'}}
                />
            </Col>
          </Row>
        </Card>
      </Fade>
      
    )
  })

  return (
    <Container>
        {cards}
    </Container>
  )
});

export default BrowseListView;