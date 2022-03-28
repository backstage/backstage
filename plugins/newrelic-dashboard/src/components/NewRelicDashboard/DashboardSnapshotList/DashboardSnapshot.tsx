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
import useAsync from 'react-use/lib/useAsync';
import {
  InfoCard,
  Progress,
  ErrorPanel,
  Link,
} from '@backstage/core-components';
import { newRelicDashboardApiRef } from '../../../api';
import { DashboardSnapshotSummary } from './../../../api/NewRelicDashboardApi';

type Props = {
  guid: string;
  name: string;
  permalink: string;
  duration: number;
};

export const DashboardSnapshot = ({
  guid,
  name,
  permalink,
  duration,
}: Props) => {
  const newRelicDashboardAPI = useApi(newRelicDashboardApiRef);
  const { value, loading, error } = useAsync(async (): Promise<
    DashboardSnapshotSummary | undefined
  > => {
    const dashboardObject: Promise<DashboardSnapshotSummary | undefined> =
      newRelicDashboardAPI.getDashboardSnapshot(guid, duration);
    return dashboardObject;
  }, [guid, duration]);
  if (loading) {
    return <Progress />;
  }
  if (error) {
    return <ErrorPanel title={error.name} defaultExpanded error={error} />;
  }
  const url =
    value?.getDashboardSnapshot?.data?.dashboardCreateSnapshotUrl?.replace(
      /\pdf$/i,
      'png',
    );
  return (
    <Grid container style={{ marginTop: '30px' }}>
      <InfoCard variant="gridItem" title={name}>
        <Box display="flex">
          <Box flexGrow="1">
            <Link to={permalink}>
              {url ? (
                <img
                  alt={`${name} Dashbord`}
                  style={{ border: 'solid 1px black' }}
                  src={url}
                />
              ) : (
                'Dashboard loading... , click here to open if it did not render correctly'
              )}
            </Link>
          </Box>
        </Box>
      </InfoCard>
    </Grid>
  );
};
