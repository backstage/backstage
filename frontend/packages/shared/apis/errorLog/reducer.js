import * as constants from './constants';
import moment from 'moment';

/**
 * The error log is a runtime log for error details that shouldn't be shown in the UI.
 * The user can open the error log directly from an error message, or from a button in the app bar.
 */

const defaultState = {
  open: false,
  errors: [],
  selectedErrorId: null,
};

const errorLogReducer = (state = defaultState, action) => {
  switch (action.type) {
    case constants.ERROR_LOG_ADD: {
      const newError = {
        id: action.payload.errorId,
        timestamp: moment().format('YYYY-MM-DD HH:mm:ss:SSS Z'), // reusable?
        message: action.payload.message,
        longMessage: action.payload.longMessage,
        error: action.payload.error,
      };

      return { ...state, errors: [newError, ...state.errors] };
    }
    case constants.ERROR_LOG_OPEN:
      return { ...state, open: true, selectedErrorId: action.payload.selectedErrorId };
    case constants.ERROR_LOG_CLOSE:
      return { ...state, open: false };
    case constants.ERROR_LOG_UNSELECT:
      return { ...state, selectedErrorId: null };
    default:
      return state;
  }
};

export default errorLogReducer;
