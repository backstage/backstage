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
import { Chip, withStyles } from '@material-ui/core';
import React from 'react';
import {
  DEGRADED,
  MAJOR_OUTAGE,
  OPERATIONAL,
  PARTIAL_OUTAGE,
  Service,
  UNDER_MAINTENANCE,
} from '../../types';
import { serviceStatusLabels } from '../Service/ServiceStatus';

const OperationalChip = withStyles({
  root: {
    backgroundColor: '#4caf50',
    color: 'white',
    margin: 0,
  },
})(Chip);

const UnderMaintenanceChip = withStyles({
  root: {
    backgroundColor: '#ffb74d',
    color: 'white',
    margin: 0,
  },
})(Chip);
const DegradedChip = withStyles({
  root: {
    backgroundColor: '#d32f2f',
    color: 'white',
    margin: 0,
  },
})(Chip);
const PartialOutageChip = withStyles({
  root: {
    backgroundColor: '#d4a5bb',
    color: 'white',
    margin: 0,
  },
})(Chip);
const MajorOutageChip = withStyles({
  root: {
    backgroundColor: '#28c548',
    color: 'white',
    margin: 0,
  },
})(Chip);

export const StatusChip = ({ service }: { service: Service }) => {
  const label = `${serviceStatusLabels[service.status]}`;

  switch (service.status) {
    case OPERATIONAL:
      return <OperationalChip label={label} size="small" />;
    case UNDER_MAINTENANCE:
      return <UnderMaintenanceChip label={label} size="small" />;
    case DEGRADED:
      return <DegradedChip label={label} size="small" />;
    case PARTIAL_OUTAGE:
      return <PartialOutageChip label={label} size="small" />;
    case MAJOR_OUTAGE:
      return <MajorOutageChip label={label} size="small" />;
    default:
      return <Chip label={label} size="small" />;
  }
};
