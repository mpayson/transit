import React from 'react';
import CardGallery from './CardGallery';
import FilterGroup from './UIComponents/FilterGroup';
import {observer} from'mobx-react';
import { Link } from "react-router-dom";
import Utils from '../utils/Utils';
import HomeCanvas from '../components/HomeCanvas';
import backImg from '../resources/group-stars.png';
// import SelectFilter from './SelectFilter';

import {
Button,
Row,
Col,
Container,
Jumbotron} from 'reactstrap';

const HomeWindow = observer(({appState, featureStore}) => (
  <div>
    <div style={{position:"relative"}}>
    {/* <HomeCanvas/> */}
      <img className="d-none d-md-block" style={{position:"absolute", top:0, right: "2vw"}} src={backImg}/>
      <Jumbotron fluid className="e-bloc-jumbo">

          <Container fluid>
          
            <h1 className="display-4">Office Hours</h1>
            <p>Creating connections and sparking conversations across Esri <br/> Volunteers open their offices to answer your questions and help you grow your career</p>
            <hr className="my-4 hr-dark"/>
            <p>Start here to find colleagues who match your interests:</p>
            <div style={{marginBottom: '5px'}}>
              <FilterGroup appState={appState} featureStore={featureStore}/>
            </div>
            <Link to={Utils.url('/browse')}>Browse all volunteers</Link>
          
          </Container>
        
      </Jumbotron>
    </div>
    <div className="mb-5" style={{width:"100%", textAlign:"center"}}>
      <h2>Meet some of our volunteers</h2>
    </div>
    <CardGallery appState={appState} featureStore={featureStore}/>
    <Container className="mt-5 mb-5"> 
      <Row>
        <Col/>
        <Col sm="6">
          <Button tag={Link} to={Utils.url('/browse')} outline color="secondary" size="lg" block>Browse all volunteers</Button>
        </Col>
        <Col/>
      </Row>
    </Container>
    <div style={{padding: "3.5rem 2.5rem", background:"#e9ecef", textAlign:"center"}}>
      <h2>Have thoughts or feedback?</h2>
      <Button color="success">Let us know!</Button>
    </div>
  </div>
))

export default HomeWindow;