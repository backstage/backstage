/*
 * Copyright 2026 The Backstage Authors
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

import { getTimes } from './clocks';

describe('getTimes', () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date('2026-06-15T12:00:00.000Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns time objects for each configured clock', () => {
    const result = getTimes([
      { label: 'NYC', timeZone: 'America/New_York' },
      { label: 'UTC', timeZone: 'UTC' },
    ]);

    expect(result).toHaveLength(2);
    expect(result[0].label).toBe('NYC');
    expect(result[1].label).toBe('UTC');
    expect(result[0].value).toBeDefined();
    expect(result[0].dateTime).toBeDefined();
  });

  it('returns an empty array when no configs are provided', () => {
    expect(getTimes([])).toEqual([]);
  });

  it('falls back to GMT for an invalid timezone', () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

    const result = getTimes([{ label: 'Bad Zone', timeZone: 'Invalid/Zone' }]);

    expect(result).toHaveLength(1);
    expect(result[0].label).toBe('GMT');
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('invalid'));

    consoleSpy.mockRestore();
  });

  it('applies a custom time format', () => {
    const result = getTimes([{ label: 'UTC', timeZone: 'UTC' }], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    expect(result[0].value).toBe('12:00');
  });
});
