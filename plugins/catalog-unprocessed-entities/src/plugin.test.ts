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
  it('should correctly convert a UTC ISO string to the given zone', () => {
    expect(convertTimeToLocalTimezone('2026-09-03T08:15:08.088Z', 'UTC')).toBe(
      '2026-09-03 08:15:08 UTC',
    );
  });

  it('should correctly convert a UTC Date object to the given zone', () => {
    expect(
      convertTimeToLocalTimezone(new Date('2026-09-03T08:15:08.088Z'), 'UTC'),
    ).toBe('2026-09-03 08:15:08 UTC');
  });

  it('should return "Invalid DateTime" for an invalid date string', () => {
    expect(convertTimeToLocalTimezone('invalid-date-string', 'UTC')).toBe(
      'Invalid DateTime',
    );
  });

  it('should handle empty string input', () => {
    expect(convertTimeToLocalTimezone('', 'UTC')).toBe('Invalid DateTime');
  });
});
