import React from 'react';
import { BrowserRouter, Route } from "react-router-dom";
import Utils from './utils/Utils';
import App from './App.js';

const Routes = () => (
  <BrowserRouter>
    <div>
      <Route path={Utils.url("/")} component={App}/>
    </div>
  </BrowserRouter>
)

export default Routes