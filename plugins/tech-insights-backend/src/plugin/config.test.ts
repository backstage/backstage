/*
 * Copyright 2024 The Backstage Authors
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
import { FactRetriever, TTL } from '@backstage/plugin-tech-insights-node';
import { createFactRetrieverRegistrationFromConfig } from './config';

describe('config', () => {
  const mockFactRetriever = jest.fn() as unknown as FactRetriever;

  describe('createFactRetrieverRegistrationFromConfig', () => {
    it('no config return undefined', () => {
      const config = new ConfigReader({});
      const registration = createFactRetrieverRegistrationFromConfig(
        config,
        'any',
        mockFactRetriever,
      );

      expect(registration).toBeUndefined();
    });

    it('no entry for fact retriever return undefined', () => {
      const config = new ConfigReader({
        techInsights: {
          factRetrievers: {},
        },
      });
      const registration = createFactRetrieverRegistrationFromConfig(
        config,
        'any',
        mockFactRetriever,
      );

      expect(registration).toBeUndefined();
    });

    it('with config for fact retriever return registration', () => {
      const config = new ConfigReader({
        techInsights: {
          factRetrievers: {
            any: {
              cadence: '*/15 * * * *',
              lifecycle: { timeToLive: { weeks: 2 } },
            },
          },
        },
      });

      const registration = createFactRetrieverRegistrationFromConfig(
        config,
        'any',
        mockFactRetriever,
      );

      expect(registration).toBeDefined();
      expect(registration!.cadence).toEqual('*/15 * * * *');
      expect((registration!.lifecycle! as TTL).timeToLive).toEqual({
        weeks: 2,
      });
    });
  });
});
