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
import amber from '@material-ui/core/colors/amber';
import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';
import React from 'react';
import { ACCEPTED, Alert, PENDING, RESOLVED } from '../../types';

const ResolvedChip = withStyles({
  root: {
    backgroundColor: green[600],
    color: 'white',
    margin: 0,
  },
})(Chip);

const AcceptedChip = withStyles({
  root: {
    backgroundColor: amber[600],
    color: 'white',
    margin: 0,
  },
})(Chip);
const PendingChip = withStyles({
  root: {
    backgroundColor: red[700],
    color: 'white',
    margin: 0,
  },
})(Chip);

export const alertStatusLabels = {
  [RESOLVED]: 'Resolved',
  [ACCEPTED]: 'Accepted',
  [PENDING]: 'Pending',
} as Record<string, string>;

export const StatusChip = ({ alert }: { alert: Alert }) => {
  const label = `${alertStatusLabels[alert.status]}`;

  switch (alert.status) {
    case RESOLVED:
      return <ResolvedChip label={label} size="small" />;
    case ACCEPTED:
      return <AcceptedChip label={label} size="small" />;
    case PENDING:
      return <PendingChip label={label} size="small" />;
    default:
      return <Chip label={label} size="small" />;
  }
};
