import getJsonPathFromPosition from './get-json-path-from-position';

describe('easy cases', () => {
  const aSourceMap = {
    '/value1': {
      key: { line: 1, column: 1, pos: 93 },
      keyEnd: { line: 1, column: 11, pos: 100 },
      value: { line: 1, column: 13, pos: 102 },
      valueEnd: { line: 2, column: 5, pos: 1906 }
    },
    '/value2': {
      key: { line: 2, column: 6, pos: 93 },
      keyEnd: { line: 3, column: 11, pos: 100 },
      value: { line: 3, column: 13, pos: 102 },
      valueEnd: { line: 4, column: 5, pos: 1906 }
    }
  };

  it('find the value 1', () => {
    const positionInValue1 = {
      line: 1,
      column: 2
    };

    expect(getJsonPathFromPosition(positionInValue1, aSourceMap)).toEqual(
      '/value1'
    );
  });
  it('find the value 2', () => {
    const positionInValue2 = {
      line: 3,
      column: 5
    };

    expect(getJsonPathFromPosition(positionInValue2, aSourceMap)).toEqual(
      '/value2'
    );
  });

  it('find the value in a position on a line which contains both values', () => {
    const positionInValue1 = {
      line: 2,
      column: 5
    };

    expect(getJsonPathFromPosition(positionInValue1, aSourceMap)).toEqual(
      '/value1'
    );
    const positionInValue2 = {
      line: 2,
      column: 7
    };

    expect(getJsonPathFromPosition(positionInValue2, aSourceMap)).toEqual(
      '/value2'
    );
  });
});

test('entry with no key', () => {
  const aSourceMap = {
    '': {
      value: { line: 0, column: 0, pos: 0 },
      valueEnd: { line: 0, column: 8, pos: 8 },
      key: undefined,
      keyEnd: undefined
    }
  };
  const position = {
    line: 0,
    column: 7
  };
  expect(getJsonPathFromPosition(position, aSourceMap)).toEqual('');
});

test('nested objects', () => {
  const aSourceMap = {
    '': {
      value: { line: 0, column: 0, pos: 0 },
      valueEnd: { line: 8, column: 1, pos: 133 },
      key: undefined,
      keyEnd: undefined
    },
    '/value1': {
      key: { line: 1, column: 4, pos: 6 },
      keyEnd: { line: 1, column: 12, pos: 14 },
      value: { line: 1, column: 14, pos: 16 },
      valueEnd: { line: 4, column: 5, pos: 80 }
    },
    '/value1/nested1': {
      key: { line: 2, column: 8, pos: 26 },
      keyEnd: { line: 2, column: 17, pos: 35 },
      value: { line: 2, column: 19, pos: 37 },
      valueEnd: { line: 2, column: 27, pos: 45 }
    },
    '/value1/nested2': {
      key: { line: 3, column: 8, pos: 55 },
      keyEnd: { line: 3, column: 17, pos: 64 },
      value: { line: 3, column: 19, pos: 66 },
      valueEnd: { line: 3, column: 27, pos: 74 }
    },
    '/value2': {
      key: { line: 5, column: 4, pos: 86 },
      keyEnd: { line: 5, column: 12, pos: 94 },
      value: { line: 5, column: 14, pos: 96 },
      valueEnd: { line: 7, column: 5, pos: 131 }
    },
    '/value2/nested1': {
      key: { line: 6, column: 8, pos: 106 },
      keyEnd: { line: 6, column: 17, pos: 115 },
      value: { line: 6, column: 19, pos: 117 },
      valueEnd: { line: 6, column: 27, pos: 125 }
    }
  };

  const positionInValue1Nested2 = {
    line: 3,
    column: 10
  };

  expect(getJsonPathFromPosition(positionInValue1Nested2, aSourceMap)).toEqual(
    '/value1/nested2'
  );
});
