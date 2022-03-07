/*
 * Copyright 2022 The Backstage Authors
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

import { groupBy, countBy } from 'lodash';

import { Build } from '../../apis/types';
import {
  Epoch,
  TriggerReasonsDatapoint,
  StatusesDatapoint,
  ChartableDaily,
} from '../types';
import { sortStatuses, sortTriggerReasons, startOfDay } from './utils';

export function dailySummary(builds: ReadonlyArray<Build>): ChartableDaily {
  const triggersDaily = countTriggersPerDay(builds);
  const statusesDaily = countStatusesPerDay(builds);

  const { triggerReasons } = triggersDaily;
  const { statuses } = statusesDaily;

  const reasonMap = new Map(
    triggersDaily.values.map(value => [value.__epoch, value]),
  );
  const statusMap = new Map(
    statusesDaily.values.map(value => [value.__epoch, value]),
  );

  const days = Object.keys(
    groupBy(builds, value => startOfDay(value.requestedAt)),
  )
    .map(epoch => parseInt(epoch, 10))
    .sort();

  return {
    values: days.map(epoch => ({
      __epoch: epoch,
      ...reasonMap.get(epoch),
      ...statusMap.get(epoch),
    })),
    triggerReasons,
    statuses,
  };
}

function countTriggersPerDay(builds: ReadonlyArray<Build>) {
  const days = groupBy(builds, value => startOfDay(value.requestedAt));

  const triggerReasons = sortTriggerReasons([
    ...new Set(
      builds
        .map(({ triggeredBy }) => triggeredBy)
        .filter((v): v is NonNullable<typeof v> => !!v),
    ),
  ]);

  const values = Object.entries(days).map(([epoch, buildsThisDay]) => {
    const datapoint = Object.fromEntries(
      triggerReasons
        .map(reason => [
          reason,
          buildsThisDay.filter(build => build.triggeredBy === reason).length,
        ])
        .filter(([_type, count]) => count > 0),
    ) as Omit<TriggerReasonsDatapoint, '__epoch'>;

    // Assign the count for this day to the first value this day
    const value: Epoch & TriggerReasonsDatapoint = Object.assign(datapoint, {
      __epoch: parseInt(epoch, 10),
    });

    return value;
  });

  return { triggerReasons, values };
}

function countStatusesPerDay(builds: ReadonlyArray<Build>) {
  const days = groupBy(builds, value => startOfDay(value.requestedAt));

  const foundStatuses = new Set<string>();

  const values = Object.entries(days).map(([epoch, buildsThisDay]) => {
    const byStatus = countBy(buildsThisDay, 'status');

    const value: Epoch & StatusesDatapoint = {
      __epoch: parseInt(epoch, 10),
      ...byStatus,
    };

    Object.keys(byStatus).forEach(status => {
      foundStatuses.add(status);
    });

    return value;
  });

  return {
    statuses: sortStatuses([...foundStatuses]),
    values,
  };
}
