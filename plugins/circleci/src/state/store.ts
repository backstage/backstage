import { init, RematchRootState, RematchDispatch } from '@rematch/core';
import { models, RootModel } from './models';

const store = init({
  models,
});

export type Store = typeof store;
export type Dispatch = RematchDispatch<RootModel>;
export type iRootState = RematchRootState<RootModel>;

export default store;
