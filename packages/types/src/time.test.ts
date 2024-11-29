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

import { HumanDuration, durationToMilliseconds } from './time';
import { Duration } from 'luxon';

describe('time', () => {
  describe('HumanDuration', () => {
    const durations: HumanDuration[] = [
      { years: 1 },
      { months: 1 },
      { weeks: 1 },
      { days: 1 },
      { hours: 1 },
      { minutes: 1 },
      { seconds: 1 },
      { milliseconds: 1 },
    ];
    it.each(durations)('successfully parsed by luxon, %p', d => {
      expect(Duration.fromObject(d).toObject()).toEqual(d);
    });
  });

  describe('durationToMilliseconds', () => {
    it('converts a compound duration to milliseconds', () => {
      const duration: HumanDuration = {
        years: 1,
        months: 1,
        weeks: 1,
        days: 1,
        hours: 1,
        minutes: 1,
        seconds: 1,
        milliseconds: 1,
      };
      expect(durationToMilliseconds(duration)).toBe(
        ((((365 + 30 + 7 + 1) * 24 + 1) * 60 + 1) * 60 + 1) * 1000 + 1,
      );
    });

    const durations: HumanDuration[] = [
      { years: 1 },
      { months: 1 },
      { weeks: 1 },
      { days: 1 },
      { hours: 1 },
      { minutes: 1 },
      { seconds: 1 },
      { milliseconds: 1 },
    ];
    it.each(durations)('computes milliseconds like luxon does, %p', d => {
      expect(Duration.fromObject(d).as('milliseconds')).toEqual(
        durationToMilliseconds(d),
      );
    });
  });
});
