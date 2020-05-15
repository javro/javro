import editor from '../../app/reducers/editor';
import {
  CHANGE_AVRO,
  CHANGE_JSON,
  EditorActions
} from '../../app/actions/editor';

it('returns default state', () => {
  expect(editor(undefined, {} as EditorActions)).toEqual({
    avro: {
      value: ''
    },
    json: {
      value: ''
    }
  });
});

it('updates avro', () => {
  expect(
    editor(undefined, {
      type: CHANGE_AVRO,
      value: 'aValue'
    })
  ).toEqual({
    avro: {
      value: 'aValue'
    },
    json: {
      value: ''
    }
  });
});

it('updates json', () => {
  expect(
    editor(undefined, {
      type: CHANGE_JSON,
      value: 'aValue'
    })
  ).toEqual({
    avro: {
      value: ''
    },
    json: {
      value: 'aValue'
    }
  });
});
