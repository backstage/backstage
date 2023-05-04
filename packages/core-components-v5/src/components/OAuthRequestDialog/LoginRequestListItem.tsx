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

import { makeStyles } from 'tss-react/mui';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import React, { useState } from 'react';
import { isError } from '@backstage/errors';
import { PendingOAuthRequest } from '@backstage/core-plugin-api';

export type LoginRequestListItemClassKey = 'root';

const useItemStyles = makeStyles({ name: 'BackstageLoginRequestListItem' })(
  theme => ({
    root: {
      paddingLeft: theme.spacing(3),
    },
  }),
);

type RowProps = {
  request: PendingOAuthRequest;
  busy: boolean;
  setBusy: (busy: boolean) => void;
};

const LoginRequestListItem = ({ request, busy, setBusy }: RowProps) => {
  const { classes } = useItemStyles();
  const [error, setError] = useState<string>();

  const handleContinue = async () => {
    setBusy(true);
    try {
      await request.trigger();
    } catch (e) {
      setError(isError(e) ? e.message : 'An unspecified error occurred');
    } finally {
      setBusy(false);
    }
  };

  const IconComponent = request.provider.icon;

  return (
    <ListItem disabled={busy} classes={{ root: classes.root }}>
      <ListItemAvatar>
        <IconComponent fontSize="large" />
      </ListItemAvatar>
      <ListItemText
        primary={request.provider.title}
        secondary={error && <Typography color="error">{error}</Typography>}
      />
      <Button color="primary" variant="contained" onClick={handleContinue}>
        Log in
      </Button>
    </ListItem>
  );
};

export default LoginRequestListItem;
