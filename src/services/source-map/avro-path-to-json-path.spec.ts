import * as jsonSourceMap from 'json-source-map';
import avroPathToJsonPath from './avro-path-to-json-path';

const nestedAvro = {
  name: 'r1',
  type: 'record',
  fields: [
    {
      name: 'r11',
      default: 'default value',
      type: {
        name: 'R11',
        type: 'record',
        fields: [
          {
            name: 'r111',
            type: {
              name: 'R111',
              type: 'record',
              fields: [
                {
                  name: 'r1111',
                  type: 'string',
                },
              ],
            },
          },
          {
            name: 'r112',
            type: {
              name: 'R112',
              type: 'record',
              fields: [
                {
                  name: 'r1112',
                  type: 'string',
                },
              ],
            },
          },
        ],
      },
    },
  ],
};

const nestedJson = {
  r11: {
    r111: {
      r1111: 'string',
    },
    r112: {
      r1112: 'string',
    },
  },
};

describe('retrieve json path from avro path', () => {
  test('rootRecord', () => {
    const result = avroPathToJsonPath('/fields/0', nestedAvro, nestedJson);
    expect(result).toEqual('/r11');
  });

  test('2 levels Record', () => {
    const result = avroPathToJsonPath(
      '/fields/0/type/fields/0',
      nestedAvro,
      nestedJson
    );
    expect(result).toEqual('/r11/r111');
  });

  test('3 levels Record', () => {
    const result = avroPathToJsonPath(
      '/fields/0/type/fields/1/type/fields/0',
      nestedAvro,
      nestedJson
    );
    expect(result).toEqual('/r11/r112/r1112');
  });

  test("3 levels Record's name fields", () => {
    const result = avroPathToJsonPath(
      '/fields/0/type/fields/1/type/fields/0/name',
      nestedAvro,
      nestedJson
    );
    expect(result).toEqual('/r11/r112/r1112');
  });

  test('simple string', () => {
    const stringAvro = {
      name: 'test',
      type: 'string',
    };
    const stringJson = jsonSourceMap.stringify('string', null, 2);
    const result = avroPathToJsonPath('', stringAvro, stringJson);
    expect(result).toEqual('');
  });
  describe('union type', () => {
    const unionAvro = {
      name: 'unionAvro',
      type: 'record',
      fields: [
        {
          name: 'field1',
          type: [
            'string',
            {
              type: 'record',
              name: 'NestedRecord',
              fields: [
                {
                  name: 'nestedField',
                  type: 'string',
                },
              ],
            },
          ],
        },
      ],
    };

    const unionJson = {
      field1: 'string',
    };
    test('type which is sampled in json', () => {
      const result = avroPathToJsonPath(
        '/fields/0/type/0',
        unionAvro,
        unionJson
      );
      expect(result).toEqual('/field1');
    });
    test('type which is not sampled in json', () => {
      const result = avroPathToJsonPath(
        '/fields/0/type/1/fields/name',
        unionAvro,
        unionJson
      );
      expect(result).toEqual('/field1');
    });
  });
  test('Arrays', () => {
    const arrayAvro = {
      name: 'arrayAvro',
      type: 'record',
      fields: [
        {
          name: 'arrayField',
          type: {
            type: 'array',
            name: 'NestedRecord',
            items: {
              name: 'FieldInArray',
              type: 'record',
              fields: [
                {
                  name: 'fieldInArray',
                  type: 'string',
                },
              ],
            },
          },
        },
      ],
    };

    const arrayJson = {
      arrayField: [
        {
          fieldInArray: 'string',
        },
      ],
    };

    const result = avroPathToJsonPath(
      '/fields/0/type/items/fields/0/name',
      arrayAvro,
      arrayJson
    );
    expect(result).toEqual('/arrayField/0/fieldInArray');
  });
});

test('wrapped union type', () => {
  const avroWithWrappedUnionType = {
    namespace: 'com.namespace',
    name: 'Toto',
    type: 'record',
    fields: [
      {
        name: 'root',
        type: [
          {
            name: 'union1',
            type: 'record',
            fields: [
              {
                name: 'union1Field',
                items: 'string',
                type: 'array',
              },
            ],
          },
          {
            name: 'union2',
            type: 'record',
            fields: [
              {
                name: 'union2Field',
                type: 'string',
              },
            ],
          },
        ],
      },
    ],
  };
  const jsonWithWrappedUnionType = {
    root: {
      'com.namespace.union1': { union1Field: ['string'] },
      'com.namespace.union2': { union2Field: 'string' },
    },
  };
  const result = avroPathToJsonPath(
    '/fields/0/type/0/fields/0/type/0',
    avroWithWrappedUnionType,
    jsonWithWrappedUnionType
  );

  // TODO handle union expect(result).toEqual('/root/com.namespace.union1/union1Field');
  expect(result).toEqual('/root');
});
