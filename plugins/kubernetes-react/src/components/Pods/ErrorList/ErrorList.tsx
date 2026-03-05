/*
 * Copyright 2023 The Backstage Authors
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
import { Fragment } from 'react';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { PodAndErrors } from '../types';
import { FixDialog } from '../FixDialog/FixDialog';

const useStyles = makeStyles((_theme: Theme) =>
  createStyles({
    root: {
      overflow: 'auto',
    },
    list: {
      width: '100%',
    },
  }),
);

/**
 * Props for ErrorList
 *
 * @public
 */
export interface ErrorListProps {
  podAndErrors: PodAndErrors[];
}

/**
 * Shows a list of errors found on a Pod
 *
 * @public
 */
export const ErrorList = ({ podAndErrors }: ErrorListProps) => {
  const classes = useStyles();
  return (
    <Paper className={classes.root}>
      <List className={classes.list}>
        {podAndErrors
          .filter(pae => pae.errors.length > 0)
          .flatMap(onlyPodWithErrors => {
            return onlyPodWithErrors.errors.map((error, i) => {
              return (
                <Fragment
                  key={`${
                    onlyPodWithErrors.pod.metadata?.name ?? 'unknown'
                  }-eli-${i}`}
                >
                  {i > 0 && <Divider key={`error-divider${i}`} />}
                  <ListItem>
                    <Grid container>
                      <Grid item xs={9}>
                        <ListItemText
                          primary={error.message}
                          secondary={onlyPodWithErrors.pod.metadata?.name}
                        />
                      </Grid>
                      <Grid item xs={3}>
                        <FixDialog
                          pod={onlyPodWithErrors.pod}
                          error={error}
                          clusterName={onlyPodWithErrors.cluster.name}
                        />
                      </Grid>
                    </Grid>
                  </ListItem>
                </Fragment>
              );
            });
          })}
      </List>
    </Paper>
  );
};
