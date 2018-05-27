import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import App from './containers/App';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { BrowserRouter } from 'react-router-dom';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <BrowserRouter>
    <MuiThemeProvider>
      <App />
    </MuiThemeProvider>
  </BrowserRouter>,
document.getElementById('root'));
registerServiceWorker();
