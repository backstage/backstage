import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@material-ui/core';
import React, { FC, useState } from 'react';
import { useObservable } from 'react-use';
import { PendingRequest } from 'shared/apis/oauth/OAuthPendingRequests';
import { OAuthScopes } from 'shared/apis/oauth/types';
import Button from 'shared/components/Button';
import Observable from 'zen-observable';
import { googleAuthHelper } from './GoogleAuthHelper';
import { googleAuthPendingRequests } from './GoogleAuthPendingRequests';
import { GoogleSession } from './types';

type Props = {
  scopesRequest$: Observable<PendingRequest<GoogleSession>>;
  onRequestConsent: (scopes: OAuthScopes) => Promise<GoogleSession>;
};

const defaultProps: Props = {
  scopesRequest$: googleAuthPendingRequests.pending(),
  onRequestConsent: scopes => googleAuthHelper.showPopup(scopes.toString()),
};

const GoogleAuthDialog: FC<Props> = props => {
  const { scopesRequest$, onRequestConsent } = { ...defaultProps, ...props };
  const [error, setError] = useState<Error>();
  const [busy, setBusy] = useState(false);
  const scopesRequest = useObservable(scopesRequest$);

  const handleContinue = async () => {
    const currentRequest = scopesRequest;

    if (currentRequest && currentRequest.scopes) {
      setBusy(true);
      try {
        const session = await onRequestConsent(currentRequest.scopes);
        currentRequest.resolve(session);
      } catch (e) {
        setError(e);
      } finally {
        setBusy(false);
      }
    }
  };

  const handleReject = () => {
    const error = new Error('Google auth failed, the user rejected');
    error.name = 'PopupClosedError';
    scopesRequest!.reject(error);
  };

  return (
    <Dialog open={Boolean(scopesRequest && scopesRequest.scopes)}>
      <DialogTitle>Google Auth Required</DialogTitle>
      <DialogContent>
        <DialogContentText>Some content on this page requires you to authenticate with Google.</DialogContentText>
        {error && <Typography color="error">{error.message || 'An unspecified error occurred'}</Typography>}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleReject}>Reject</Button>
        <Button onClick={handleContinue} disabled={busy} color="primary">
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GoogleAuthDialog;
