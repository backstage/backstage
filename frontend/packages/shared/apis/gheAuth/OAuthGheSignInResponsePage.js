import React from 'react';
import qs from 'qs';
import { connect } from 'react-redux';
import { GheClient } from 'shared/apis/ghe';
import { getNewAccessToken, validateLoginState } from 'shared/apis/gheAuth/gheAuth';
import Progress from 'shared/components/Progress';
import * as gheAuthActions from 'shared/apis/gheAuth/actions';

const OAuthGheSignInResponsePage = ({ dispatch }) => {
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const { code, state } = qs.parse(window.location.search.slice(1));
    const originalUrl = validateLoginState(state);

    if (!code || !state || !originalUrl) {
      setError(new Error('Illegal request'));
    } else {
      getNewAccessToken(code, state)
        .then(accessToken => {
          return GheClient.fromAccessToken(accessToken)
            .getUserInfo()
            .then(userInfo => dispatch(gheAuthActions.gheLoggedIn(accessToken, userInfo, originalUrl)));
        })
        .catch(setError);
    }
  }, [dispatch]);

  return error ? error.toString() : <Progress />;
};

export default connect()(OAuthGheSignInResponsePage);
