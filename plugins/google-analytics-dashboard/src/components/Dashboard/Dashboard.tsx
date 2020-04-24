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
import { Typography, Grid } from '@material-ui/core';
import { InfoCard, Progress } from '@backstage/core';
import { Alert } from '@material-ui/lab';
import { useAsync } from 'react-use';
import UserTrend from '../UserTrend';
import PageLoad from '../PageLoad';
import SingleValueItem from '../SingleValueItem';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import Settings from '../Settings';
import { Context } from 'contexts/Context';
import api from 'api';

const GetStarted: FC<{}> = () => {
  const CODE = `config.tsx:
  export const GA_ACCOUNT_ID = "your account id"
  export const GA_VIEW_ID = "your view id"
  export const API_KEY = "your api key" 
  export const CLIENT_ID = "your client id" 
  `;
  return (
    <InfoCard title="Getting Started">
      <Typography variant="body1">Configure the plugin</Typography>
      <SyntaxHighlighter language="javascript" style={docco}>
        {CODE}
      </SyntaxHighlighter>
    </InfoCard>
  );
};

const Dashboard: FC<{}> = () => {
  const { view } = useContext(Context);
  const [isSignedIn, setIsSignedIn] = useState(false);
  // const [retrigger, setRetrigger] = useState<boolean>(false);

  const { loading, error } = useAsync(async () => {
    await api.init();
    setIsSignedIn(api.isSignedIn());
  }, []);

  if (loading) {
    return <Progress />;
  }

  if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  if (!isSignedIn) {
    return (
      <Grid container>
        <Grid item>
          <GetStarted />
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

  const items = [
    {
      title: 'Total Users',
      metric: 'ga:users',
    },
    {
      title: 'New Users',
      metric: 'ga:newUsers',
    },
    {
      title: 'Session per User',
      metric: 'ga:sessionsPerUser',
    },
  ];

  return (
    <Grid item container spacing={3}>
      <Grid item>
        <PageLoad />
      </Grid>
      <Grid item>
        <InfoCard title="Users">
          <Grid item container spacing={8}>
            {items.map(item => (
              <SingleValueItem key={item.title} item={item} />
            ))}
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
