import React, { Component } from 'react';
import { observer } from 'mobx-react';
import FeedbackWidget from './FeedbackWidget';
import Hero from './Hero.js';
import HomeSearch from './HomeSearch'
import VolunteerPreview from './VolunteerPreview'


// A component that renders the home page
const Home = observer(class Home extends Component {

    constructor(props, context) {
        super(props, context)
        this.appState = this.props.appState
        this.featureStore = this.props.featureStore
    }

    render() {

        const hero = <Hero />
        const search = <HomeSearch featureStore={this.featureStore} />
        const volunteers = <VolunteerPreview featureStore={this.featureStore} />
        const feedback = <FeedbackWidget />

        return (
            <div>
                {hero}
                {search}
                {volunteers}
                {feedback}
            </div>
        );
    }
})

export default Home;
