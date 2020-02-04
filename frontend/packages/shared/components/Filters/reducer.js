import { INITIALIZE, UPDATE_VALUE, REPLACE_VALUE, RESET } from './constants';

export class FilterSelectors {
  static getValues(state, filterId) {
    return state.filters[filterId];
  }
}

const defaultState = {};

const filtersReducer = (state = defaultState, action = { payload: {} }) => {
  const { id, filterSetId, preload, update } = action.payload || {};

  switch (action.type) {
    case INITIALIZE:
      return { ...state, [id]: preload };
    case UPDATE_VALUE:
      return {
        ...state,
        [id]: {
          ...state[id],
          [filterSetId]: {
            ...state[id][filterSetId],
            ...update,
          },
        },
      };
    case REPLACE_VALUE:
      return {
        ...state,
        [id]: {
          ...state[id],
          [filterSetId]: {
            ...update,
          },
        },
      };
    case RESET:
      return {
        ...state,
        [id]: {},
      };
    default:
      return state;
  }
};

export default filtersReducer;
