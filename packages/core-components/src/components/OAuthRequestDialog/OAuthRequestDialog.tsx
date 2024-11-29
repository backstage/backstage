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

import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import List from '@material-ui/core/List';
import Button from '@material-ui/core/Button';
import React, { useMemo, useState } from 'react';
import useObservable from 'react-use/esm/useObservable';
import LoginRequestListItem from './LoginRequestListItem';
import {
  useApi,
  configApiRef,
  oauthRequestApiRef,
} from '@backstage/core-plugin-api';
import Typography from '@material-ui/core/Typography';
import { coreComponentsTranslationRef } from '../../translation';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';

export type OAuthRequestDialogClassKey =
  | 'dialog'
  | 'title'
  | 'contentList'
  | 'actionButtons';

const useStyles = makeStyles(
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
  const { t } = useTranslationRef(coreComponentsTranslationRef);

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
            {t('oauthRequestDialog.title')}
          </Typography>
          {authRedirect ? (
            <Typography>{t('oauthRequestDialog.authRedirectTitle')}</Typography>
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
        <Button onClick={handleRejectAll}>
          {t('oauthRequestDialog.rejectAll')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
