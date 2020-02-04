import { INITIALIZE, UPDATE_VALUE, REPLACE_VALUE, RESET } from './constants';

export const initializeFiltersAction = (id, preload = {}) => ({
  type: INITIALIZE,
  payload: { id, preload },
});

export const updateFiltersAction = (id, filterSetId, update) => ({
  type: UPDATE_VALUE,
  payload: { id, filterSetId, update },
});

export const replaceFiltersAction = (id, filterSetId, update) => ({
  type: REPLACE_VALUE,
  payload: { id, filterSetId, update },
});

export const resetFiltersAction = id => ({
  type: RESET,
  payload: { id },
});
