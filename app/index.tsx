import fs from 'fs';
import React, { Fragment } from 'react';
import { render } from 'react-dom';
import { AppContainer as ReactHotAppContainer } from 'react-hot-loader';
import Root from './containers/Root';
import { configureStore, history } from './store/configureStore';
import './app.global.css';
import { changeAvroWithDispatch } from './actions/editor';

const store = configureStore();

const urlParams = new URLSearchParams(window.location.search);
const path = urlParams.get('path');
if (path && fs.existsSync(path)) {
  const avro = fs.readFileSync(path, 'utf8');
  changeAvroWithDispatch(avro)(store.dispatch);
}

const AppContainer = process.env.PLAIN_HMR ? Fragment : ReactHotAppContainer;

document.addEventListener('DOMContentLoaded', () =>
  render(
    <AppContainer>
      <Root store={store} history={history} />
    </AppContainer>,
    document.getElementById('root')
  )
);
