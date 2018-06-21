import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import '../node_modules/calcite-web/dist/css/calcite-web.css'
import App from './App';
import registerServiceWorker from './registerServiceWorker';

//The entry point for the application
ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
