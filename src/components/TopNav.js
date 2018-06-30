import React, { Component } from 'react';
import { observer } from 'mobx-react';
import ExpSearchInput from './UIComponents/ExpSearchInput';
import './TopNav.css'


// A component that renders the top navigation icons
const TopNav = observer(class TopNav extends Component {

  constructor(props, context) {
    super(props, context)
    this.appState = this.props.appState
    this.featureStore = this.props.featureStore
    this.onInfoClicked = this.onInfoClicked.bind(this)
    this.onExpSearchClick = this.onExpSearchClick.bind(this)
    this.onSearchTextChange = this.onSearchTextChange.bind(this)
  }

  // When search expands, set the search string to ""
  onExpSearchClick(isExpanded) {
    if (!isExpanded) {
      this.featureStore.setGeneralSearchString("")
    }
  }

  // When search text changes, update to the feature store
  onSearchTextChange(e) {
    const v = e.target.value
    this.featureStore.setGeneralSearchString(v)
  }

  // Update the app state when a new window is selected
  onElementClicked(index) {
    this.appState.setWindowIndex(index)
  }

  //TODO implement info window
  onInfoClicked() {
    console.log("info")
  }

  render() {

    // Get icon classes based on window currently selected
    const baseCn = "top-nav-link nav-btn icon-ui-flush font-size-2"
    const wI = this.appState.windowIndex
    const i1cn = baseCn + (wI === 1 ? " text-blue" : "") + " icon-ui-maps"
    const i2cn = baseCn + (wI === 2 ? " text-blue" : "") + " icon-ui-calendar"

    return (
      <div className="grid-container">
      <div className="column-24">
        <header className="top-nav no-margin">

          <div className="Banner">
            <div className="tablet-hide">
              <a href="#" className="top-nav-title">After Office Hours</a>
              <nav className="top-nav-list">
                <a className="top-nav-link font-size-1" href="#">Home</a>
                <a className="top-nav-link font-size-1" href="#"
                  onClick={this.onElementClicked.bind(this, 1)}>About</a>
                <a className="top-nav-link font-size-1"
                  href="https://arcg.is/0fuiCi"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ paddingRight: '10px' }}>
                  Sign Up</a>
                <a className="top-nav-link font-size-1"
                  href="#"
                  onClick={this.onElementClicked.bind(this, 2)}>Browse volunteers</a>
              </nav>

              <nav className="class-top-nav-list right">
                <ExpSearchInput
                  onExpClick={this.onExpSearchClick}
                  onTextChange={this.onSearchTextChange}
                  value={this.featureStore.genSearchString}
                  isActive={this.featureStore.genSearchString} />
              </nav>
            </div>
          </div>

        </header>
      </div>
      </div>
    );
  }
})

export default TopNav;
