import { Dispatch } from 'redux';
import { avro2json } from 'json2avro/dist';

export const CHANGE_JSON = 'CHANGE_JSON';
export const CHANGE_AVRO = 'CHANGE_AVRO';

export interface ChangeJsonAction {
  type: typeof CHANGE_JSON;
  value: string;
}

export interface ChangeAvroAction {
  type: typeof CHANGE_AVRO;
  value: string;
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

export function changeAvroWithDispatch(
  value: string
): (dispatch: Dispatch) => void {
  return (dispatch: Dispatch) => {
    dispatch(changeAvro(value));

    const jsonFromAvro = avro2json(JSON.parse(value));
    dispatch(changeJson(JSON.stringify(jsonFromAvro, null, 4)));
  };
}
