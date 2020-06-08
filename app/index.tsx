import fs from 'fs';
import React, { Fragment } from 'react';
import { render } from 'react-dom';
import { ipcRenderer } from 'electron';
import { message } from 'antd';
import { AppContainer as ReactHotAppContainer } from 'react-hot-loader';
import Root from './containers/Root';
import { configureStore, history } from './store/configureStore';
import './app.global.css';
import {
  changeAvroPathWithDispatch,
  changeAvroWithDispatch
} from './actions/editor';

const store = configureStore();

ipcRenderer.on('open-file', (_, path) => {
  if (path && fs.existsSync(path)) {
    if (store.getState().editor.avro.isPristine) {
      const avro = fs.readFileSync(path, 'utf8');
      changeAvroWithDispatch(avro)(store.dispatch);
      changeAvroPathWithDispatch(path)(store.dispatch);
    } else {
      message.error('You currently have an opened file with changes.');
    }
  }
});

ipcRenderer.on('message', (_, text) => {
  message.info(text);
});

const AppContainer = process.env.PLAIN_HMR ? Fragment : ReactHotAppContainer;

document.addEventListener('DOMContentLoaded', () =>
  render(
    <AppContainer>
      <Root store={store} history={history} />
    </AppContainer>,
    document.getElementById('root')
  )
);
