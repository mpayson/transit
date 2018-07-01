import React from 'react';
import { BrowserRouter, Route } from "react-router-dom";
import App from './App.js';

const Routes = () => (
  <BrowserRouter>
    <div>
      <Route path={process.env.PUBLIC_URL+"/"} component={App}/>
    </div>
  </BrowserRouter>
)

export default Routes