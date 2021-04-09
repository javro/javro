import { Type, types } from 'avsc';

const { RecordType, WrappedUnionType, UnwrappedUnionType, ArrayType } = types;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type JsonObject = any;

export default function avroPathToJsonPath(
  avroPath: string,
  nestedAvro: JsonObject
): string {
  if (avroPath === '') {
    return '';
  }
  const avroNodesName = avroPath.split('/');
  avroNodesName.shift();

  let parentAvscType: Type = Type.forSchema(nestedAvro);
  let curAvroNode = nestedAvro;
  const jsonNodeNames = avroNodesName
    .map((avroNodeName) => {
      curAvroNode = curAvroNode[avroNodeName];
      if (
        parentAvscType instanceof RecordType &&
        curAvroNode?.type &&
        parentAvscType.fields[+avroNodeName]
      ) {
        const currentAvscType = parentAvscType.fields[+avroNodeName];
        parentAvscType = currentAvscType.type;
        return currentAvscType.name;
      }
      if (
        parentAvscType instanceof WrappedUnionType &&
        parentAvscType.types[+avroNodeName]
      ) {
        const currentAvscType = parentAvscType.types[+avroNodeName];
        parentAvscType = currentAvscType;
        return currentAvscType.branchName;
      }

      if (parentAvscType instanceof ArrayType) {
        parentAvscType = parentAvscType.itemsType;
        return '0';
      }

      if (
        parentAvscType instanceof UnwrappedUnionType &&
        parentAvscType.types[+avroNodeName]
      ) {
        parentAvscType = parentAvscType.types[+avroNodeName];
        return undefined;
      }

      return undefined;
    })
    .filter((jsonNodeName) => jsonNodeName !== undefined);

  return `/${jsonNodeNames.join('/')}`;
}
