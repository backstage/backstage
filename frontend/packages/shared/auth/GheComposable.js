import React, { Component } from 'react';
import { connect } from 'react-redux';
import { GheClient } from 'shared/apis/ghe';
import { getCachedGheAccessToken } from 'shared/apis/gheAuth/gheAuth';
import * as gheAuthActions from 'shared/apis/gheAuth/actions';
import Progress from 'shared/components/Progress';
import GheSignInDialog from 'shared/auth/GheSignInDialog';

const mapStateToProps = state => ({
  isLoggedIn: !!state.gheAuth.user,
  gheUser: state.gheAuth.user,
});

/**
 * withGheAuth is a higher-order-component (HOC) which takes any React component
 * and returns a component that will display an auth dialogue if the user
 * is not authenticated with GHE.  If the user is authenticated, the
 * `gheUser` and `gheApi` props will be provided to the wrapped component.
 * Options:
 *  - showDialog: Automatically show the login dialog if user is not authenticated with GHE. (Default: true)
 *  - message: The message displayed in the dialog content area
 */
export const withGheAuth = (opts = {}) => BaseComponent => {
  class GheAuthorizedView extends Component {
    state = {
      loading: false,
    };

    options = {
      showDialog: true,
      ...opts,
    };

    checkRequiredScopes(gheApi) {
      if (this.options.requiredScopes) {
        gheApi.verifyUserHasScopes(this.options.requiredScopes).then(response => {
          if (!response) {
            if (this.props.isLoggedIn) {
              this.props.dispatch(gheAuthActions.gheLogOut());
            }
            this.setState({ loading: false });
          }
        });
      }
    }

    componentDidMount() {
      if (this.props.isLoggedIn) {
        this.checkRequiredScopes(GheClient.fromAccessToken(this.props.gheUser.accessToken));
      } else {
        // Did we have a previous token lying around? If so, try to make use of it.
        const accessToken = getCachedGheAccessToken();

        if (accessToken) {
          this.setState({ loading: true });

          const gheApi = GheClient.fromAccessToken(accessToken);

          // Attempts to fetch user info and perform a login action with a pre-existing token. If it fails,
          // we just set loading to false and let the route insert a sign-in page as a result (see below).
          gheApi
            .getUserInfo()
            .then(userInfo => this.props.dispatch(gheAuthActions.gheLoggedIn(accessToken, userInfo)))
            .catch(error => {
              console.error('GHE Authorization Error when retrieving user info', error);

              this.setState({ loading: false });
            });

          this.checkRequiredScopes(gheApi);
        }
      }
    }

    render() {
      const { isLoggedIn } = this.props;
      const { loading } = this.state;
      const { showDialog, message } = this.options;

      const props = Object.assign({}, this.props);
      if (isLoggedIn) {
        props.gheApi = GheClient.fromAccessToken(this.props.gheUser.accessToken);
      } else if (loading) {
        return <Progress />;
      } else if (showDialog) {
        return <GheSignInDialog message={message} open={showDialog} />;
      }

      return <BaseComponent {...props} />;
    }
  }

  return connect(mapStateToProps)(GheAuthorizedView);
};
