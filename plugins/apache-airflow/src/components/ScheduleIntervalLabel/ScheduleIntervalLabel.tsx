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

import Chip from '@material-ui/core/Chip';
import React from 'react';
import { ScheduleInterval, TimeDelta, RelativeDelta } from '../../api/types';

interface Props {
  interval: ScheduleInterval | undefined;
}

const timeDeltaToLabel = (delta: TimeDelta): string => {
  let label = '';
  const date = new Date(0);
  date.setSeconds(delta.seconds);
  const time = date.toISOString().substr(11, 8);
  if (delta.days === 0) {
    label = `${time}`;
  } else if (delta.days === 1) {
    label = `1 day ${time}`;
  } else {
    label = `${delta.days} days ${time}`;
  }
  return label;
};

const relativeDeltaToLabel = (delta: RelativeDelta) => {
  const params = Object.entries(delta)
    .filter(o => o[0] !== '__type' && o[1] !== null && o[1] !== 0)
    .map(o => (o[1] > 0 ? `${o[0]}=+${o[1]}` : `${o[0]}=-${o[1]}`));
  return `relativedelta(${params})`;
};

export const ScheduleIntervalLabel = ({ interval }: Props) => {
  let label = '';
  switch (interval?.__type) {
    case 'TimeDelta':
      label = timeDeltaToLabel(interval);
      break;
    case 'RelativeDelta':
      label = relativeDeltaToLabel(interval);
      break;
    case 'CronExpression':
      label = interval.value;
      break;
    default:
      label = 'None';
  }
  return <Chip label={label} size="small" />;
};
