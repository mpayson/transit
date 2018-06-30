import React from 'react';
import CardGallery from './CardGallery';

import {
Button,
Row,
Col,
Container,
Jumbotron} from 'reactstrap';

const HomeWindow = ({appState, featureStore}) => (
  <div>
    <Jumbotron fluid>
      <Container fluid>
        <h1 className="display-4">Out of Office Hours</h1>
        <p>Creating connections and sparking conversations across Esri <br/> Volunteers open their offices to answer your questions and help you grow your career</p>
        <hr className="my-4"/>
        <p>Start here to find colleagues who match your interests:</p>
        <div style={{marginBottom: '5px'}}>
          <Button outline color="secondary">secondary</Button>
          &nbsp;&nbsp;&nbsp;
          <Button outline color="secondary">secondary</Button>
        </div>
        <a href="#">Browse all volunteers</a>
      </Container>
    </Jumbotron>
    <div className="mb-5" style={{width:"100%", textAlign:"center"}}>
      <h2>Meet some of our volunteers</h2>
    </div>
    <CardGallery appState={appState} featureStore={featureStore}/>
    <Container className="mt-5 mb-5"> 
      <Row>
        <Col/>
        <Col sm="6">
          <Button outline color="secondary" size="lg" block>Browse all colleagues</Button>
        </Col>
        <Col/>
      </Row>
    </Container>
    <div style={{padding: "3.5rem 2.5rem", background:"#e9ecef", textAlign:"center"}}>
      <h2>Have thoughts or feedback?</h2>
      <Button color="success">Let us know!</Button>
    </div>
  </div>
)

export default HomeWindow;