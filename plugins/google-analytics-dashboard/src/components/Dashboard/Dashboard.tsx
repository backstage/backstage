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

import React, { FC, useState, useContext } from 'react';
import { Grid } from '@material-ui/core';
import { InfoCard, Progress } from '@backstage/core';
import { Alert } from '@material-ui/lab';
import { useAsync } from 'react-use';
import api from 'api';
import { API_KEY, CLIENT_ID } from 'api/config';
import { Context } from 'contexts/Context';
import UserTrend from 'components/UserTrend';
import PageLoad from 'components/PageLoad';
import Settings from 'components/Settings';
import Intro from 'components/Intro';
import SingleValues from 'components/SingleValues';
import BlueCard from 'components/BlueCard';

const Dashboard: FC<{}> = () => {
  const { view } = useContext(Context);
  const [isSignedIn, setIsSignedIn] = useState(false);

  const { loading, error } = useAsync(async () => {
    if (!API_KEY || !CLIENT_ID) {
      return;
    }
    await api.init();
    setIsSignedIn(api.isSignedIn());
  }, []);

  if (loading) {
    return <Progress />;
  }

  if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  if (!isSignedIn || !API_KEY || !CLIENT_ID) {
    return (
      <Grid container>
        <Grid item>
          <Intro />
        </Grid>
      </Grid>
    );
  }

  if (!view.id) {
    return (
      <Grid container>
        <Grid item>
          <Settings />
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid item container spacing={3}>
      <Grid item>
        <BlueCard title="Load">
          <PageLoad />
        </BlueCard>
      </Grid>
      <Grid item>
        <InfoCard title="Users">
          <Grid item container spacing={8}>
            <SingleValues />
          </Grid>
        </InfoCard>
      </Grid>
      <Grid item xs={3}>
        <InfoCard title="Trend">
          <UserTrend />
        </InfoCard>
      </Grid>
      <Grid item xs>
        <Settings />
      </Grid>
    </Grid>
  );
};

export default Dashboard;
