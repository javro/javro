import { combineReducers } from 'redux';
import {
  CHANGE_AVRO,
  CHANGE_AVRO_IS_IN_ERROR,
  CHANGE_JSON,
  ChangeAvroAction,
  ChangeAvroIsInErrorAction,
  ChangeJsonAction
} from '../actions/editor';

export interface EditorState {
  avro: {
    value: string;
    isInError: boolean;
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

function avro(
  state = { value: '', isInError: false },
  action: ChangeAvroAction | ChangeAvroIsInErrorAction
) {
  switch (action.type) {
    case CHANGE_AVRO: {
      return { ...state, value: action.value };
    }
    case CHANGE_AVRO_IS_IN_ERROR: {
      return { ...state, isInError: action.value };
    }
    default:
      return state;
  }
}

export default combineReducers({
  json,
  avro
});
