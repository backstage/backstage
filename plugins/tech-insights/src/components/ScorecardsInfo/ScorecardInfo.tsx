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
import { makeStyles, Grid, Typography } from '@material-ui/core';
import { InfoCard } from '@backstage/core-components';
import { CheckResult } from '@backstage/plugin-tech-insights-common';
import { BackstageTheme } from '@backstage/theme';
import { Alert } from '@material-ui/lab';
import { ScorecardsList } from '../ScorecardsList';

const useStyles = makeStyles((theme: BackstageTheme) => ({
  subheader: {
    fontWeight: 'bold',
    paddingLeft: theme.spacing(0.5),
  },
}));

const infoCard = (
  title: string,
  description: string | undefined,
  className: string,
  element: JSX.Element,
) => (
  <Grid item xs={12}>
    <InfoCard title={title}>
      {description && (
        <Typography className={className} variant="body1" gutterBottom>
          {description}
        </Typography>
      )}
      <Grid item xs={12}>
        {element}
      </Grid>
    </InfoCard>
  </Grid>
);

export const ScorecardInfo = (props: {
  checkResults: CheckResult[];
  title: string;
  description?: string;
}) => {
  const { checkResults, title, description } = props;
  const classes = useStyles();

  if (!checkResults.length) {
    return infoCard(
      title,
      description,
      classes.subheader,
      <Alert severity="warning">No checks have any data yet.</Alert>,
    );
  }

  return infoCard(
    title,
    description,
    classes.subheader,
    <ScorecardsList checkResults={checkResults} />,
  );
};
