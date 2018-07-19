import React from 'react';
import { observer } from "mobx-react";
import { layerConfig, cardConfig } from '../config/config';
import { Link } from "react-router-dom";
import inImg from '../resources/linkedin.svg';
import conImg from '../resources/contact.svg';
import Utils from '../utils/Utils';
import moment from 'moment';

import {
  Badge, Card, CardBody, Button, Row, Col, Container, CardImg, UncontrolledTooltip
} from 'reactstrap';

const MockCard = () => (
  <Card className="mt-2">
    <Row className="align-items-center">
      <Col xs="4">
        <div style={{backgroundColor: "#e9ecef", width:"100%", height:"10rem", maxWidth:"30vw", maxHeight:"30vw"}}/>
      </Col>
      <CardBody>
        <div className="mb-2 float-left" style={{backgroundColor: "#e9ecef", height:"1.5rem", width: "70%", margin: "auto"}}/>
        <div>
          <div className="float-left mr-1" style={{backgroundColor: "#e9ecef", height:"1.5rem", width: "30%", borderRadius:'0.25rem'}}/>
          <div className="float-left mr-1" style={{backgroundColor: "#e9ecef", height:"1.5rem", width: "30%", borderRadius:'0.25rem'}}/>
          <div className="float-left" style={{backgroundColor: "#e9ecef", height:"1.5rem", width: "30%", borderRadius:'0.25rem'}}/>
        </div>
      </CardBody>
    </Row>
  </Card>
)

const BrowseCard = observer(class BrowseCard extends React.Component{
  constructor(props, context){
    super(props, context);
    this.featureStore = props.featureStore;
    
    this._onLoad = this._onLoad.bind(this);

    this.state = {
      loaded: false
    }
  }

  _onLoad(e){
    this.setState({loaded: true});
  }

  render(){
    const fa = this.props.featureAttrs;
    const fTypes = layerConfig.fieldTypes;

    if(!fa){
      return <MockCard/>
    }

    const bc = Utils.getBadges(cardConfig.description, fa);
    const badges = bc.map(b => {
      const v = Utils.formatSurveyStr(fa[b[0]]);
      const label = layerConfig.labels[b[0]] || b[0];
      const tUid = `${label}${objId}`.toLowerCase().replace(' ', '-');
      return (
        <div key={tUid} style={{display:'inline-block'}}>
          <Badge id={tUid} className="badge-outline mr-1">{`${label} (${b[1]})`}</Badge>
          <UncontrolledTooltip target={tUid} delay={{ show: 0, hide: 0 }}>
            {v}
          </UncontrolledTooltip>
        </div>
      )
    })

    const dt = fa[fTypes.years];
    const yrs = moment().diff(dt, 'years', false);
    const yrLabel = yrs === 1 ? 'year' : 'years';

    const inUrl = fa[layerConfig.fieldTypes.linkedin];
    let inButton;
    if(inUrl){
      inButton = (
        <Button href={inUrl} target="__blank" size="sm" className="mt-4 mb-2 ml-2" color='linkedin'
          style={{backgroundImage: `url(${inImg})`, width: '2rem', height: '2rem'}}
          />
      );
    }

    const email = fa[layerConfig.fieldTypes.email];
    const hrefEmail = `mailto:${email}`;

    
    const objId = fa[fTypes.oid];
    let attUrl = this.featureStore.featureAttachments.get(objId);
    const attSrc = this.state.loaded ? attUrl : null;

    const imgItem = <CardImg src={attSrc} style={{backgroundColor: "#e9ecef", objectFit:"cover", width:"100%", height: "100%"}}/>
    
    return (
      <Card key={objId} className="mb-2">
        <Row className="align-items-center">
          <Col xs="4" className="pr-0">
            <div style={{width:"100%", height:"160px"}}>
              {imgItem}
            </div>
              
          </Col>
          <Col xs="8">
            <h6>
              <span className="h4">{fa[fTypes.name]}</span>
              <small className={'font-weight-light ml-2'}>{`${yrs} ${yrLabel}`}</small>
            </h6>
            <div>
              {badges}
            </div>
            <Button tag={Link} to={Utils.url(`/browse/${objId}`)} size="sm" color="primary" className="mt-4 mb-2">Learn more</Button>
            {inButton}
            <Button href={hrefEmail} size="sm" className="mt-4 mb-2 ml-2"
              style={{backgroundImage: `url(${conImg})`, width: '2rem', height: '2rem'}}
              />
          </Col>
        </Row>
        <div className='d-none'>
          <img src={attUrl} onLoad={this._onLoad}/>
        </div>
      </Card>
    )
  }

});


export {BrowseCard, MockCard}