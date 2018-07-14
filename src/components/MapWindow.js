import React, {Component} from 'react';
import esriLoader from 'esri-loader';
import {loaderOptions, layerConfig} from '../config/config';
import {withRouter} from 'react-router-dom';
import {toJS, when} from 'mobx';
import {observer} from 'mobx-react';
import Utils from '../utils/Utils';
import {Button} from 'reactstrap';
import './MapWindow.css';

// Displays user locations on a map based on the layer loaded in the FeatureStore
const MapWindow = observer(class MapWindow extends Component {
  view
  centerId
  lyrView
  _highlight

  constructor(props, context){
    super(props, context);
    this.featureStore = props.featureStore;
    this._centerZoomHighlight = this._centerZoomHighlight.bind(this);
    this._handlePopupAction = this._handlePopupAction.bind(this);
    this._handleExtentChange = this._handleExtentChange.bind(this);
    this.state = {
      didMount: false
    }

    this._onPanClick = this._onPanClick.bind(this);
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
      if(this.view.popup.visible){
        this.view.popup.close();
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

  _handlePopupAction(e){
    if(e.action.id === 'learn-more'){
      const fID = layerConfig.fieldTypes.oid;
      const id = e.target.selectedFeature.attributes[fID];
      this.centerId = id;
      this.props.history.push(Utils.url(`/browse/${id}`));
    }
  }

  _handleExtentChange(){
    this.featureStore.updateFilterExtent(this.view.extent);
  }

  // a cascade of promises to make sure map moves appropriately
  // once items are updated
  componentDidMount(){

    when(() => this.featureStore.loadStatus.mapLoaded)
      .then(() => esriLoader.loadModules(
        ['esri/views/MapView', 'esri/widgets/Home', "esri/core/watchUtils"]
      ), loaderOptions)
      .then(([MapView, Home, watchUtils]) => {
        this.setState({didMount: true});
        this.view = new MapView({
          map: this.featureStore.map,
          container: 'view-div'
        });
        let homeBtn = new Home({
          view: this.view
        });
        this.view.ui.add("view-button", "top-right");
        this.view.ui.add([homeBtn], "top-right");

        watchUtils.whenTrue(this.view, 'stationary', this._handleExtentChange);

        return when(() => this.featureStore.loadStatus.layerLoaded);
      })
      .then(() => this.view.whenLayerView(this.featureStore.layer))
      .then((lyrView) => {
        this.lyrView = lyrView;
        this.view.popup.actions.removeAll();
        this.view.popup.actions.add({
          title: "Learn More",
          id: "learn-more",
          className: "esri-icon-review"
        });
        this.view.popup.on("trigger-action", this._handlePopupAction);
        return when(() => this.featureStore.loadStatus.featsLoaded);
      })
      .then(() => this._centerZoomHighlight())
      .catch(err => {
        console.error(err);
      });
  }

  _onPanClick(e){
    let nextIs = !this.featureStore.isFilterByExtent;
    this.featureStore.setIsFilterByExtent(nextIs, this.view.extent);
  }

  render(){
    let buttonStyle = {border: "none"};
    if(!this.state.didMount){
      buttonStyle.display = 'none';
    }
    if(!this.featureStore.isFilterByExtent){
      buttonStyle.backgroundColor = 'white';
      buttonStyle.color = "#6C757C";
    }
    const buttonColor = this.featureStore.isFilterByExtent ? 'success' : 'secondary';
    const buttonOutline = !this.featureStore.isFilterByExtent

    return(
      <div>
        <div id="view-div"/>
        <Button
          id="view-button"
          style={buttonStyle}
          className="esri-component small"
          color={buttonColor}
          onClick={this._onPanClick}
          outline={buttonOutline}
          size="sm">
          Filter by extent
        </Button>
      </div>

    )
  }
});

export default withRouter(MapWindow);