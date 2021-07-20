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
import { Grid, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import { Progress, TrendLine } from '@backstage/core-components';
import { ErrorTrendComponent } from '../ErrorTrendComponent';
import { Alert } from '@material-ui/lab';
import { BuildCount, xcmetricsApiRef } from '../../api';
import { useAsync } from 'react-use';
import { useApi } from '@backstage/core-plugin-api';
import { BuildTrendComponent } from '../BuildTrendComponent';
import { DataValueGridItem } from '../DataValueComponent';
import { formatPercentage } from '../../utils';

const useStyles = makeStyles({
  spacingTop: {
    marginTop: 8,
  },
});

export const OverviewTrendsComponent = ({ days }: { days: number }) => {
  const classes = useStyles();
  const client = useApi(xcmetricsApiRef);
  const { value: buildCounts, loading, error } = useAsync(
    async (): Promise<BuildCount[]> => client.getBuildCounts(days),
    [],
  );

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  } else if (!buildCounts || buildCounts.length === 0) {
    return (
      <>
        <Typography variant="h6">No Trends Available</Typography>
        <TrendLine data={[0, 0]} title="No data" color="#CECECE" />
      </>
    );
  }

  const sumCount = buildCounts.reduce(
    (sum, current) => sum + current.builds,
    0,
  );
  const sumErrors = buildCounts.reduce(
    (sum, current) => sum + current.errors,
    0,
  );
  const errorRate = sumCount > 0 ? sumErrors / sumCount : 0;

  return (
    <>
      <Typography variant="h6">Last {days} Days</Typography>
      <ErrorTrendComponent buildCounts={buildCounts} />
      <BuildTrendComponent buildCounts={buildCounts} />
      <Grid
        container
        spacing={3}
        direction="row"
        className={classes.spacingTop}
      >
        <DataValueGridItem field="Build Count" value={sumCount} />
        <DataValueGridItem field="Error Count" value={sumErrors} />
        <DataValueGridItem
          field="Error Rate"
          value={formatPercentage(errorRate)}
        />
      </Grid>
    </>
  );
};
