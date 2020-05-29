import { Dispatch } from 'redux';
import * as jsonSourceMapLib from 'json-source-map';
import avro from 'avsc';

export const CHANGE_JSON = 'CHANGE_JSON';
export const CHANGE_AVRO = 'CHANGE_AVRO';
export const CHANGE_AVRO_IS_IN_ERROR = 'CHANGE_AVRO_IS_IN_ERROR';
export const AVRO_MOUSE_MOVE = 'AVRO_MOUSE_MOVE';

export interface ChangeJsonAction {
  type: typeof CHANGE_JSON;
  value: {
    str: string;
    parsed: object | null;
    sourceMap: jsonSourceMapLib.SourceMap | null;
  };
}

export interface ChangeAvroAction {
  type: typeof CHANGE_AVRO;
  value: {
    str: string;
    parsed: object | null;
    sourceMap: jsonSourceMapLib.SourceMap | null;
  };
}

export interface AvroMouseMoveAction {
  type: typeof AVRO_MOUSE_MOVE;
  position: { line: number; column: number } | null;
}

export interface ChangeAvroIsInErrorAction {
  type: typeof CHANGE_AVRO_IS_IN_ERROR;
}

export function changeJson(value: {
  str: string;
  parsed: object | null;
  sourceMap: jsonSourceMapLib.SourceMap | null;
}): ChangeJsonAction {
  return {
    type: CHANGE_JSON,
    value
  };
}

export function changeAvro(value: {
  str: string;
  parsed: object | null;
  sourceMap: jsonSourceMapLib.SourceMap | null;
}): ChangeAvroAction {
  return {
    type: CHANGE_AVRO,
    value
  };
}

export function changeAvroIsInError(): ChangeAvroIsInErrorAction {
  return {
    type: CHANGE_AVRO_IS_IN_ERROR
  };
}

export function changeAvroWithDispatch(
  strAvro: string
): (dispatch: Dispatch) => void {
  return (dispatch: Dispatch) => {
    try {
      const {
        data: parsedAvro,
        pointers: avroSourceMap
      } = jsonSourceMapLib.parse(strAvro);
      dispatch(
        changeAvro({
          str: strAvro,
          parsed: parsedAvro,
          sourceMap: avroSourceMap
        })
      );
      const avroType = avro.Type.forSchema(parsedAvro);
      const parsedJson = avroType.sample();
      const {
        json: strJson,
        pointers: jsonSourceMap
      } = jsonSourceMapLib.stringify(parsedJson, null, 4);
      dispatch(
        changeJson({
          str: strJson,
          parsed: parsedJson,
          sourceMap: jsonSourceMap
        })
      );
    } catch (error) {
      dispatch(changeAvro({ str: strAvro, parsed: null, sourceMap: null }));
      dispatch(changeAvroIsInError());
    }
  };
}

export function avroMouseMove(
  position: { line: number; column: number } | null
) {
  return {
    type: AVRO_MOUSE_MOVE,
    position
  };
}
