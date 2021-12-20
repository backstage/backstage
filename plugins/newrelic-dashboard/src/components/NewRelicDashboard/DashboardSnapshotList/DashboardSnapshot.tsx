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
import { Box, Grid } from '@material-ui/core';
import { useApi } from '@backstage/core-plugin-api';
import { useAsync } from 'react-use';
import { InfoCard, Progress } from '@backstage/core-components';
import { newRelicDashboardApiRef } from '../../../api';
import Alert from '@material-ui/lab/Alert';

type Props = {
  guid: String;
  name: String;
  permalink: string;
  duration: Number;
};

export const DashboardSnapshot = ({
  guid,
  name,
  permalink,
  duration,
}: Props) => {
  const newRelicDashboardAPI = useApi(newRelicDashboardApiRef);
  const { value, loading, error } = useAsync(async (): Promise<any> => {
    const dashboardObject: any = newRelicDashboardAPI.getDashboardSnapshot(
      guid,
      duration,
    );
    return dashboardObject;
  }, []);
  if (loading) {
    return <Progress />;
  }
  if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }
  return (
    <Grid container style={{ marginTop: '30px' }}>
      <InfoCard variant="gridItem" title={name}>
        <Box display="flex">
          <Box flexGrow="1">
            <a target="_blank" href={permalink}>
              <img
                alt={`${name} Dashbord`}
                style={{ border: 'solid 1px black' }}
                src={`${value?.getDashboardSnapshot?.data?.dashboardCreateSnapshotUrl?.replace(
                  /...$/,
                  'png',
                )}`}
              />
            </a>
          </Box>
        </Box>
      </InfoCard>
    </Grid>
  );
};
