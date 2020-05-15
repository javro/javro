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

function isInError(
  state = false,
  action: ChangeAvroAction | ChangeAvroIsInErrorAction
) {
  switch (action.type) {
    case CHANGE_AVRO: {
      return false;
    }
    case CHANGE_AVRO_IS_IN_ERROR: {
      return true;
    }
    default:
      return state;
  }
}

function value(state = '', action: ChangeAvroAction) {
  switch (action.type) {
    case CHANGE_AVRO: {
      return action.value;
    }
    default:
      return state;
  }
}

const avro = combineReducers({
  isInError,
  value
});

export default combineReducers({
  json,
  avro
});
