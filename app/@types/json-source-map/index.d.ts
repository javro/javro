/* eslint-disable */
declare module 'json-source-map' {
  export function stringify(
    inputJson: any,
    _?: null,
    space?: number
  ): {
    json: string;
    pointers: SourceMap;
  };

  export function parse(
    inputJson: string
  ): {
    data: any;
    pointers: SourceMap;
  };

  export type SourceMap = Record<string, Pointer>;

  interface Pointer {
    value: Position;
    valueEnd: Position;
    key: Position | undefined;
    keyEnd: Position | undefined;
  }

  interface Position {
    line: number;
    column: number;
    pos: number;
  }
}
