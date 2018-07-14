import React, { Component } from 'react';
import {layerConfig, cardConfig} from '../config/config';
import {observer} from 'mobx-react';
import moment from 'moment';
import {toJS} from 'mobx';
import { Link } from "react-router-dom";
import Utils from '../utils/Utils';
import './Profile.css';

import Toggle from './UIComponents/Toggle';

import { Badge, Card, CardImg, Fade, CardBody, CardText,
  CardTitle, CardSubtitle, Button, Row, Col, Container,
  Nav, NavItem, NavLink} from 'reactstrap';
import { max } from 'moment';


const getEmail = (time, email) => {
  return `mailto:${email}?subject=Office Hours ${time}&body=Hello, I'd like to sign up for Office Hours on ${time}, is it still available? Thank you!`;
}

// Displays the profile for a given user based on passed feature attributes
const Profile = observer(class Profile extends Component {

  constructor(props, context){
    super(props, context)
    this.appState = props.appState;
    this.featureStore = props.featureStore;
    this.onTabClick = this.onTabClick.bind(this);
    this.onSimilarClick = this.onSimilarClick.bind(this);
    this.onToggleClick = this.onToggleClick.bind(this);
    this.state = {
      isActive: false
    }
  }

  onTabClick(e){
    this.appState.setProfileTab(parseInt(e.target.id));
  }

  onSimilarClick(e){
    this.featureStore.filterByFeature(parseInt(this.props.match.params.id));

  }

  onToggleClick(e){
    this.setState({
      isActive: !this.state.isActive
    })
  }

  render() {

    // const attrs = this.props.featureAttributes;
    const id = parseInt(this.props.match.params.id);
    const idMap = this.featureStore.featureIdMap;

    if(!idMap.has(id)){
      return (
        <div>
          {"Loading..."}
        </div>
      );
    }
    const ftypes = layerConfig.fieldTypes;
    const feature = this.featureStore.featureIdMap.get(id);
    const attrs = feature.attributes;

    const relates = this.featureStore.featureRelates.get(id.toString());
    let events = null;
    if(relates) {
      events = relates.map(r => {
        const rAtr = r.attributes;
        const start = moment(rAtr[ftypes.start]);
        const startStr = start.format("ddd (M/D) @ h:mm a");
        console.log(start.format("dddd, M/D, h:mm a"));
        return(
          <div key={startStr} className="mt-1" style={{padding:"0.25rem", height:"2.5rem", borderRadius:"0.25rem", border:"1px solid rgba(0, 0, 0, 0.125)"}}>
            {startStr}
          <Button href={getEmail(startStr, attrs[ftypes.email])} id={startStr} className="float-right" outline size="sm">Book this time</Button>
          </div>
        );
      })
    }

    const fltTabOpts = cardConfig.tabs.filter(t => attrs.hasOwnProperty(t) && attrs[t])
    const tabIndex = (this.appState.profileTab >= fltTabOpts.length)
      ? fltTabOpts.length - 1
      : this.appState.profileTab;
    let tab = fltTabOpts[tabIndex];
    
    const tabs = fltTabOpts.map((t, i) => {
      const l = layerConfig.labels[t];
      let isActive = i === this.appState.profileTab;
      return (
        <NavItem key={t}>
          <NavLink
            style={{padding:"0.25rem 0.5rem"}}
            active={isActive}
            href="#"
            id={i}
            onClick={this.onTabClick}>
            {l}
          </NavLink>
        </NavItem>
      )
    })
    let v = attrs[tab].replace(/,/g, ', ').replace(/_/g, ' ');

    const dt = attrs[ftypes.years];
    const yrs = moment().diff(dt, 'years', false);
    const yrLabel = yrs === 1 ? 'year' : 'years';

    const att = this.featureStore.featureAttachments.get(id);
    
    const toggleClass = this.state.isActive ? "btn btn-sm btn-toggle toggle-success-uniform active" : "btn btn-sm btn-toggle toggle-success-uniform"

    return (
      <div>
        <Button tag={Link} to={Utils.url('/browse')} className="mb-2" size="sm" outline>{"< Back to browse"}</Button>
        <Fade in>
          <Card className="text-center">
            <div style={{width: "100%", height: "8rem", backgroundColor:"#e9ecef"}}>
              <img src={att} className="rounded-circle" style={{height:"100%"}}/>
            </div>
            <CardBody>
              <CardTitle>{attrs[ftypes.name]}</CardTitle>
              <CardSubtitle className="mb-2">{`${yrs} ${yrLabel} @ Esri`}</CardSubtitle>
              <Nav tabs>
                {tabs}
              </Nav>
              <CardText>{v}</CardText>
              <div style={{textAlign:"left"}}>
                <CardSubtitle className="mb-2">Available Times</CardSubtitle>
                {events}
              </div>
            </CardBody>
          </Card>
          <Button onClick={this.onSimilarClick} tag={Link} to={Utils.url('/browse')} outline className="mt-4" block>See volunteers with similar interests</Button>
        </Fade>

      </div>
    );


  }
});

export default Profile;
