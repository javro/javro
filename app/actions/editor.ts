import { Dispatch } from 'redux';
import * as jsonSourceMapLib from 'json-source-map';
import avro from 'avsc';

export const CHANGE_JSON = 'CHANGE_JSON';
export const CHANGE_AVRO = 'CHANGE_AVRO';
export const CHANGE_AVRO_IS_IN_ERROR = 'CHANGE_AVRO_IS_IN_ERROR';
export const CHANGE_AVRO_PATH = 'CHANGE_AVRO_PATH';
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
  error: string | null;
}

export interface ChangeAvroPathAction {
  type: typeof CHANGE_AVRO_PATH;
  path: string | null;
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

export function changeAvroIsInError(
  error: string | null
): ChangeAvroIsInErrorAction {
  return {
    type: CHANGE_AVRO_IS_IN_ERROR,
    error
  };
}

export function changeAvroPath(path: string | null): ChangeAvroPathAction {
  return {
    type: CHANGE_AVRO_PATH,
    path
  };
}

export function changeAvroPathWithDispatch(
  path: string | null
): (dispatch: Dispatch) => void {
  return (dispatch: Dispatch) => {
    dispatch(changeAvroPath(path));
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
      const avroType = avro.Type.forSchema(parsedAvro);
      const parsedJson = avroType.sample();
      const {
        json: strJson,
        pointers: jsonSourceMap
      } = jsonSourceMapLib.stringify(parsedJson, null, 4);

      dispatch(
        changeAvro({
          str: strAvro,
          parsed: parsedAvro,
          sourceMap: avroSourceMap
        })
      );
      dispatch(
        changeJson({
          str: strJson,
          parsed: parsedJson,
          sourceMap: jsonSourceMap
        })
      );
    } catch (error) {
      dispatch(changeAvro({ str: strAvro, parsed: null, sourceMap: null }));
      dispatch(changeAvroIsInError(error.message));
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
