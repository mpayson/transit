import {decorate, observable, action } from 'mobx';


// Store the control all "app state" data like open windows etc
class AppState {

  windowIndex

  constructor(){
    this.windowIndex = 1
    this.currentPage = 1
    this.itemsPerPage = 4
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

}

decorate(AppState, {
  windowIndex: observable,
  setWindowIndex: action.bound,
  currentPage: observable,
  setCurrentPage: action.bound,
  itemsPerPage: observable,
  setItemsPerPage: action.bound
})

const singleton = new AppState()

export default singleton