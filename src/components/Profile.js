import React, { Component } from 'react';
import {layerConfig, cardConfig} from '../config/config';
import {observer} from 'mobx-react';
import moment from 'moment';
import inImg from '../resources/linkedin.svg';
import conImg from '../resources/contact.svg';
import { Link } from "react-router-dom";
import Utils from '../utils/Utils';
import './Profile.css';

import { Card, Fade, CardBody, CardText,
  CardTitle, CardSubtitle, CardImg, Button,
  Nav, NavItem, NavLink} from 'reactstrap';


const getEmail = (email, time=null) => {
  let defStr = `mailto:${email}`
  if(time){
    return defStr + `?subject=Office Hours ${time}&body=Hello, I'd like to sign up for Office Hours on ${time}, is it still available? Thank you!`;
  }
  return defStr;
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

    this._onLoad = this._onLoad.bind(this);
    this.state = {
      isActive: false,
      loaded: false
    }
  }

  onTabClick(e){
    this.appState.setProfileTab(parseInt(e.target.id, 10));
  }

  _onLoad(e){
    this.setState({loaded: true})
  }

  onSimilarClick(e){
    this.featureStore.filterByFeature(parseInt(this.props.match.params.id, 10));

  }

  onToggleClick(e){
    this.setState({
      isActive: !this.state.isActive
    })
  }

  render() {

    // const attrs = this.props.featureAttributes;
    const id = parseInt(this.props.match.params.id, 10);
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

    const emailEventMap = this.featureStore.upcomingEmailEventMap;
    const email = attrs[ftypes.email].toLowerCase();

    const eventObjs = emailEventMap.get(email);
  
    let events = null;
    if(eventObjs) {
      events = eventObjs.map(e => {
        const startStr = e.start.format("ddd (M/D): h:mm");
        const endStr = e.end.format("h:mma");
        const estr = `${startStr}-${endStr}`;
        return(
          <div key={estr} className="mt-1" style={{padding:"0.25rem", height:"2.5rem", borderRadius:"0.25rem", border:"1px solid rgba(0, 0, 0, 0.125)"}}>
            {estr}
          <Button href={getEmail(attrs[ftypes.email], estr)} id={estr} className="float-right" outline size="sm">Book it</Button>
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
    let v = Utils.formatSurveyStr(attrs[tab]);

    const dt = attrs[ftypes.years];
    const yrs = moment().diff(dt, 'years', false);
    const yrLabel = yrs === 1 ? 'year' : 'years';

    const inUrl = attrs[ftypes.linkedin];
    let inButton;
    if(inUrl){
      inButton = (
        <Button href={inUrl} target="__blank" size="sm" className="mr-2" color='linkedin'
          style={{backgroundImage: `url(${inImg})`, width: '2rem', height: '2rem'}}
          />
      );
    }

    const attUrl = this.featureStore.featureAttachments.get(id);
    const att = this.state.loaded ? attUrl : null;

    const timeText = (events && events.length > 0) ? "Upcoming Available Times" : "No Upcoming Available Times";

    return (
      <div>
        <Button tag={Link} to={Utils.url('/browse')} className="mb-2" size="sm" outline>{"< Back to browse"}</Button>
        <Fade in>
          <Card className="text-center">
            <div style={{width: "100%", backgroundColor:"#e9ecef"}}>
              <CardImg top src={att} className="rounded-circle" style={{height:"10rem", width:"10rem", objectFit:"cover", backgroundColor: "#6C757C"}}/>
            </div>
            <CardBody>
              <div>
                <CardTitle>
                  {attrs[ftypes.name]}
                  <span className="font-weight-light">{` (${yrs} ${yrLabel} @ Esri)`}</span>
                </CardTitle>
              </div>
              <CardSubtitle className="mb-3">
                {inButton}
                <Button href={getEmail(attrs[ftypes.email])} size="sm" className="mr-2"
                  style={{backgroundImage: `url(${conImg})`, width: '2rem', height: '2rem'}}
                />
              </CardSubtitle>
              <Nav tabs>
                {tabs}
              </Nav>
              <CardText>{v}</CardText>
              <div style={{textAlign:"left"}}>
                <CardSubtitle className="mt-2 mb-2">{timeText}</CardSubtitle>
                {events}
              </div>
            </CardBody>
          </Card>
          <Button onClick={this.onSimilarClick} tag={Link} to={Utils.url('/browse')} outline className="mt-4" block>See volunteers with similar interests</Button>
        </Fade>
        <div className='d-none'>
          <img src={attUrl} alt='hidden load' onLoad={this._onLoad}/>
        </div>
      </div>
    );


  }
});

export default Profile;
