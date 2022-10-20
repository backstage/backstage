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

const OperationalChip = withStyles({
  root: {
    backgroundColor: '#388E3D',
    color: 'white',
    margin: 0,
  },
})(Chip);

const UnderMaintenanceChip = withStyles({
  root: {
    backgroundColor: '#616161',
    color: 'white',
    margin: 0,
  },
})(Chip);
const DegradedChip = withStyles({
  root: {
    backgroundColor: '#FBC02D',
    color: 'white',
    margin: 0,
  },
})(Chip);
const PartialOutageChip = withStyles({
  root: {
    backgroundColor: '#F57C02',
    color: 'white',
    margin: 0,
  },
})(Chip);
const MajorOutageChip = withStyles({
  root: {
    backgroundColor: '#D22F2E',
    color: 'white',
    margin: 0,
  },
})(Chip);

const serviceStatusLabels = {
  [OPERATIONAL]: 'Operational',
  [UNDER_MAINTENANCE]: 'Under maintenance',
  [DEGRADED]: 'Degraded',
  [PARTIAL_OUTAGE]: 'Partial outage',
  [MAJOR_OUTAGE]: 'Major outage',
} as Record<string, string>;

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
