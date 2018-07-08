import React, {Component} from 'react';
import esriLoader from 'esri-loader';
import {loaderOptions, layerConfig} from '../config/config';
import {withRouter} from 'react-router-dom';
import './MapWindow.css';
import {toJS, when} from 'mobx';
import Utils from '../utils/Utils';

// Displays user locations on a map based on the layer loaded in the FeatureStore
class MapWindow extends Component {
  view
  centerId
  lyrView
  _highlight

  constructor(props, context){
    super(props, context);
    this.featureStore = props.featureStore;
    this._centerZoomHighlight = this._centerZoomHighlight.bind(this);
  }


  componentDidUpdate(prevProps) {
    this._centerZoomHighlight();
  }

  _centerZoomHighlight(){

    const id = this.props.match.params.id;

    if(id === this.centerId || !this.view || !this.lyrView){
      return;
    }
    this.centerId = id;

    if(!id){
      if(this._highlight){
        this._highlight.remove();
      }
      return;
    }
  
    
    const nId = parseInt(id);

    const idMap = this.featureStore.featureIdMap;
    if(!idMap.has(nId)){
      return;
    }

    const f = this.featureStore.featureIdMap.get(nId);
    this.view.goTo(f);
    this._highlight = this.lyrView.highlight(f);
  }

  // a cascade of promises to make sure map moves appropriately
  // once items are updated
  componentDidMount(){
    let MapView

    when(() => this.featureStore.loadStatus.mapLoaded)
      .then(() => esriLoader.loadModules(
        ['esri/views/MapView', 'esri/widgets/Home']
      ), loaderOptions)
      .then(([MapView, Home]) => {
        this.view = new MapView({
          map: this.featureStore.map,
          container: 'view-div'
        });
        let homeBtn = new Home({
          view: this.view
        });
        this.view.ui.add([homeBtn], "top-right");
        return when(() => this.featureStore.loadStatus.layerLoaded);
      })
      .then(() => this.view.whenLayerView(this.featureStore.layer))
      .then((lyrView) => {
        this.lyrView = lyrView
        return when(() => this.featureStore.loadStatus.featsLoaded);
      })
      .then(() => this._centerZoomHighlight())
      .catch(err => {
        console.error(err);
      });
  }

  render(){
    return(
      <div id="view-div"/>
    )
  }
}

export default withRouter(MapWindow);