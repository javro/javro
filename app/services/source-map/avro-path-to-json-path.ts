// eslint-disable-next-line @typescript-eslint/no-explicit-any
type JsonObject = any;

export default function avroPathToJsonPath(
  avroPath: string,
  nestedAvro: JsonObject,
  nestedJson: JsonObject
): string {
  if (avroPath === '') {
    return '';
  }
  const avroNodesName = avroPath.split('/');
  avroNodesName.shift();

  let curJsonNode = nestedJson;
  let curAvroNode = nestedAvro;
  const jsonNodeNames = avroNodesName
    .map(avroNodeName => {
      curAvroNode = curAvroNode[avroNodeName];

      if (curAvroNode?.items) {
        const [firstArrayNode] = curJsonNode;
        curJsonNode = firstArrayNode;
        return '0';
      }

      if (curAvroNode?.name && curJsonNode[curAvroNode.name] !== undefined) {
        const jsonNodeName = curAvroNode.name;
        curJsonNode = curJsonNode[jsonNodeName];
        return jsonNodeName;
      }
      return undefined;
    })
    .filter(jsonNodeName => jsonNodeName !== undefined);

  return `/${jsonNodeNames.join('/')}`;
}
