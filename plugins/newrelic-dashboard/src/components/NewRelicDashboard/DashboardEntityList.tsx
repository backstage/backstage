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
import { Box, makeStyles, Typography } from '@material-ui/core';
import { newRelicDashboardApiRef } from '../../api';
import { useApi } from '@backstage/core-plugin-api';
import useAsync from 'react-use/lib/useAsync';
import {
  Progress,
  InfoCard,
  Link,
  ErrorPanel,
} from '@backstage/core-components';
import DesktopMac from '@material-ui/icons/DesktopMac';
import { DashboardEntitySummary } from '../../api/NewRelicDashboardApi';
import { ResultEntity } from '../../types/DashboardEntity';
import { useEntity } from '@backstage/plugin-catalog-react';
import { NEWRELIC_GUID_ANNOTATION } from './../../constants';

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
  const { entity } = useEntity();
  const classes = useStyles();
  const newRelicDashboardAPI = useApi(newRelicDashboardApiRef);
  const { value, loading, error } = useAsync(async (): Promise<
    DashboardEntitySummary | undefined
  > => {
    const dashboardObject: Promise<DashboardEntitySummary | undefined> =
      newRelicDashboardAPI.getDashboardEntity(
        String(entity.metadata.annotations?.[NEWRELIC_GUID_ANNOTATION]),
      );
    return dashboardObject;
  }, [entity.metadata.annotations?.[NEWRELIC_GUID_ANNOTATION]]);
  if (loading) {
    return <Progress />;
  }
  if (error) {
    return <ErrorPanel title={error.name} defaultExpanded error={error} />;
  }
  return (
    <InfoCard title="New Relic Dashboard Pages" variant="gridItem">
      {value?.getDashboardEntity === undefined &&
        'Unauthorized Request , please check API Key'}
      {value?.getDashboardEntity !== undefined &&
        value?.getDashboardEntity?.data.actor.entitySearch.results?.entities
          ?.length <= 0 && (
          <>No Dashboard Pages found with the specified Dashboard GUID</>
        )}
      {value?.getDashboardEntity?.data.actor.entitySearch.results.entities?.map(
        (entityResult: ResultEntity) => {
          return (
            <Box style={{ margin: '10px' }} display="flex">
              <Box mr={1} className={classes.svgIcon}>
                <Typography component="div">
                  <DesktopMac />
                </Typography>
              </Box>
              <Box flexGrow="1">
                <Link to={entityResult.permalink}>{entityResult.name}</Link>
              </Box>
            </Box>
          );
        },
      )}
    </InfoCard>
  );
};
