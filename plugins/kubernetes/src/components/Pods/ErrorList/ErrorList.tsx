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
import React from 'react';

import {
  List,
  ListItem,
  ListItemText,
  Divider,
  createStyles,
  makeStyles,
  Theme,
  Paper,
  Grid,
} from '@material-ui/core';
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

interface ErrorListProps {
  podAndErrors: PodAndErrors[];
}

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
                <React.Fragment
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
                          clusterName={onlyPodWithErrors.clusterName}
                        />
                      </Grid>
                    </Grid>
                  </ListItem>
                </React.Fragment>
              );
            });
          })}
      </List>
    </Paper>
  );
};
