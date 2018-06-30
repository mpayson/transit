import React, { Component } from 'react';
import { observer } from 'mobx-react';
import './VolunteerCard.css'

// A component that renders the cards in the 'meet our volunteers' section of the homepage
const VolunteerCard = observer(class Home extends Component {

    constructor(props, context) {
        super(props, context)
        this.appState = this.props.appState
        this.featureStore = this.props.featureStore
        this.volunteer = this.props.volunteer
    }

    render() {
        return (
            <div class="card card-shaped block trailer-1">
                <figure class="card-image-wrap">
                    <img src="https://esri.github.io/calcite-web/assets/img/docs/bridge-circle.png" alt="Bridge Club, 1942" class="card-image" />
                </figure>
                <div class="card-content text-center">
                    <h2 className="text-center">Hannah</h2>
                    <p class="font-size--1 card-last">Here's a quick description or excerpt from Hannah's bio.</p>
                    <a class="btn leader-1 btn-half">See volunteer's schedule</a>
                </div>
            </div>
        );
    }
})

export default VolunteerCard;
