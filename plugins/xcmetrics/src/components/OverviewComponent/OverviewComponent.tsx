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
import { Grid } from '@material-ui/core';
import {
  InfoCard,
  ContentHeader,
  SupportButton,
  Progress,
} from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';
import { xcmetricsApiRef } from '../../api';
import { useAsync } from 'react-use';
import { Alert } from '@material-ui/lab';

export const OverviewComponent = () => {
  const client = useApi(xcmetricsApiRef);
  const { value, loading, error } = useAsync(async (): Promise<string> => {
    return client.getBuilds();
  }, []);

  return (
    <>
      <ContentHeader title="XCMetrics Dashboard">
        <SupportButton>Dashboard for XCMetrics</SupportButton>
      </ContentHeader>
      <Grid container spacing={3} direction="row">
        <Grid item xs={7}>
          <InfoCard title="Data fetched from XCMetrics through Backstage proxy">
            {loading && <Progress />}
            {error && <Alert severity="error">{error.message}</Alert>}
            {value && <pre>{value}</pre>}
          </InfoCard>
        </Grid>
        <Grid item xs={5}>
          <InfoCard title="Placeholder Card" />
        </Grid>
      </Grid>
    </>
  );
};
