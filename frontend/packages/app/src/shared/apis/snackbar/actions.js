import * as constants from './constants';
import { errorLogAdd } from 'shared/apis/errorLog/actions';

const DEFAULT_TIMEOUT = 5000;

/**
 * Show default / neutral snackbar
 * @param {String} message  - A human readable short message
 * @param {Object} [options] - Optional options object
 * @param {Number} [options.duration] - Duration in ms until the message will be automatically hidden
 */
export const snackbarOpenDefault = (message, options = {}) => dispatch => {
  const { duration = DEFAULT_TIMEOUT } = options;
  dispatch({
    type: constants.SNACKBAR_OPEN_DEFAULT,
    payload: {
      open: true,
      message,
      type: 'default',
      duration,
    },
  });
};

/**
 * Show success snackbar
 * @param {String} message - A human readable short message
 * @param {Object} [options] - Optional options object
 * @param {Number} [options.duration] - Duration in ms until the message will be automatically hidden
 */
export const snackbarOpenSuccess = (message, options = {}) => dispatch => {
  const { duration = DEFAULT_TIMEOUT } = options;
  dispatch({
    type: constants.SNACKBAR_OPEN_SUCCESS,
    payload: {
      open: true,
      message,
      type: 'success',
      duration,
    },
  });
};

/**
 * Show error snackbar
 * @param {String} message - A human readable short error message
 * @param {String|Object} error - Details of the error, e.g response code + message from a backend, or a stacktrace / error object
 * @param longMessage - Optional: An extra error message that can be long and contain html
 */
export const snackbarOpenError = (message, error, longMessage) => dispatch => {
  let errorId;
  if (error) {
    errorId = Math.random()
      .toString(36)
      .substring(7);
    // batching actions?
    // https://github.com/reactjs/redux/issues/911#issuecomment-149361073
    // -> https://github.com/tshelburne/redux-batched-actions
    errorLogAdd(message, error, errorId, longMessage)(dispatch);
  }

  dispatch({
    type: constants.SNACKBAR_OPEN_ERROR,
    payload: {
      open: true,
      message,
      type: 'error',
      errorId,
    },
  });
};

/**
 * Close the snackbar
 */
export const snackbarClose = () => dispatch => {
  dispatch({
    type: constants.SNACKBAR_CLOSE,
  });
};
