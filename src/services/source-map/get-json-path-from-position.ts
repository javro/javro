import { SourceMap } from 'json-source-map';

export default function getJsonPathFromPosition(
  position: { line: number; column: number },
  sourceMap: SourceMap
) {
  const positionStartingToZero = {
    line: position.line - 1,
    column: position.column - 1,
  };
  return Object.entries(sourceMap)
    .filter(([, pointer]) => {
      let start = pointer.value;
      if (pointer.key !== undefined) {
        start = pointer.key;
      }
      const end = pointer.valueEnd;

      const isStartBefore =
        start.line < positionStartingToZero.line ||
        (start.line === positionStartingToZero.line &&
          start.column <= positionStartingToZero.column);

      const isEndAfter =
        end.line > positionStartingToZero.line ||
        (end.line === positionStartingToZero.line &&
          end.column >= positionStartingToZero.column);

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
