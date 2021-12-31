/*
 * Copyright 2021 The Backstage Authors
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
import { Grid, Typography } from '@material-ui/core';
import { InfoCard } from '@backstage/core-components';
import exampleData from './example-data.json';
import hash from 'object-hash';
import { makeStyles } from '@material-ui/core/styles';
import { BackstageTheme } from '@backstage/theme';

const useStyles = makeStyles<BackstageTheme>(() => ({
  multilineText: {
    whiteSpace: 'pre-wrap',
  },
}));

export const EntityAirbrakeContent = () => {
  const classes = useStyles();

  return (
    <Grid container spacing={3} direction="column">
      {exampleData.groups.map(group => (
        <Grid item key={group.id}>
          {group.errors.map(error => (
            <InfoCard title={error.type} key={hash(error)}>
              <Typography variant="body1" className={classes.multilineText}>
                {error.message}
              </Typography>
            </InfoCard>
          ))}
        </Grid>
      ))}
    </Grid>
  );
};
