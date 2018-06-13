import {decorate, observable, action } from 'mobx';


// Store the control all "app state" data like open windows etc
class AppState {

  windowIndex

  constructor(){
    this.windowIndex = 2
  }

  setWindowIndex(i){
    this.windowIndex = i;
  }

}

decorate(AppState, {
  windowIndex: observable,
  setWindowIndex: action.bound
})

const singleton = new AppState()

export default singleton