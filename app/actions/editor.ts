import { Dispatch } from 'redux';
import { avro2json } from 'json2avro/dist';
import avro from 'avsc';

export const CHANGE_JSON = 'CHANGE_JSON';
export const CHANGE_AVRO = 'CHANGE_AVRO';
export const CHANGE_AVRO_IS_IN_ERROR = 'CHANGE_AVRO_IS_IN_ERROR';

export interface ChangeJsonAction {
  type: typeof CHANGE_JSON;
  value: string;
}

export interface ChangeAvroAction {
  type: typeof CHANGE_AVRO;
  value: string;
}

export interface ChangeAvroIsInErrorAction {
  type: typeof CHANGE_AVRO_IS_IN_ERROR;
}

export function changeJson(value: string): ChangeJsonAction {
  return {
    type: CHANGE_JSON,
    value
  };
}

export function changeAvro(value: string): ChangeAvroAction {
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
  value: string
): (dispatch: Dispatch) => void {
  return (dispatch: Dispatch) => {
    dispatch(changeAvro(value));

    try {
      const avroAsObject = JSON.parse(value);
      avro.Type.forSchema(avroAsObject);

      const jsonFromAvro = avro2json(avroAsObject);
      dispatch(changeJson(JSON.stringify(jsonFromAvro, null, 4)));
    } catch (error) {
      dispatch(changeAvroIsInError());
    }
  };
}
