import * as constants from './constants';

/**
 * Add new entry to error log
 * @param {String} message - Human readable error message
 * @param {String|Object} error - Error message or object
 * @param {String} errorId - Id of error
 * @param {String} longFailureMessage - Optional: An extra error message that can be long and contain html
 */
export const errorLogAdd = (message, error, errorId, longMessage) => dispatch => {
  dispatch({
    type: constants.ERROR_LOG_ADD,
    payload: {
      message,
      error: `${error}`,
      errorId,
      longMessage,
    },
  });
};

/**
 * Close error log
 */
export const errorLogClose = () => dispatch => {
  dispatch({
    type: constants.ERROR_LOG_CLOSE,
  });
};

/**
 * Open snackbar
 * @param {String} errorId - Optional: Error to highlight
 */
export const errorLogOpen = errorId => dispatch => {
  dispatch({
    type: constants.ERROR_LOG_OPEN,
    payload: {
      selectedErrorId: errorId,
    },
  });
};

/**
 * Stop highlighting error
 */
export const unselectError = () => dispatch => {
  dispatch({
    type: constants.ERROR_LOG_UNSELECT,
  });
};
