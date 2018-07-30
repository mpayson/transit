import React from 'react';
import { observer } from "mobx-react";
import { Link } from "react-router-dom";
import StreakTable from './StreakTable';
import './AboutWindow.css';

import {Container, Col, Row, Button} from 'reactstrap';

const AboutWindow = observer(({featureStore}) => {

  return (
    <div>
    <Container className="mt-5">
      <Row>
      <Col sm="7" className="p-2 border-right">
        <h3>What's Office Hours?</h3>
        <p>Made for the internal Esri community and inspired by <a target="__blank" href="https://www.outofofficehours.com/">Out of Office Hours</a>, <strong>Office Hours is built for you to <span className="text-success">discover valuable connections</span></strong>. We hope these connections help you realize collaborations, find advocates and mentors, and give back to our community.</p>
        <p>To find new connections, <Link to={'/browse'}><strong>browse our volunteers</strong></Link>. Or, to share your time with others, <a href='https://survey123.arcgis.com/share/61323239e7f64ebe8e65122acf021117' target="__blank"><strong>sign up</strong></a> as a volunteer!</p>
        <h3>Why participate?</h3>
        <p>If you’re looking for guidance, those listed in the app have volunteered their time to help you.</p>
        <p>If you want to give back, this is an opportunity to help those eager to learn from you and your experiences.</p>
        
        <h3>Who's building this?</h3>
        <p> This is a new, grassroots initiative through <a href="https://compass.esri.com/org/HRDiv/Employee-Development-and-Training/e-bloc/Pages/E-%20Bloc%20Home.aspx?web=1" target="__blank"><strong>e-bloc</strong></a>. As always, it's a community effort. Here are some ways we'd <span><strong>love</strong></span> for you to help!</p>
        <ul className="mb-4">
          <li>Share suggested improvements or thoughts for this app <a target="__blank" href="https://github.com/mpayson/transit/issues"><strong>on Github</strong></a></li>
          <li>Provide feedback about e-bloc through <a target="__blank" href="https://survey123.arcgis.com/share/7eaddc94e92142f6b74d69bc8b0c9c4c"><strong>this survey</strong></a></li>
          <li>Send us <a href="mailto:e-bloc-admins@esri.com"><strong>an e-mail</strong></a> with your ideas, and let's see what we can spark together</li>
        </ul>
      </Col>
      <Col sm="5">
        <div className="text-right">
          <h4>Thank you</h4>
          <p> to those of you volunteering!</p>
        </div>
        <div className="table-container">
          <StreakTable featureStore={featureStore}/>
        </div>
      </Col>
    </Row>
    </Container>
    <div className="mt-4" style={{padding: "3.5rem 2.5rem", background:"#e9ecef", textAlign:"center"}}>
      <h2>Have thoughts or feedback?</h2>
      <Button color="success" href="mailto:e-bloc-admins@esri.com">Let us know!</Button>
    </div>
    </div>
  )
})

export default AboutWindow;