import React, {Component} from 'react';
import esriLoader from 'esri-loader';
import {loaderOptions} from '../config/config'
import './MapWindow.css';

// Displays user locations on a map based on the layer loaded in the FeatureStore
class MapWindow extends Component {
  view

  constructor(props, context){
    super(props, context)
    this.featureStore = props.featureStore
  }

  componentDidMount(){

    esriLoader.loadModules(['esri/views/MapView'], loaderOptions)
    .then(([MapView]) => {
      console.log(this.featureStore.map);
      this.view = new MapView({
        map: this.featureStore.map,
        container: 'view-div',
        constraints: {
          snapToZoom: false
        }
      });
    })
    .catch(err => {
      // handle any errors
      console.error(err);
    });
  }

  render(){
    return(
      <div id="view-div"/>
    )
  }
}

export default MapWindow;