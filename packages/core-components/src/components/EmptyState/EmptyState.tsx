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

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { EmptyStateImage } from './EmptyStateImage';

export type EmptyStateClassKey = 'root' | 'action' | 'imageContainer';

const useStyles = makeStyles(
  theme => ({
    root: {
      backgroundColor: theme.palette.background.default,
      padding: theme.spacing(2, 0, 0, 0),
    },
    action: {
      marginTop: theme.spacing(2),
    },
    imageContainer: {
      position: 'relative',
    },
  }),
  { name: 'BackstageEmptyState' },
);

type Props = {
  title: string;
  description?: string | JSX.Element;
  missing: 'field' | 'info' | 'content' | 'data';
  action?: JSX.Element;
};

export function EmptyState(props: Props) {
  const { title, description, missing, action } = props;
  const classes = useStyles();
  return (
    <Grid
      container
      direction="row"
      justifyContent="space-around"
      alignItems="flex-start"
      className={classes.root}
      spacing={2}
    >
      <Grid item xs={12} md={6}>
        <Grid container direction="column">
          <Grid item xs>
            <Typography variant="h5">{title}</Typography>
          </Grid>
          <Grid item xs>
            <Typography variant="body1">{description}</Typography>
          </Grid>
          <Grid item xs className={classes.action}>
            {action}
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} md={6} className={classes.imageContainer}>
        <EmptyStateImage missing={missing} />
      </Grid>
    </Grid>
  );
}
