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
// import DevTools from 'mobx-react-devtools';

import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
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
      isOpen: false,
      modal: false
    };
    this.onSearchChange = this.onSearchChange.bind(this);
    this._toggleModal = this._toggleModal.bind(this);
    // this.featureStore = new FeatureStore(ArcService);
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  _toggleModal(){
    this.setState({
      modal: !this.state.modal
    })
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
    
    let path;
    let search;
    if(this.props.location){
      const basePath = Utils.baseUrl(this.props.location.pathname);
      path = basePath.split('/')[1];

      let isActive = this.featureStore.genSearchString ? true : false;
      search = path === 'browse'
        ? <Input valid={isActive} placeholder="search" value={this.featureStore.genSearchString} onChange={this.onSearchChange}/>
        : null ;
    }


    
    return (
      <div>
        <Navbar dark color="dark" expand="md">
          <NavbarBrand tag={Link} to={"/"}>Office Hours</NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav navbar>
              <NavItem active={path === 'about'}>
                <NavLink tag={Link} to={"/about"}>About</NavLink>
              </NavItem>
              <NavItem active={path === 'browse'}>
                <NavLink tag={Link} to={"/browse"}>Browse</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="#" onClick={this._toggleModal}>Volunteer</NavLink>
              </NavItem>
            </Nav>
            <Nav navbar className="ml-auto">
              <NavItem>
                {search}
              </NavItem>
              <div className="p-1"><Button outline size="sm" href="https://github.com/mpayson/transit/issues" target="__blank" color="danger" className="ml-2">alpha</Button></div>
            </Nav>
          </Collapse>
        </Navbar>
        <Switch>
          <Route exact path={"/"} render={(props) => <HomeWindow {...props} appState={this.appState} featureStore={this.featureStore}/>}/>
          <Route path={"/browse"} render={(props) => <BrowseWindow {...props} appState={this.appState} featureStore={this.featureStore}/>}/>
          <Route exact path={"/about"} render={(props) => <AboutWindow {...props} appState={this.appState} featureStore={this.featureStore}/>}/>
        </Switch>
        <Modal isOpen={this.state.modal} toggle={this._toggleModal}>
          <ModalHeader toggle={this._toggleModal}>Thank you for volunteering!</ModalHeader>
          <ModalBody>
            <div>
              <Button size="lg" block color="info" className="mb-2" target="__blank" href="https://survey123.arcgis.com/share/0493302b05ea4f77aefbe88a9fc51c6c">Become a volunteer</Button>
            </div>
            <div>
              <Button size="lg" block outline color="info" className="mt-2">Add more time</Button>
            </div>
          </ModalBody>
        </Modal>
        {/* <DevTools /> */}
      </div>
    )
  }
})

export default App;
