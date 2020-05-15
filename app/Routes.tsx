import React from 'react';
import { Route, Switch } from 'react-router-dom';
import routes from './constants/routes.json';
import App from './containers/App';
import CounterPage from './containers/EditorPage';

export default function Routes() {
  return (
    <App>
      <Switch>
        <Route path={routes.HOME} component={CounterPage} />
      </Switch>
    </App>
  );
}
