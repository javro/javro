import { CHANGE_AVRO, CHANGE_JSON, EditorActions } from '../actions/editor';

export interface EditorState {
  avro: {
    value: string;
  };
  json: {
    value: string;
  };
}

const defaultState: EditorState = {
  avro: {
    value: 'avro'
  },
  json: {
    value: 'json'
  }
};

export default function editor(state = defaultState, action: EditorActions) {
  switch (action.type) {
    case CHANGE_JSON: {
      return { ...state, json: { ...state.json, value: action.value } };
    }
    case CHANGE_AVRO: {
      return { ...state, avro: { ...state.avro, value: action.value } };
    }
    default:
      return state;
  }
}
