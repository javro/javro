import { SourceMap } from 'json-source-map';

export default function getJsonPathFromPosition(
  position: { line: number; column: number },
  sourceMap: SourceMap
) {
  return Object.entries(sourceMap)
    .filter(([, pointer]) => {
      let start = pointer.value;
      if (pointer.key !== undefined) {
        start = pointer.key;
      }
      const end = pointer.valueEnd;

      const isStartBefore =
        start.line < position.line ||
        (start.line === position.line && start.column <= position.column);

      const isEndAfter =
        end.line > position.line ||
        (end.line === position.line && end.column >= position.column);

      return isStartBefore && isEndAfter;
    })
    .map(([key]) => key)
    .reduce((longestKey, currentKey) => {
      if (currentKey.length > longestKey.length) {
        return currentKey;
      }
      return longestKey;
    }, '');
}
