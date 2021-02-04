/*
 * Copyright 2020 Spotify AB
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

import {
  isValidDate,
  isValidDateAndFormat,
  getTimeBasedGreeting,
} from './timeUtil';
import { DateTime } from 'luxon';

it('validate isValidDate', () => {
  expect(isValidDate(DateTime.local().toISO())).toBeTruthy();
  expect(isValidDate('2021-02-04 15:00:10')).toBeFalsy();
});

it('validates time format', () => {
  const valid = isValidDateAndFormat(
    '1970-01-01 00:00:00',
    'yyyy-MM-dd hh:mm:ss',
  );
  const invalid = isValidDateAndFormat(
    '1970-01-01T00:00:00',
    'yyyy-MM-ddThh:mm:ss',
  );
  expect(valid).toBeTruthy();
  expect(invalid).toBeFalsy();
});

it('has greeting and language', () => {
  const greeting = getTimeBasedGreeting();
  expect(greeting).toHaveProperty('greeting');
  expect(greeting).toHaveProperty('language');
});

it('greets late at night', () => {
  jest
    .spyOn(global.Date, 'now')
    .mockImplementationOnce(() => new Date('1970-01-01T23:00:00').valueOf());
  const greeting = getTimeBasedGreeting();
  expect(greeting.greeting).toBe('Get some rest');
});
