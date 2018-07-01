import React, { Component } from 'react';
import {observer} from 'mobx-react';
import AppState from './stores/AppState';
import FeatureStore from './stores/FeatureStore';
import HomeWindow from './components/HomeWindow';
import { Route, Switch, Link } from "react-router-dom";
import BrowseWindow from './components/BrowseWindow';
import HomeCanvas from './components/HomeCanvas';
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

  render() {
    return (
      <div>
        <Navbar dark color="dark" expand="md">
          <NavbarBrand tag={Link} to={Utils.url("/")}>Out of Office Hours</NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav navbar>
              <NavItem>
                <NavLink href="#">About</NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} to={Utils.url("/browse")}>Browse</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="https://github.com/reactstrap/reactstrap">Sign Up</NavLink>
              </NavItem>
            </Nav>
            <Nav navbar className="ml-auto">
              <NavItem>
                <Input placeholder="search" />
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
        {/* <HomeCanvas/> */}
        <Switch>
          <Route exact path={Utils.url("/")} render={(props) => <HomeWindow {...props} appState={this.appState} featureStore={this.featureStore}/>}/>
          <Route path={Utils.url("/browse")} render={(props) => <BrowseWindow {...props} appState={this.appState} featureStore={this.featureStore}/>}/>
        </Switch>
      </div>
    )
  }
})

export default App;
