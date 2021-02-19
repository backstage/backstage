/*
 * Copyright 2021 Spotify AB
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

import { Entity } from '@backstage/catalog-model';
import { CodeSnippet, Progress, useApi } from '@backstage/core';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import React from 'react';
import { useAsync } from 'react-use';
import { badgesClientApiRef } from '../BadgesClientApi';

type Props = {
  open: boolean;
  onClose: () => any;
  entity: Entity;
};

const useStyles = makeStyles(theme => ({
  codeBlock: {
    '& code': {
      whiteSpace: 'pre-wrap',
    },
  },
}));

export const EntityBadgesDialog = ({ open, onClose, entity }: Props) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const badgesClientApi = useApi(badgesClientApiRef);
  const classes = useStyles();

  const { value: badges, loading, error } = useAsync(async () => {
    const context = await badgesClientApi.getDefaultContext(entity);
    return await badgesClientApi.getDefinedBadges('entity', context);
  });

  const content = (badges || []).map(
    ({ id, title, description, url, target, markdown }) => (
      <div key={id}>
        <DialogContentText>
          {title || description}
          <br />
          <img alt={description} src={url} />
        </DialogContentText>
        <Typography component="div" className={classes.codeBlock}>
          Copy the following snippet of markdown code for the badge:
          <CodeSnippet text={markdown} showCopyCodeButton />
        </Typography>
        <hr />
      </div>
    ),
  );

  return (
    <Dialog fullScreen={fullScreen} open={open} onClose={onClose}>
      <DialogTitle id="badges-dialog-title">Entity Badges</DialogTitle>

      <DialogContent>
        {loading ? <Progress /> : null}

        {error ? (
          <Alert severity="error" style={{ wordBreak: 'break-word' }}>
            {error.toString()}
          </Alert>
        ) : null}

        {content}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
