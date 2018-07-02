import React, { Component } from 'react';
import {layerConfig} from '../config/config';
import {observer} from 'mobx-react';
import {toJS} from 'mobx';
import './Profile.css';

// Displays the profile for a given user based on passed feature attributes
const Profile = observer(class Profile extends Component {

  constructor(props, context){
    super(props, context)
    this.appState = props.appState;
    this.featureStore = props.featureStore;
  }

  render() {

    // const attrs = this.props.featureAttributes;
    const id = parseInt(this.props.match.params.id);
    const idMap = this.featureStore.featureIdMap;
    console.log(toJS(idMap), id, idMap.has(id));
    if(!idMap.has(id)){
      return (
        <div>
          {"Loading..."}
        </div>
      );
    }
    const feature = this.featureStore.featureIdMap.get(id);
    const attrs = feature.attributes;
    return (
      <div>
        {`hello ${attrs[layerConfig.fieldTypes.name]}`}
      </div>
    );


  }
});

export default Profile;
