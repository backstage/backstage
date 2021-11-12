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

import { DateTime, Interval } from 'luxon';
import humanizeDuration from 'humanize-duration';

export const getDurationFromDates = (
  startTime?: string,
  finishTime?: string,
): string => {
  if (!startTime || (!startTime && !finishTime)) {
    return '';
  }

  const start = DateTime.fromISO(startTime);
  const finish = finishTime ? DateTime.fromISO(finishTime) : DateTime.now();

  const formatted = Interval.fromDateTimes(start, finish)
    .toDuration()
    .valueOf();

  const shortEnglishHumanizer = humanizeDuration.humanizer({
    language: 'shortEn',
    languages: {
      shortEn: {
        y: () => 'y',
        mo: () => 'mo',
        w: () => 'w',
        d: () => 'd',
        h: () => 'h',
        m: () => 'm',
        s: () => 's',
        ms: () => 'ms',
      },
    },
  });

  return shortEnglishHumanizer(formatted, {
    largest: 2,
    round: true,
    spacer: '',
  });
};
