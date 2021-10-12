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

import { makeStyles, Theme } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import List from '@material-ui/core/List';
import Button from '@material-ui/core/Button';
import React, { useMemo, useState } from 'react';
import { useObservable } from 'react-use';
import LoginRequestListItem from './LoginRequestListItem';
import { useApi, oauthRequestApiRef } from '@backstage/core-plugin-api';

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
    >
      <DialogTitle classes={{ root: classes.title }}>
        Login Required
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

      <DialogActions classes={{ root: classes.actionButtons }}>
        <Button onClick={handleRejectAll}>Reject All</Button>
      </DialogActions>
    </Dialog>
  );
}
