import React from 'react';
import { observer } from "mobx-react";
import {layerConfig} from '../config/config';
import { Link } from "react-router-dom";
import { UncontrolledTooltip } from 'reactstrap';
import Utils from '../utils/Utils';

import {Container, Col, Row, Table} from 'reactstrap';

const AboutWindow = observer(({featureStore}) => {

  const ftypes = layerConfig.fieldTypes;
  let countMap = featureStore.emailStreakMap;

  let sortFeatures = featureStore.features.slice(0,50).sort((a, b) => {
    const eA = a.attributes[ftypes.email];
    const eAL = eA.toLowerCase();
    const eB = b.attributes[ftypes.email];
    const eBL = eB.toLowerCase();
    if(!countMap.get(eAL)){
      return 1;
    }
    if(!countMap.get(eBL)){
      return -1;
    }
    return countMap.get(eBL) - countMap.get(eAL);
  });


  const tableEntries = sortFeatures.map((f,i) => {
    const email = f.attributes[ftypes.email];
    
    const id = f.attributes[ftypes.oid];
    const count = countMap.get(email.toLowerCase());
    const name = f.attributes[ftypes.name];

    let h;
    if(i === 0){
      h = <h3 className="mb-0"><span role="img" aria-label="1">🥇</span></h3>
    } else if(i === 1){
      h = <h3 className="mb-0"><span role="img" aria-label="2">🥈</span></h3>
    } else if(i === 2){
      h = <h3 className="mb-0"><span role="img" aria-label="3">🥉</span></h3>
    } else if(count < 5){
      h = <h3 className="mb-0"><span role="img" aria-label="chic egg">🐣</span></h3>
    } else {
      h = <h3 className="mb-0"><span role="img" aria-label="chic">🐥</span></h3>
    }
    
    return (
      <tr key={id}>
        <th scope="row">{h}</th>
        <th><Link to={Utils.url(`/browse/${id}`)}>{name}</Link></th>
        <th>{count}</th>
      </tr>
    )
  })


  return (
    <Container className="mt-5">
      <Row>
      <Col sm="7">
        <h2>What's Office Hours?</h2>
        <p className="mb-4">Built for the internal Esri community and inspired by <a target="__blank" href="https://www.outofofficehours.com/">Out of Office Hours</a>, our goal is to help you discover <span className="text-success"><strong> advocates </strong></span> or <span className="text-success"><strong> mentors </strong></span> and <span className="text-success"><strong> give back</strong></span>. In addition, we hope this sparks new <span className="text-success"><strong> friendships </strong></span> and <span className="text-success"><strong> collaborations</strong></span> at our company.</p>
        <h2>Who's building this?</h2>
        <p className="mb-4"><a href="https://compass.esri.com/org/HRDiv/Employee-Development-and-Training/e-bloc/Pages/E-%20Bloc%20Home.aspx?web=1" target="__blank"><strong>E-bloc</strong></a>! This is a grassroots, volunteer effort through e-bloc to engage and grow our community.</p>
        <h2>How can I participate?</h2>
        <p>To find new connections, <Link to={Utils.url('/browse')}><strong>browse our volunteers</strong></Link>. Or, to share your time with others, <a href='https://survey123.arcgis.com/share/61323239e7f64ebe8e65122acf021117' target="__blank"><strong>sign up</strong></a> as a volunteer!</p>

        <p>As always, this is a community effort. Here are some ways we'd <span><strong>love</strong></span> for you to help!</p>
        <ul className="mb-4">
          <li>Share suggested improvements or thoughts for this app <a target="__blank" href="https://github.com/mpayson/transit/issues"><strong>on Github</strong></a>, or even PR</li>
          <li>Provide feedback about e-bloc as a whole through <a target="__blank" href="https://survey123.arcgis.com/share/7eaddc94e92142f6b74d69bc8b0c9c4c"><strong>this survey</strong></a></li>
          <li>Send us <a href="mailto:e-bloc-admins@esri.com"><strong>an e-mail</strong></a> with your ideas, and let's see what we can spark together</li>
        </ul>

      </Col>
      <Col sm="5">
        <div className="text-right">
          <h4>Thank you</h4>
          <p> to those of you volunteering!</p>
        </div>
        <Table>
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th id="streakcol">Streak</th>
            <UncontrolledTooltip placement="bottom" target="streakcol">
              Number of months with continued participation
            </UncontrolledTooltip>
          </tr>
        </thead>
        <tbody>
          {tableEntries}
        </tbody>
      </Table>
      </Col>
    </Row>
    </Container>
  )
})

export default AboutWindow;