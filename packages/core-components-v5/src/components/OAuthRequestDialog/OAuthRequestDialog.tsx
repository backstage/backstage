/*
 * Copyright 2020 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Theme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import List from '@mui/material/List';
import Button from '@mui/material/Button';
import React, { useMemo, useState } from 'react';
import useObservable from 'react-use/lib/useObservable';
import LoginRequestListItem from './LoginRequestListItem';
import {
  useApi,
  configApiRef,
  oauthRequestApiRef,
} from '@backstage/core-plugin-api';
import Typography from '@mui/material/Typography';

export type OAuthRequestDialogClassKey =
  | 'dialog'
  | 'title'
  | 'contentList'
  | 'actionButtons';

const useStyles = makeStyles<Theme>(
  theme => ({
    dialog: {
      paddingTop: theme.spacing(1),
    },
    title: {
      minWidth: 0,
    },
    titleHeading: {
      fontSize: theme.typography.h6.fontSize,
    },
    contentList: {
      padding: 0,
    },
    actionButtons: {
      padding: theme.spacing(2, 0),
    },
  }),
  { name: 'OAuthRequestDialog' },
);

export function OAuthRequestDialog(_props: {}) {
  const classes = useStyles();
  const [busy, setBusy] = useState(false);
  const oauthRequestApi = useApi(oauthRequestApiRef);
  const configApi = useApi(configApiRef);

  const authRedirect =
    configApi.getOptionalBoolean('enableExperimentalRedirectFlow') ?? false;

  const requests = useObservable(
    useMemo(() => oauthRequestApi.authRequest$(), [oauthRequestApi]),
    [],
  );

  const handleRejectAll = () => {
    requests.forEach(request => request.reject());
  };

  return (
    <Dialog
      open={Boolean(requests.length)}
      fullWidth
      maxWidth="xs"
      classes={{ paper: classes.dialog }}
      aria-labelledby="oauth-req-dialog-title"
    >
      <main>
        <DialogTitle
          classes={{ root: classes.title }}
          id="oauth-req-dialog-title"
        >
          <Typography
            className={classes.titleHeading}
            variant="h1"
            variantMapping={{ h1: 'span' }}
          >
            Login Required
          </Typography>
          {authRedirect ? (
            <Typography>
              This will trigger a http redirect to OAuth Login.
            </Typography>
          ) : null}
        </DialogTitle>

        <DialogContent dividers classes={{ root: classes.contentList }}>
          <List>
            {requests.map(request => (
              <LoginRequestListItem
                key={request.provider.title}
                request={request}
                busy={busy}
                setBusy={setBusy}
              />
            ))}
          </List>
        </DialogContent>
      </main>

      <DialogActions classes={{ root: classes.actionButtons }}>
        <Button onClick={handleRejectAll}>Reject All</Button>
      </DialogActions>
    </Dialog>
  );
}
