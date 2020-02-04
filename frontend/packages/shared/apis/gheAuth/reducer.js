import * as actionConstants from 'shared/actions/actionConstants';

const initialState = {
  user: null,
};

const gheAuthReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionConstants.GHE_LOGGED_IN:
      return _gheLoggedIn(state, action);
    case actionConstants.GHE_LOGGED_OUT:
      return _gheLoggedOut(state, action);
    default:
      break;
  }
  return state;
};

export default gheAuthReducer;

// Private methods below

const _gheLoggedIn = (state, action) => {
  return { ...state, user: action.payload };
};

const _gheLoggedOut = state => {
  return { ...state, user: null };
};
