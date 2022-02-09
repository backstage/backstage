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

import { DateTime } from 'luxon';

import { FilterStatusType, statusTypes } from '../../apis/types';
import { ChartableStage } from '../types';

export function average(values: number[]): number {
  return !values.length
    ? 0
    : Math.round(values.reduce((prev, cur) => prev + cur, 0) / values.length);
}

export function getOrSetStage(
  stages: Map<string, ChartableStage>,
  name: string,
): ChartableStage {
  const stage = stages.get(name);
  if (stage) return stage;

  const newStage: ChartableStage = makeStage(name);
  stages.set(name, newStage);
  return newStage;
}

export function makeStage(name: string): ChartableStage {
  return {
    analysis: {
      unknown: { avg: 0, med: 0, max: 0, min: 0 },
      enqueued: { avg: 0, med: 0, max: 0, min: 0 },
      scheduled: { avg: 0, med: 0, max: 0, min: 0 },
      running: { avg: 0, med: 0, max: 0, min: 0 },
      aborted: { avg: 0, med: 0, max: 0, min: 0 },
      succeeded: { avg: 0, med: 0, max: 0, min: 0 },
      failed: { avg: 0, med: 0, max: 0, min: 0 },
      stalled: { avg: 0, med: 0, max: 0, min: 0 },
      expired: { avg: 0, med: 0, max: 0, min: 0 },
    },
    combinedAnalysis: { avg: 0, med: 0, max: 0, min: 0 },
    statusSet: new Set<FilterStatusType>(),
    name,
    values: [],
    stages: new Map(),
  };
}

export function startOfDay(date: number | Date) {
  if (typeof date === 'number') {
    return DateTime.fromMillis(date).startOf('day').toMillis();
  }
  return DateTime.fromJSDate(date).startOf('day').toMillis();
}

export function sortTriggerReasons(reasons: Array<string>): Array<string> {
  return reasons.sort((a, b) => {
    if (a === 'manual') return -1;
    else if (b === 'manual') return 1;
    else if (a === 'scm') return -1;
    else if (b === 'scm') return 1;
    else if (a === 'other') return -1;
    else if (b === 'other') return 1;
    return a.localeCompare(b);
  });
}

export function sortStatuses(statuses: Array<string>): Array<string> {
  return [
    ...statusTypes.filter(status => statuses.includes(status)),
    ...statuses
      .filter(status => !(statusTypes as Array<string>).includes(status))
      .sort((a, b) => a.localeCompare(b)),
  ];
}
