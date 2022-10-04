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
import { StatusError, StatusOK } from '@backstage/core-components';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import React from 'react';
import {
  DEGRADED,
  MAJOR_OUTAGE,
  OPERATIONAL,
  PARTIAL_OUTAGE,
  StatusPage,
  UNDER_MAINTENANCE,
} from '../../types';

const useStyles = makeStyles({
  denseListIcon: {
    marginRight: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export const statusPageStatusLabels = {
  [OPERATIONAL]: 'Operational',
  [UNDER_MAINTENANCE]: 'Under maintenance',
  [DEGRADED]: 'Degraded',
  [PARTIAL_OUTAGE]: 'Partial outage',
  [MAJOR_OUTAGE]: 'Major outage',
} as Record<string, string>;

export const StatusPageStatus = ({
  statusPage,
}: {
  statusPage: StatusPage;
}) => {
  const classes = useStyles();

  return (
    <Tooltip title={statusPage.status} placement="top">
      <div className={classes.denseListIcon}>
        {statusPage.status === 'OPERATIONAL' ? <StatusError /> : <StatusOK />}
      </div>
    </Tooltip>
  );
};
