import { Action, Dispatch as ReduxDispatch, Store as ReduxStore } from 'redux';

export type javroStateType = {
  counter: number;
};

export type GetState = () => javroStateType;

export type Dispatch = ReduxDispatch<Action<string>>;

export type Store = ReduxStore<javroStateType, Action<string>>;
