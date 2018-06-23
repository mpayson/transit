import React, { Component } from 'react';
import {layerConfig} from '../config/config'
import './Profile.css';

// Displays the profile for a given user based on passed feature attributes
class Profile extends Component {

  // constructor(props, context){
  //   super(props, context)
  // }

  render() {

    const attrs = this.props.featureAttributes;

    return (
      <div>
        {`Hello ${attrs[layerConfig.fieldTypes.name]}`}
      </div>
    );
  }
}

export default Profile;
