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
import { Grid, makeStyles, useTheme } from '@material-ui/core';
import React, { useState } from 'react';
import { Progress, Select } from '@backstage/core-components';
import { TrendComponent } from '../TrendComponent';
import { Alert, AlertTitle } from '@material-ui/lab';
import { xcmetricsApiRef } from '../../api';
import { useAsync } from 'react-use';
import { useApi } from '@backstage/core-plugin-api';
import { DataValueGridItem } from '../DataValueComponent';
import {
  formatDuration,
  formatPercentage,
  getAverageDuration,
  getErrorRatios,
  getValues,
  sumField,
} from '../../utils';
import { BackstageTheme } from '@backstage/theme';

const useStyles = makeStyles({
  spacingTop: {
    marginTop: 8,
  },
  spacingVertical: {
    marginTop: 8,
    marginBottom: 8,
  },
});

const DAYS_SELECT_ITEMS = [
  { label: '7 days', value: 7 },
  { label: '14 days', value: 14 },
  { label: '30 days', value: 30 },
  { label: '60 days', value: 60 },
];

export const OverviewTrendsComponent = () => {
  const [days, setDays] = useState(14);
  const theme = useTheme<BackstageTheme>();
  const classes = useStyles();
  const client = useApi(xcmetricsApiRef);
  const buildCountsResult = useAsync(
    async () => client.getBuildCounts(days),
    [days],
  );
  const buildTimesResult = useAsync(
    async () => client.getBuildTimes(days),
    [days],
  );

  if (buildCountsResult.loading && buildTimesResult.loading) {
    return <Progress />;
  }

  const sumBuilds = sumField(b => b.builds, buildCountsResult.value);
  const sumErrors = sumField(b => b.errors, buildCountsResult.value);
  const errorRate = sumBuilds && sumErrors ? sumErrors / sumBuilds : undefined;

  const averageBuildDurationP50 = getAverageDuration(
    buildTimesResult.value,
    b => b.durationP50,
  );
  const averageBuildDurationP95 = getAverageDuration(
    buildTimesResult.value,
    b => b.durationP95,
  );
  const totalBuildTime = sumField(t => t.totalDuration, buildTimesResult.value);

  return (
    <>
      <Select
        selected={days}
        items={DAYS_SELECT_ITEMS}
        label="Trends for"
        onChange={selection => setDays(selection as number)}
      />
      {buildCountsResult.error && (
        <Alert severity="error" className={classes.spacingVertical}>
          <AlertTitle>Failed to fetch build counts</AlertTitle>
          {buildCountsResult?.error?.message}
        </Alert>
      )}
      {buildTimesResult.error && (
        <Alert severity="error" className={classes.spacingVertical}>
          <AlertTitle>Failed to fetch build times</AlertTitle>
          {buildTimesResult?.error?.message}
        </Alert>
      )}
      {(!buildCountsResult.error || !buildTimesResult.error) && (
        <div className={classes.spacingVertical}>
          <TrendComponent
            title="Build Time"
            color={theme.palette.secondary.main}
            data={getValues(e => e.durationP50, buildTimesResult.value)}
          />
          <TrendComponent
            title="Error Rate"
            color={theme.palette.status.warning}
            data={getErrorRatios(buildCountsResult.value)}
          />
          <TrendComponent
            title="Build Count"
            color={theme.palette.primary.main}
            data={getValues(e => e.builds, buildCountsResult.value)}
          />
          <Grid
            container
            spacing={3}
            direction="row"
            className={classes.spacingTop}
          >
            <DataValueGridItem field="Build Count" value={sumBuilds} />
            <DataValueGridItem field="Error Count" value={sumErrors} />
            <DataValueGridItem
              field="Error Rate"
              value={errorRate && formatPercentage(errorRate)}
            />
            <DataValueGridItem
              field="Avg. Build Time (P50)"
              value={averageBuildDurationP50}
            />
            <DataValueGridItem
              field="Avg. Build Time (P95)"
              value={averageBuildDurationP95}
            />
            <DataValueGridItem
              field="Total Build Time"
              value={totalBuildTime && formatDuration(totalBuildTime)}
            />
          </Grid>
        </div>
      )}
    </>
  );
};
