import { AnyAction } from 'redux';
import editor from '../../app/reducers/editor';
import {
  CHANGE_AVRO,
  CHANGE_AVRO_IS_IN_ERROR,
  CHANGE_JSON
} from '../../app/actions/editor';

const defaultState = {
  avro: {
    value: '',
    isInError: false
  },
  json: {
    value: ''
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
        value: '',
        isInError: true
      }
    },
    {
      type: CHANGE_AVRO,
      value: 'aValue'
    }
  );
  expect(resultState.avro).toEqual({
    value: 'aValue',
    isInError: false
  });
});

it('updates json', () => {
  const resultState = editor(undefined, {
    type: CHANGE_JSON,
    value: 'aValue'
  });

  expect(resultState.json).toEqual({
    value: 'aValue'
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
