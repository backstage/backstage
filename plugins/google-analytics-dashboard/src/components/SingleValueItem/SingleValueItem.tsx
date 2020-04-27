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
import { Typography, Grid, makeStyles } from '@material-ui/core';
import { Alert, Skeleton } from '@material-ui/lab';
import api from 'api';
import { useAsync } from 'react-use';
import { Context } from 'contexts/Context';

const useStyles = makeStyles(theme => ({
  white: {
    fontWeight: 300,
    fontSize: 75,
    color: '#4285f4',
  },
  foo: {
    background: theme.palette.background.default,
  },
}));

type Item = {
  title: string;
  metric: string;
};

type Props = {
  item: Item;
};

const SingleValueItem: FC<Props> = ({ item }) => {
  const classes = useStyles();
  const { title, metric } = item;
  const { view, timeRange } = useContext(Context);
  const { value, loading, error } = useAsync(async () => {
    const query = {
      ids: `ga:${view.id}`,
      'start-date': timeRange['start-date'],
      'end-date': timeRange['end-date'],
      metrics: metric,
    };
    // await new Promise(resolve =>
    //   setTimeout(resolve, Math.floor(Math.random() * 10000) + 1000),
    // );
    return await api.getGaData(query);
  }, [view, timeRange]);

  if (loading) {
    return (
      <Grid item>
        <Skeleton variant="text" />
        <Skeleton variant="rect" width={185} height={90} />
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

  const result = value!.result.totalsForAllResults[metric];
  return (
    <Grid item>
      <Typography>{title}</Typography>
      <Typography variant="h2" className={classes.white}>
        {Number(result).toLocaleString(undefined, { maximumFractionDigits: 1 })}
      </Typography>
    </Grid>
  );
};

export default SingleValueItem;
