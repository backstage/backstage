import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import { GheIcon } from 'shared/icons';
import OAuthGheSignInRequestPage from 'shared/apis/gheAuth/OAuthGheSignInRequestPage';

const DEFAULT_GHE_MSG = `Some functionality requires you to be logged in with GHE.
In order to log in press the button.`;
const GheSignInDialog = ({ message = DEFAULT_GHE_MSG, originalUrl, open = true }) => (
  <Dialog open={open}>
    <DialogTitle>
      <GheIcon style={{ width: 40, height: 40, marginRight: 10 }} />
      Authenticate to Github Enterprise
    </DialogTitle>
    <DialogContent>
      <DialogContentText>{message}</DialogContentText>
    </DialogContent>
    <DialogActions>
      <OAuthGheSignInRequestPage targetUrl={originalUrl} />
    </DialogActions>
  </Dialog>
);
export default compose(
  withRouter,
  connect((state, props) => {
    const location = props.location;
    const { pathname, search, hash } = location;
    return {
      originalUrl: pathname + search + hash,
    };
  }),
)(GheSignInDialog);
