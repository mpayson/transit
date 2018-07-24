import React from 'react';
import { HashRouter, Route } from "react-router-dom";
import App from './App.js';

const Routes = () => (
  <HashRouter>
    <div>
      <Route path={"/"} component={App}/>
    </div>
  </HashRouter>
)

export default Routes