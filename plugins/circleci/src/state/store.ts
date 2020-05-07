import { init, RematchRootState, RematchDispatch } from '@rematch/core';
import { models, RootModel } from './models';

export type Dispatch = RematchDispatch<RootModel>;
export type iRootState = RematchRootState<RootModel>;
export default init({ models });
