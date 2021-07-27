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
import { Grid, makeStyles, Typography, useTheme } from '@material-ui/core';
import React from 'react';
import { Progress } from '@backstage/core-components';
import { TrendComponent } from '../TrendComponent';
import { Alert, AlertTitle } from '@material-ui/lab';
import { BuildCount, BuildTime, xcmetricsApiRef } from '../../api';
import { useAsync } from 'react-use';
import { useApi } from '@backstage/core-plugin-api';
import { DataValueGridItem } from '../DataValueComponent';
import { formatDuration, formatPercentage } from '../../utils';
import { BackstageTheme } from '@backstage/theme';

const getErrorRatios = (buildCounts?: BuildCount[]) => {
  if (!buildCounts?.length) {
    return undefined;
  }

  return buildCounts.map(counts =>
    counts.builds === 0 ? 0 : counts.errors / counts.builds,
  );
};

const getBuildCounts = (buildCounts?: BuildCount[]) => {
  if (!buildCounts?.length) {
    return undefined;
  }

  return buildCounts.map(counts => counts.builds);
};

const getBuildDurationsP50 = (buildTimes?: BuildTime[]) => {
  if (!buildTimes?.length) {
    return undefined;
  }

  return buildTimes.map(times => times.durationP50);
};

const getAverageDuration = (
  buildTimes: BuildTime[] | undefined,
  accessor: (b: BuildTime) => number,
) => {
  if (!buildTimes?.length) {
    return undefined;
  }

  return formatDuration(
    buildTimes.reduce((sum, current) => sum + accessor(current), 0) /
      buildTimes.length,
  );
};

const getTotalBuildDuration = (buildTimes?: BuildTime[]) => {
  if (!buildTimes?.length) {
    return undefined;
  }

  return formatDuration(
    buildTimes.reduce((sum, current) => sum + current.totalDuration, 0),
  );
};

const useStyles = makeStyles({
  spacingTop: {
    marginTop: 8,
  },
  spacingVertical: {
    marginTop: 8,
    marginBottom: 8,
  },
});

export const OverviewTrendsComponent = ({ days }: { days: number }) => {
  const theme = useTheme<BackstageTheme>();
  const classes = useStyles();
  const client = useApi(xcmetricsApiRef);
  const buildCountsResult = useAsync(
    async () => client.getBuildCounts(days),
    [],
  );
  const buildTimesResult = useAsync(async () => client.getBuildTimes(days), []);

  if (buildCountsResult.loading && buildTimesResult.loading) {
    return <Progress />;
  }

  const sumBuilds = buildCountsResult.value?.reduce(
    (sum, current) => sum + current.builds,
    0,
  );

  const sumErrors = buildCountsResult.value?.reduce(
    (sum, current) => sum + current.errors,
    0,
  );

  const errorRate = sumBuilds && sumErrors ? sumErrors / sumBuilds : undefined;

  const averageBuildDurationP50 = getAverageDuration(
    buildTimesResult.value,
    b => b.durationP50,
  );
  const averageBuildDurationP95 = getAverageDuration(
    buildTimesResult.value,
    b => b.durationP95,
  );
  const totalBuildTime = getTotalBuildDuration(buildTimesResult.value);

  return (
    <>
      <Typography variant="h6">Last {days} Days</Typography>
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
        <>
          <TrendComponent
            title="Build Time"
            color={theme.palette.secondary.main}
            data={getBuildDurationsP50(buildTimesResult.value)}
          />
          <TrendComponent
            title="Error Rate"
            color={theme.palette.status.warning}
            data={getErrorRatios(buildCountsResult.value)}
          />
          <TrendComponent
            title="Build Count"
            color={theme.palette.primary.main}
            data={getBuildCounts(buildCountsResult.value)}
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
              value={totalBuildTime}
            />
          </Grid>
        </>
      )}
    </>
  );
};
