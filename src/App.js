import React, { Component } from 'react';
import { Route, Switch, Link } from "react-router-dom";
import {observer} from 'mobx-react';
import AppState from './stores/AppState';
import FeatureStore from './stores/FeatureStore';
import HomeWindow from './components/HomeWindow';
import BrowseWindow from './components/BrowseWindow';
import AboutWindow from './components/AboutWindow';
import Utils from './utils/Utils';
// import MockService from './services/MockService';
import ArcService from './services/ArcService';
import DevTools from 'mobx-react-devtools';

import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Badge,
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
    
    const basePath = Utils.baseUrl(this.props.location.pathname);
    const path = basePath.split('/')[1];
    
    return (
      <div>
        <Navbar dark color="dark" expand="md">
          <NavbarBrand tag={Link} to={Utils.url("/")}>Office Hours</NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav navbar>
              <NavItem active={path === 'about'}>
                <NavLink tag={Link} to={Utils.url("/about")}>About</NavLink>
              </NavItem>
              <NavItem active={path === 'browse'}>
                <NavLink tag={Link} to={Utils.url("/browse")}>Browse</NavLink>
              </NavItem>
              <NavItem>
                <NavLink target="__blank" href="https://survey123.arcgis.com/share/0493302b05ea4f77aefbe88a9fc51c6c">Sign Up</NavLink>
              </NavItem>
            </Nav>
            <Nav navbar className="ml-auto">
              <h3 className='mr-2'><Badge color="danger">alpha</Badge></h3>
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
          <Route exact path={Utils.url("/about")} render={(props) => <AboutWindow {...props} appState={this.appState} featureStore={this.featureStore}/>}/>
        </Switch>
        {/* <DevTools /> */}
      </div>
    )
  }
})

export default App;
