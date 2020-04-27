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
import { Typography, Grid, makeStyles, Card, Divider } from '@material-ui/core';
import { Alert, Skeleton } from '@material-ui/lab';
import api from 'api';
import { useAsync } from 'react-use';
import { Context } from 'contexts/Context';

const useStyles = makeStyles({
  divider: {
    opacity: '0.3',
  },
  card: {
    backgroundColor: '#4285f4',
  },
});

const PageLoad: FC<{}> = () => {
  const classes = useStyles();
  const { view, timeRange } = useContext(Context);

  const { value, loading, error } = useAsync(async () => {
    const query = {
      ids: `ga:${view.id}`,
      'start-date': timeRange['start-date'],
      'end-date': timeRange['end-date'],
      metrics: 'ga:avgPageLoadTime',
    };

    return await api.getGaData(query);
  }, [view, timeRange]);

  if (loading) {
    return (
      <Card className={classes.card}>
        <Typography
          variant="h5"
          style={{
            color: 'white',
            fontWeight: 700,
            padding: '16px 16px 16px 20px',
          }}
        >
          Page Load
        </Typography>
        <Grid item style={{ padding: 16 }}>
          <Skeleton variant="text" />
          <Skeleton variant="rect" width={185} height={90} />
        </Grid>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={classes.card}>
        <Typography
          variant="h5"
          style={{
            color: 'white',
            fontWeight: 700,
            padding: '16px 16px 16px 20px',
          }}
        >
          Page Load
        </Typography>
        <Grid item style={{ padding: 16 }}>
          <Alert severity="error">{error.message}</Alert>
        </Grid>
      </Card>
    );
  }

  const result = value!.result?.totalsForAllResults;

  return (
    <Card className={classes.card}>
      <Typography
        variant="h5"
        style={{
          color: 'white',
          fontWeight: 700,
          padding: '16px 16px 16px 20px',
        }}
      >
        Page Load
      </Typography>
      <Divider className={classes.divider} />
      <Grid item style={{ padding: 16 }}>
        <Typography style={{ color: 'white' }}>Page Load</Typography>
        <Typography
          style={{
            color: 'white',
            fontWeight: 300,
            fontSize: 75,
            margin: '-13px 0px 7px 0px',
          }}
        >
          {`${Number(result['ga:avgPageLoadTime']).toFixed(1)}s`}
        </Typography>
      </Grid>
    </Card>
  );
};

export default PageLoad;
