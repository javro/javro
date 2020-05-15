import { combineReducers } from 'redux';
import {
  CHANGE_AVRO,
  CHANGE_JSON,
  ChangeAvroAction,
  ChangeJsonAction
} from '../actions/editor';

export interface EditorState {
  avro: {
    value: string;
  };
  json: {
    value: string;
  };
}

function json(state = { value: '' }, action: ChangeJsonAction) {
  switch (action.type) {
    case CHANGE_JSON: {
      return { ...state, value: action.value };
    }
    default:
      return state;
  }
}

function avro(state = { value: '' }, action: ChangeAvroAction) {
  switch (action.type) {
    case CHANGE_AVRO: {
      return { ...state, value: action.value };
    }
    default:
      return state;
  }
}

export default combineReducers({
  json,
  avro
});
