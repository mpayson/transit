import React, { Component } from 'react';
import {observer} from 'mobx-react';
import AppState from './stores/AppState';
import FeatureStore from './stores/FeatureStore';
import HomeWindow from './components/HomeWindow';
import { Route, Switch, Link } from "react-router-dom";
import BrowseWindow from './components/BrowseWindow';
import Utils from './utils/Utils';
// import MockService from './services/MockService';
import ArcService from './services/ArcService';

import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Input} from 'reactstrap';

// import ArcService from './services/ArcService';
import './App.css';

// The base component that loads all other subcomponents
const App = observer(class App extends Component {

  constructor(props, context){
    super(props, context)
    this.appState = AppState;
    this.featureStore = new FeatureStore(ArcService);
    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
    this.onSearchChange = this.onSearchChange.bind(this);
    // this.featureStore = new FeatureStore(ArcService);
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  // Load data when app is about to load
  componentWillMount(){
    this.featureStore.load();
  }

  onSearchChange(e){
    let v = e.target.value;
    this.featureStore.setGeneralSearchString(v);
  }

  render() {
    
    const path = this.props.location.pathname.split('/')[1];
    
    return (
      <div>
        <Navbar dark color="dark" expand="md">
          <NavbarBrand tag={Link} to={Utils.url("/")}>Office Hours</NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav navbar>
              <NavItem active={path === 'about'}>
                <NavLink href="#">About</NavLink>
              </NavItem>
              <NavItem active={path === 'browse'}>
                <NavLink tag={Link} to={Utils.url("/browse")}>Browse</NavLink>
              </NavItem>
              <NavItem>
                <NavLink target="__blank" href="https://survey123.arcgis.com/share/61323239e7f64ebe8e65122acf021117">Sign Up</NavLink>
              </NavItem>
            </Nav>
            <Nav navbar className="ml-auto">
              <NavItem>
                <Input  
                  placeholder="search"
                  value={this.featureStore.genSearchString}
                  onChange={this.onSearchChange}
                  />
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
        <Switch>
          <Route exact path={Utils.url("/")} render={(props) => <HomeWindow {...props} appState={this.appState} featureStore={this.featureStore}/>}/>
          <Route path={Utils.url("/browse")} render={(props) => <BrowseWindow {...props} appState={this.appState} featureStore={this.featureStore}/>}/>
        </Switch>
      </div>
    )
  }
})

export default App;
