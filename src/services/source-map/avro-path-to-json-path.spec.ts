import avroPathToJsonPath from './avro-path-to-json-path';

const nestedAvro = {
  name: 'r1',
  type: 'record',
  fields: [
    {
      name: 'r11',
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

describe('retrieve json path from avro path', () => {
  test('rootRecord', () => {
    const result = avroPathToJsonPath('/fields/0', nestedAvro);
    expect(result).toEqual('/r11');
  });

  test('2 levels Record', () => {
    const result = avroPathToJsonPath('/fields/0/type/fields/0', nestedAvro);
    expect(result).toEqual('/r11/r111');
  });

  test('3 levels Record', () => {
    const result = avroPathToJsonPath(
      '/fields/0/type/fields/1/type/fields/0',
      nestedAvro
    );
    expect(result).toEqual('/r11/r112/r1112');
  });

  test("3 levels Record's name fields", () => {
    const result = avroPathToJsonPath(
      '/fields/0/type/fields/1/type/fields/0/name',
      nestedAvro
    );
    expect(result).toEqual('/r11/r112/r1112');
  });

  test('simple string', () => {
    const stringAvro = {
      name: 'test',
      type: 'string',
    };
    const result = avroPathToJsonPath('', stringAvro);
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

    test('type which is sampled in json', () => {
      const result = avroPathToJsonPath('/fields/0/type/0', unionAvro);
      expect(result).toEqual('/field1');
    });
    test('type which is not sampled in json', () => {
      const result = avroPathToJsonPath(
        '/fields/0/type/1/fields/name',
        unionAvro
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

    const result = avroPathToJsonPath(
      '/fields/0/type/items/fields/0/name',
      arrayAvro
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
                type: {
                  name: 'TheArray',
                  type: 'array',
                  items: 'string',
                },
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
  const result = avroPathToJsonPath(
    '/fields/0/type/0/fields/0/type/0',
    avroWithWrappedUnionType
  );

  expect(result).toEqual('/root/com.namespace.union1/union1Field/0');
});

test('unwrapped union type', () => {
  const avroWithUnWrappedUnionType = {
    namespace: 'com.namespace',
    name: 'Toto',
    type: 'record',
    fields: [
      {
        name: 'root',
        type: [
          {
            name: 'Wrapped',
            type: 'record',
            fields: [
              {
                name: 'wrappedField',
                items: 'string',
                type: {
                  name: 'TheArray',
                  type: 'array',
                  items: 'string',
                },
              },
            ],
          },
        ],
      },
    ],
  };
  const result = avroPathToJsonPath(
    '/fields/0/type/0/fields/0/type/0',
    avroWithUnWrappedUnionType
  );

  expect(result).toEqual('/root/wrappedField/0');
});
