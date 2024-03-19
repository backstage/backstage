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
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { InfoCard } from '@backstage/core-components';
import { CheckResult } from '@backstage/plugin-tech-insights-common';
import Alert from '@material-ui/lab/Alert';
import { ScorecardsList } from '../ScorecardsList';

const useStyles = makeStyles(theme => ({
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
  noWarning?: boolean;
}) => {
  const { checkResults, title, description, noWarning } = props;
  const classes = useStyles();

  if (!checkResults.length) {
    if (noWarning) {
      return infoCard(
        title,
        description,
        classes.subheader,
        <Alert severity="info">
          All checks passed, or no checks have been performed yet
        </Alert>,
      );
    }
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
