import React, { Component } from 'react';
import {observer} from 'mobx-react';
import AppState from './stores/AppState';
import FeatureStore from './stores/FeatureStore';
import TopNav from './components/TopNav';
import MapWindow from './components/MapWindow';
import CardWindow from './components/CardWindow';
import CalendarWindow from './components/CalendarWindow';
import Profile from './components/Profile';
import LoadingPane from './components/UIComponents/LoadingPane';
import MockService from './services/MockService';
import Home from './components/Home/Home';
//import ArcService from './services/ArcService';
import './App.css';


// The base component that loads all other subcomponents
const App = observer(class App extends Component {

  constructor(props, context){
    super(props, context)
    this.appState = AppState;
    // this.featureStore = new FeatureStore(MockService);
    this.featureStore = new FeatureStore(MockService);
  }

  // Load data when app is about to load
  componentWillMount(){
    this.featureStore.load();
  }

  render() {

    if(!this.featureStore.loaded){
      return <LoadingPane/>
    }

    // Get the right window component to load based on app state
    const rightWindow = this.appState.windowIndex === 1
      ? <MapWindow featureStore={this.featureStore}/>
      : <CalendarWindow featureStore={this.featureStore}/>
    

    // Get the left window component to load based on app state
    const leftWindow = this.featureStore.selFeatureAttributes
      ? <Profile featureAttributes={this.featureStore.selFeatureAttributes}/>
      : <CardWindow featureStore={this.featureStore} appState={this.appState}/>

    const mainWindow = <Home featureStore={this.featureStore} appState={this.appState} />;

    this.appState.WindowPanes = 1;

    // Return the JSX
    if (this.appState.WindowPanes == 1){
      return (
        <div className="app">
          <TopNav appState={this.appState} featureStore={this.featureStore}/>
          <div className="grid-container">
            <div className="column-24">
              {mainWindow}
            </div>
          </div>
        </div>
      );
    }
    else {
      return (
        <div className="app">
          <TopNav appState={this.appState} featureStore={this.featureStore}/>
          <div className="grid-container leader-2 trailer-1 padding-trailer-half">
            <div className="column-12 leader-0 pre-0">
              {leftWindow}
            </div>
            <div className="right-container column-12 post-0">
              {rightWindow}
            </div>
          </div>
        </div>
      );
    }
    
  }
})

export default App;
