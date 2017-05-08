import React from "react";

import {
  render
} from "react-dom";

import {
  getStore
} from 'tbg-flux-factory';

// Init stores
import authStore from './state/auth';

import {
  Router,
  Route,
  IndexRoute,
  createMemoryHistory
} from 'react-router';

const history = createMemoryHistory();


// Import custom containers here
import App from "./containers/App";
import Login from "./containers/Login";
import ClockIn from './containers/ClockIn';

function requireAuth(nextState, replace) {
  if (!authStore.getStateValue('loggedIn')) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname }
    })
  }
}


// stick it in a DOM ready state
document.onreadystatechange = () => {
  if (document.readyState !== 'complete') return false

  render(
    (
      <Router history={history}>
        <Route path="/" component={App} onEnter={requireAuth}>
          <IndexRoute component={ClockIn} />
        </Route>
        <Route path="login" component={Login} />
      </Router>
    ),
    document.getElementById('main-app')
  );

}
