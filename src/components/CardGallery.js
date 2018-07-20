import React from 'react';
import {observer} from "mobx-react";
import {layerConfig, cardConfig} from '../config/config';
import { Link } from "react-router-dom";
import Utils from '../utils/Utils';


import { Badge, Card, CardImg, Fade, CardBody, UncontrolledTooltip,
  CardTitle, CardSubtitle, Button, Row, Col, Container } from 'reactstrap';


const MockCard = () => (
  <Col sm="4">
    <Fade in>
      <Card className="text-center">
        <div style={{width: "100%", backgroundColor:"#e9ecef"}}>
          <CardImg top className="rounded-circle" style={{height:"10rem", width:"10rem", objectFit:"cover", backgroundColor: "#6C757C"}}/>
        </div>
        <CardBody>
          <div className="mb-2" style={{backgroundColor: "#e9ecef", height:"1.2rem", width: "70%", margin: "auto"}}/>
          <div className="mb-2" style={{backgroundColor: "#e9ecef", height:"1rem", width: "60%", margin: "auto"}}/>
          <div>
            <div className="float-left mr-1" style={{backgroundColor: "#e9ecef", height:"1.5rem", width: "30%", borderRadius:'0.25rem'}}/>
            <div className="float-left mr-1" style={{backgroundColor: "#e9ecef", height:"1.5rem", width: "30%", borderRadius:'0.25rem'}}/>
            <div className="float-left" style={{backgroundColor: "#e9ecef", height:"1.5rem", width: "30%", borderRadius:'0.25rem'}}/>
          </div>
        </CardBody>
      </Card>
    </Fade>
  </Col>
)

const CardGallery = observer(class CardGallery extends React.Component{
  constructor(props, context){
    super(props, context);
    this.featureStore = props.featureStore;
    this._onLoad = this._onLoad.bind(this);
    this.state = {}
  }

  _onLoad(e){
    console.log('here', e.target.src)
    this.setState({[e.target.src]: true});
  }


  render(){
    const featureAttrs = this.featureStore.filteredAttributes;
    const attachMap = this.featureStore.featureAttachments;
  
    // Iterates over all features to create a new card for each
    const fTypes = layerConfig.fieldTypes;
  
    let cards;
    if(!featureAttrs || featureAttrs.length < 1){
      cards = ['1','2','3'].map(i => <MockCard key={i}/>)
    } else {
      cards = featureAttrs.slice(0,3).map(fa => {
        const objId = fa[fTypes.oid];
        const attUrl = attachMap.get(objId);
        const att = this.state.hasOwnProperty(attUrl) ? attUrl : null;

        const bc = Utils.getBadges(cardConfig.description, fa);
        
        const badges = bc.map(b =>{
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
        return (
          <Col key={objId} sm="4">
            <Card className="text-center">
              <div style={{width: "100%", backgroundColor:"#e9ecef"}}>
                <CardImg top src={att} className="rounded-circle" style={{height:"10rem", width:"10rem", objectFit:"cover", backgroundColor: "#6C757C"}}/>
              </div>
              <CardBody>
                <CardTitle>{fa[fTypes.name]}</CardTitle>
                <CardSubtitle>Interests</CardSubtitle>
                <div>
                  {badges}
                </div>
  
                <Button tag={Link} to={`/browse/${objId}`} className="mt-3" color="primary">Learn more</Button>
              </CardBody>
            </Card>
            <div className='d-none'>
              <img src={attUrl} alt='hidden load' onLoad={this._onLoad}/>
            </div>
          </Col>
        )
      })
    }
    
    return (
      <Container>
        <Row>
          {cards}
        </Row>
      </Container>
    )
  }
});

export default CardGallery;