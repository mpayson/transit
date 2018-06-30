import {decorate, observable, action } from 'mobx';


// Store the control all "app state" data like open windows etc
class AppState {

  windowIndex
  windowPanes

  constructor(){
    this.windowIndex = 1
    this.windowPanes = 2
  }

  setWindowIndex(i){
    this.windowIndex = i;
  }
  setWindowPanes(i){
    this.WindowPanes = i;
  }

}

decorate(AppState, {
  windowIndex: observable,
  setWindowIndex: action.bound,
  winowPanes: observable,
  setWindowPanes: action.bound
})

const singleton = new AppState()

export default singleton