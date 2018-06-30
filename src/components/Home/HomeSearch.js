import React, { Component } from 'react';
import { observer } from 'mobx-react';

// A component that renders the search widget within the home page top section
const HomeSearch = observer(class Home extends Component {

    constructor(props, context) {
        super(props, context)
        this.appState = this.props.appState
        this.featureStore = this.props.featureStore
        this.volunteer = this.props.volunteer
    }

    render() {
        return (
            <div className="panel-dark Banner">
                <div className="pre-1">
                    <p>Start here to find experienced Esri employees who match what you're looking for or <a className="link-white">browse all volunteers</a>:</p>
                    <nav className="">
                        <button id="interestButton" className="btn btn-grouped btn-white">Interests</button>
                        <button id="yearsButton" className="btn btn-grouped btn-white">Years at Esri</button>
                        <button id="submit" className="btn btn-grouped btn-white">Find matches</button>
                    </nav>
                    <p><a className="link-white">Skip and browse all volunteers</a></p>
                </div>
            </div>
        );
    }
})

export default HomeSearch;
