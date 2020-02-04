import * as constants from './constants';

const defaultState = {
  open: false,
  message: '',
  type: 'default',
};

const snackbarReducer = (state = defaultState, action) => {
  switch (action.type) {
    case constants.SNACKBAR_OPEN_DEFAULT:
    case constants.SNACKBAR_OPEN_SUCCESS:
    case constants.SNACKBAR_OPEN_ERROR:
      return { ...state, ...action.payload };
    case constants.SNACKBAR_CLOSE:
      return { ...state, open: false };
    default:
      return state;
  }
};

export default snackbarReducer;
