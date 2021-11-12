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

import { getDurationFromDates } from './getDurationFromDates';

describe('getDurationFromDates', () => {
  beforeAll(() => {
    jest.useFakeTimers('modern');
    jest.setSystemTime(new Date('2021-10-15T09:45:25.0000000Z'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe('getDurationFromDates with valid startTime and valid finishTime', () => {
    it('should return empty result', () => {
      const startTime = '2021-10-15T09:30:00.0000000Z';
      const finishTime = '2021-10-15T11:00:00.0000000Z';

      const result = getDurationFromDates(startTime, finishTime);

      expect(result).toEqual('1h, 30m');
    });
  });

  describe('getDurationFromDates with valid startTime and undefined finishTime', () => {
    it('should return empty result', () => {
      const startTime = '2021-10-15T09:30:00.0000000Z';

      const result = getDurationFromDates(startTime, undefined);

      expect(result).toEqual('15m, 25s');
    });
  });

  describe('getDurationFromDates with undefined startTime and valid finishTime', () => {
    it('should return empty result', () => {
      const finishTime = '2021-10-15T11:00:00.0000000Z';

      const result = getDurationFromDates(undefined, finishTime);

      expect(result).toEqual('');
    });
  });

  describe('getDurationFromDates with undefined startTime and undefined finishTime', () => {
    it('should return empty result', () => {
      const result = getDurationFromDates(undefined, undefined);

      expect(result).toEqual('');
    });
  });
});
