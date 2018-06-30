import React, { Component } from 'react';
import { observer } from 'mobx-react';
import VolunteerCard from './VolunteerCard';

// A component that renders the 'Preview volunteers' section of the home page
const VolunteerPreview = observer(class Home extends Component {

    constructor(props, context) {
        super(props, context)
        this.appState = this.props.appState
        this.featureStore = this.props.featureStore
    }

    volunteer1 = <VolunteerCard appState={this.appState} featureStore={this.featureStore} />
    volunteer2 = <VolunteerCard appState={this.appState} featureStore={this.featureStore} />
    volunteer3 = <VolunteerCard appState={this.appState} featureStore={this.featureStore} />

    render() {
        return (
            <div className="padding-trailer-1">
                <h1 className="text-center">Meet some of our volunteers</h1>
                <div className="block-group block-group-3-up tablet-block-group-2-up phone-block-group-1-up">
                    {this.volunteer1}
                    {this.volunteer2}
                    {this.volunteer3}
                </div>
                <div className="text-center">
                    <button className="btn btn-half btn-large btn-clear">Browse all volunteers</button>
                </div>
            </div>
        );
    }
})

export default VolunteerPreview;
