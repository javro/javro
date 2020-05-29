import React from 'react';
import { Route, Switch } from 'react-router-dom';
import routes from './routes.json';
import App from './containers/App';
import EditorPage from './containers/EditorPage';

export default function Routes() {
  return (
    <App>
      <Switch>
        <Route path={routes.HOME} component={EditorPage} />
      </Switch>
    </App>
  );
}
