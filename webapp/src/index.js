import 'babel-polyfill';

import React from 'react';
import { render } from 'react-dom';
import { browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import Root from './containers/Root';
import configureStore from './store/configureStore';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';

const store = configureStore()
const history = syncHistoryWithStore(browserHistory, store)

injectTapEventPlugin()

render(
  <MuiThemeProvider style={{height: '100vh', width: '100%'}}>
    <Root store={store} history={history} />
  </MuiThemeProvider>,
  document.getElementById('root')
)
