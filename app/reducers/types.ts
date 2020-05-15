import { Action, Dispatch as ReduxDispatch, Store as ReduxStore } from 'redux';
import { EditorState } from './editor';

export type JavroStateType = {
  editor: EditorState;
};

export type GetState = () => JavroStateType;

export type Dispatch = ReduxDispatch<Action<string>>;

export type Store = ReduxStore<JavroStateType, Action<string>>;
