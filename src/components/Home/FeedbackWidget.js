import React, { Component } from 'react';
import { observer } from 'mobx-react';

// A component that renders the feedback widget on the home page
const FeedbackWidget = observer(class Home extends Component {

    constructor(props, context) {
        super(props, context)
        this.appState = this.props.appState
        this.featureStore = this.props.featureStore
        this.volunteer = this.props.volunteer
    }

    render() {
        return (
            <div className="panel">
                <h1 className="text-center">Have questions or feedback?</h1>
                <div className="text-center">
                    <button className="btn btn-green btn-large">Send us a message</button>
                </div>
            </div>
        );
    }
})

export default FeedbackWidget;
