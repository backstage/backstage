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
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import React, { useState } from 'react';
import { isError } from '@backstage/errors';
import { PendingAuthRequest } from '@backstage/core-plugin-api';

export type LoginRequestListItemClassKey = 'root';

const useItemStyles = makeStyles<Theme>(
  theme => ({
    root: {
      paddingLeft: theme.spacing(3),
    },
  }),
  { name: 'BackstageLoginRequestListItem' },
);

type RowProps = {
  request: PendingAuthRequest;
  busy: boolean;
  setBusy: (busy: boolean) => void;
};

const LoginRequestListItem = ({ request, busy, setBusy }: RowProps) => {
  const classes = useItemStyles();
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
    <ListItem button disabled={busy} classes={{ root: classes.root }}>
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
