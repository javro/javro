import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import editor from './editor';

export default function createRootReducer(history: History) {
  return combineReducers({
    router: connectRouter(history),
    editor
  });
}
