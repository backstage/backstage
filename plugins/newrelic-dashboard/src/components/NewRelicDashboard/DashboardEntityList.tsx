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
import { Box, Grid, makeStyles, Typography } from '@material-ui/core';
import { newRelicDashboardApiRef } from '../../api';
import { useApi } from '@backstage/core-plugin-api';
import { useAsync } from 'react-use';
import { Progress, InfoCard, Link } from '@backstage/core-components';

import Alert from '@material-ui/lab/Alert';

import DesktopMac from '@material-ui/icons/DesktopMac';
import { useNewRelicDashboardEntity } from '../../hooks';

const useStyles = makeStyles({
  svgIcon: {
    display: 'inline-block',
    '& svg': {
      display: 'inline-block',
      fontSize: 'inherit',
      verticalAlign: 'baseline',
    },
  },
});
export const DashboardEntityList = () => {
  const DashboardEntity = useNewRelicDashboardEntity();
  const classes = useStyles();
  const NewRelicDashboardAPI = useApi(newRelicDashboardApiRef);
  const { value, loading, error } = useAsync(async (): Promise<any> => {
    const dashboardObject: any = NewRelicDashboardAPI.getDashboardEntity(
      String(DashboardEntity?.integrationKey),
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
    <Grid container spacing={3} direction="column">
      <Grid item xs={12}>
        <InfoCard title="New Relic Dashboard Pages" variant="gridItem">
          {value?.getDashboardEntity === undefined &&
            'Unauthorized Request , please check API Key'}
          {value?.getDashboardEntity?.data.actor.entitySearch.results.entities
            .length <= 0 && (
            <>No Dashboard Pages found with the specified Dashboard GUID</>
          )}
          {value?.getDashboardEntity?.data.actor.entitySearch.results.entities?.map(
            (entity: any) => {
              return (
                <Box style={{ margin: '10px' }} display="flex">
                  <Box mr={1} className={classes.svgIcon}>
                    <Typography component="div">
                      <DesktopMac />
                    </Typography>
                  </Box>
                  <Box flexGrow="1">
                    <Link to={entity.permalink} target="_blank" rel="noopener">
                      {entity.name}
                    </Link>
                  </Box>
                </Box>
              );
            },
          )}
        </InfoCard>
      </Grid>
    </Grid>
  );
};
