import { AnyAction } from 'redux';
import editor from './editor';
import {
  AVRO_MOUSE_MOVE,
  CHANGE_AVRO,
  CHANGE_AVRO_IS_IN_ERROR,
  CHANGE_JSON
} from '../actions/editor';

const defaultState = {
  avro: {
    value: { str: '', parsed: null, sourceMap: null },
    isInError: false,
    position: null
  },
  json: {
    value: { str: '', parsed: null, sourceMap: null }
  }
};

it('returns default state', () => {
  expect(editor(undefined, {} as AnyAction)).toEqual(defaultState);
});

it('updates avro', () => {
  const resultState = editor(
    {
      ...defaultState,
      avro: {
        ...defaultState.avro,
        value: { str: '', parsed: null, sourceMap: null },
        isInError: true
      }
    },
    {
      type: CHANGE_AVRO,
      value: { str: 'aValue', parsed: {}, sourceMap: {} }
    }
  );
  expect(resultState.avro).toEqual({
    ...defaultState.avro,
    value: { str: 'aValue', parsed: {}, sourceMap: {} },
    isInError: true
  });
});

it('updates avro mouse position', () => {
  const resultState = editor(
    {
      ...defaultState,
      avro: {
        ...defaultState.avro,
        position: null
      }
    },
    {
      type: AVRO_MOUSE_MOVE,
      position: { line: 4, column: 2 }
    }
  );
  expect(resultState.avro).toEqual({
    ...defaultState.avro,
    position: { line: 4, column: 2 }
  });
});

it('updates json', () => {
  const resultState = editor(undefined, {
    type: CHANGE_JSON,
    value: { str: 'aValue', parsed: null, sourceMap: null }
  });

  expect(resultState.json).toEqual({
    value: { str: 'aValue', parsed: null, sourceMap: null }
  });
});

it('handle avro errors', () => {
  const resultState = editor(
    {
      ...defaultState,
      avro: {
        ...defaultState.avro,
        isInError: false
      }
    },
    {
      type: CHANGE_AVRO_IS_IN_ERROR
    }
  );

  expect(resultState.avro.isInError).toEqual(true);
});
