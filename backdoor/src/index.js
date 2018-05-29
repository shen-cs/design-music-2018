import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import 'typeface-roboto';
import App from './containers/App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
