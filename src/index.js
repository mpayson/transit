import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'custom-bootstrap/build/index.css';
import Routes from './Routes';
import registerServiceWorker from './registerServiceWorker';

//The entry point for the application
ReactDOM.render(<Routes />, document.getElementById('root'));
registerServiceWorker();
