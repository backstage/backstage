/*
 * Copyright 2020 Spotify AB
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

import React, { FC, useContext } from 'react';
import { Typography, Grid } from '@material-ui/core';
import { Alert, Skeleton } from '@material-ui/lab';
import api from 'api';
import { useAsync } from 'react-use';
import { Sparklines, SparklinesBars, SparklinesLine } from 'react-sparklines';
import { Context } from 'contexts/Context';

const UserTrend: FC<{}> = () => {
  const { view, timeRange } = useContext(Context);

  const { value, loading, error } = useAsync(async () => {
    const query = {
      ids: `ga:${view.id}`,
      'start-date': timeRange['start-date'],
      'end-date': timeRange['end-date'],
      metrics: 'ga:30dayUsers',
      dimensions: 'ga:day',
    };
    return await api.getGaData(query);
  }, [view, timeRange]);

  if (loading) {
    return (
      <Grid item>
        <Skeleton variant="text" />
        <Skeleton variant="rect" height={90} />
      </Grid>
    );
  }

  if (error) {
    return (
      <Grid item>
        <Alert severity="error">{error.message}</Alert>
      </Grid>
    );
  }

  const data = value.result.rows.map((row: any) => row[1]);

  return (
    <Grid item>
      <Typography>User Trend</Typography>
      <Sparklines data={data}>
        <SparklinesBars
          style={{ stroke: 'white', fill: '#41c3f9', fillOpacity: 0.25 }}
        />
        <SparklinesLine style={{ stroke: '#41c3f9', fill: 'none' }} />
      </Sparklines>
    </Grid>
  );
};

export default UserTrend;
