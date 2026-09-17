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

import { humanizeCron } from './crons';

describe('crons', () => {
  describe('humanizeCron', () => {
    it('should handle kubernetes aliases', () => {
      expect(humanizeCron('@yearly')).toBe(
        'At 12:00 AM, on day 1 of the month, only in January',
      );
      expect(humanizeCron('@annually')).toBe(
        'At 12:00 AM, on day 1 of the month, only in January',
      );
      expect(humanizeCron('@monthly')).toBe(
        'At 12:00 AM, on day 1 of the month',
      );
      expect(humanizeCron('@weekly')).toBe('At 12:00 AM, only on Sunday');
      expect(humanizeCron('@daily')).toBe('At 12:00 AM');
      expect(humanizeCron('@midnight')).toBe('At 12:00 AM');
      expect(humanizeCron('@hourly')).toBe('Every hour');
    });

    it('should handle regular crons', () => {
      expect(humanizeCron('0 23 * * *')).toBe('At 11:00 PM');
      expect(humanizeCron('0 0 13 * 5')).toBe(
        'At 12:00 AM, on day 13 of the month, and on Friday',
      );
    });

    it('should handle empty strings', () => {
      expect(humanizeCron('')).toBe('');
    });

    it('should return the original schedule rather than throwing an error', () => {
      expect(humanizeCron('@invalid')).toBe('@invalid');
    });
  });
});
