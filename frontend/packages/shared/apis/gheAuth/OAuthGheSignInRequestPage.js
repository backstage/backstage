import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';
import { initiateLogin } from 'shared/apis/gheAuth/gheAuth';

const OAuthGheSignInRequestPage = ({ targetUrl }) => (
  <Button color="primary" onClick={() => initiateLogin(targetUrl)}>
    Sign in
  </Button>
);

OAuthGheSignInRequestPage.propTypes = {
  targetUrl: PropTypes.string.isRequired,
};

export default OAuthGheSignInRequestPage;
