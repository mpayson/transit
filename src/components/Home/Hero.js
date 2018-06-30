import React, { Component } from 'react';
import { observer } from 'mobx-react';
import './Hero.css'
import backImg from '../../resources/back.png';

// A component that renders the home page
const Hero = observer(class Home extends Component {

    constructor(props, context) {
        super(props, context)
        this.appState = this.props.appState
        this.featureStore = this.props.featureStore
    }

    render() {
        return (
            <div className="panel-dark Banner back-img" style={{backgroundImage: "url(" + backImg + ")", backgroundPositionX: "right", backgroundPositionY: "top", backgroundRepeat: "no-repeat"}}>
                <h1 className="font-size-8 padding-leader-1 pre-1">After Office Hours</h1>
                <p className="pre-1 font-size-2">Creating connections and sparking conversations across Esri.<br />
                    Volunteers open their offices to answer your questions and help you grow your career.</p>
                <hr />
            </div>
        );
    }
})

export default Hero;
