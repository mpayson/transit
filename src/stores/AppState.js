import {decorate, observable, action } from 'mobx';

// Store the control all "app state" data like open windows etc
class AppState {

  windowIndex

  constructor(){
    this.browsePane = "map";
    this.profileTab = 0;
  }

  setBrowsePane(paneStr){
    this.browsePane = paneStr;
  }

  setProfileTab(tab){
    this.profileTab = tab;
  }

}

decorate(AppState, {
  setBrowsePane: action.bound,
  profileTab: observable,
  setProfileTab: action.bound,
  browsePane: observable
})

const singleton = new AppState()

export default singleton