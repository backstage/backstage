/*
 * Copyright 2023 The Backstage Authors
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
import { convertTimeToLocalTimezone } from './components/FailedEntities';
import { catalogUnprocessedEntitiesPlugin } from './plugin';

describe('catalog-unprocessed-entities', () => {
  it('should export plugin', () => {
    expect(catalogUnprocessedEntitiesPlugin).toBeDefined();
  });
});

describe('components/FailedEntities/convertTimeToLocalTimezone', () => {
  it('should correctly a UTC ISO string to local time', () => {
    const utcTime = '2024-09-03T08:15:08.088Z';
    const localTime = convertTimeToLocalTimezone(utcTime);
    expect(localTime).toBe('2024-09-03 08:15:08 UTC');
  });

  it('should correctly convert a UTC Date object to local time', () => {
    const utcTime = new Date('2024-09-03T08:15:08.088Z');
    const localTime = convertTimeToLocalTimezone(utcTime);
    expect(localTime).toBe('2024-09-03 08:15:08 UTC');
  });

  it('should return "Invalid Date" for an invalid date string', () => {
    const invalidTime = 'invalid-date-string';
    const localTime = convertTimeToLocalTimezone(invalidTime);
    expect(localTime).toBe('Invalid DateTime');
  });

  it('should handle empty string input', () => {
    const emptyString = '';
    const localTime = convertTimeToLocalTimezone(emptyString);
    expect(localTime).toBe('Invalid DateTime');
  });
});
