import {decorate, observable, action } from 'mobx';

// Store the control all "app state" data like open windows etc
class AppState {

  windowIndex

  constructor(){
    this.windowIndex = 1;
    this.currentPage = 1;
    this.itemsPerPage = 3;
    this.browsePane = "map";
    this.profileTab = 0;
  }

  setWindowIndex(i){
    this.windowIndex = i;
  }

  setCurrentPage(i){
    this.currentPage = i;
  }

  setItemsPerPage(i){
    this.itemsPerPage = i;
  }

  setBrowsePane(paneStr){
    this.browsePane = paneStr;
  }

  setProfileTab(tab){
    this.profileTab = tab;
  }

}

decorate(AppState, {
  windowIndex: observable,
  setWindowIndex: action.bound,
  currentPage: observable,
  setCurrentPage: action.bound,
  itemsPerPage: observable,
  setItemsPerPage: action.bound,
  setBrowsePane: action.bound,
  profileTab: observable,
  setProfileTab: action.bound,
  browsePane: observable,
  setBrowsePane: action.bound
})

const singleton = new AppState()

export default singleton