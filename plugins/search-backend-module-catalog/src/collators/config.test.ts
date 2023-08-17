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

import { ConfigReader } from '@backstage/config';
import {
  defaults,
  readCollatorConfigOptions,
  readScheduleConfigOptions,
} from './config';

describe('config', () => {
  describe('readScheduleConfigOptions', () => {
    it('reads config', () => {
      const result = readScheduleConfigOptions(
        new ConfigReader({
          search: {
            collators: {
              catalog: {
                schedule: {
                  frequency: { minutes: 1 },
                  timeout: { seconds: 2 },
                  initialDelay: { hours: 3 },
                },
              },
            },
          },
        }),
      );
      expect(result).toEqual({
        frequency: { minutes: 1 },
        timeout: { seconds: 2 },
        initialDelay: { hours: 3 },
      });
    });

    it('returns defaults', () => {
      const result = readScheduleConfigOptions(new ConfigReader({}));
      expect(result).toEqual(defaults.schedule);
    });
  });

  describe('readCollatorConfigOptions', () => {
    it('reads config', () => {
      const result = readCollatorConfigOptions(
        new ConfigReader({
          search: {
            collators: {
              catalog: {
                batchSize: 1,
                locationTemplate: '/mock/:namespace/:kind/:name',
                filter: { a: 1 },
              },
            },
          },
        }),
      );
      expect(result).toEqual({
        batchSize: 1,
        locationTemplate: '/mock/:namespace/:kind/:name',
        filter: { a: 1 },
      });
    });

    it('returns defaults', () => {
      const result = readCollatorConfigOptions(new ConfigReader({}));
      expect(result).toEqual(defaults.collatorOptions);
    });
  });
});
