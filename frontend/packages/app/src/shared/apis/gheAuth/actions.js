import { push } from 'connected-react-router';
import * as actionConstants from 'shared/actions/actionConstants';
import { removeCachedGheAccessToken, setCachedGheAccessToken } from 'shared/apis/gheAuth/gheAuth';

export function gheLoggedIn(accessToken, userInfo, originalUrl) {
  return dispatch => {
    dispatch({
      type: actionConstants.GHE_LOGGED_IN,
      payload: { accessToken, userInfo },
    });
    setCachedGheAccessToken(accessToken);
    if (originalUrl) {
      dispatch(push(originalUrl));
    }
  };
}

export function gheLogOut() {
  return dispatch => {
    removeCachedGheAccessToken();
    dispatch({
      type: actionConstants.GHE_LOGGED_OUT,
    });
    // TODO: Show success notification
  };
}
