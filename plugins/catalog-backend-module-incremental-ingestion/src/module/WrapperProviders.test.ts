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

import { SchedulerService } from '@backstage/backend-plugin-api';
import { TestDatabases, mockServices } from '@backstage/backend-test-utils';
import { ConfigReader } from '@backstage/config';
import { IncrementalEntityProvider } from '../types';
import { WrapperProviders } from './WrapperProviders';

jest.setTimeout(60_000);

describe('WrapperProviders', () => {
  const applyDatabaseMigrations = jest.fn();
  const databases = TestDatabases.create({
    ids: ['POSTGRES_17', 'POSTGRES_13', 'SQLITE_3', 'MYSQL_8'],
  });
  const config = new ConfigReader({});
  const logger = mockServices.logger.mock();
  const scheduler = {
    scheduleTask: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it.each(databases.eachSupportedId())(
    'should initialize the providers in order, %p',
    async databaseId => {
      const client = await databases.init(databaseId);

      const provider1: IncrementalEntityProvider<number, {}> = {
        getProviderName: () => 'provider1',
        around: burst => burst(0),
        next: async (_context, cursor) => {
          return !cursor
            ? { done: false, entities: [], cursor: 1 }
            : { done: true };
        },
      };

      const provider2: IncrementalEntityProvider<number, {}> = {
        getProviderName: () => 'provider2',
        around: burst => burst(0),
        next: async (_context, cursor) => {
          return !cursor
            ? { done: false, entities: [], cursor: 1 }
            : { done: true };
        },
      };

      const providers = new WrapperProviders({
        config,
        logger,
        client,
        scheduler: scheduler as Partial<SchedulerService> as SchedulerService,
        applyDatabaseMigrations,
        events: mockServices.events.mock(),
      });
      const wrapped1 = providers.wrap(provider1, {
        burstInterval: { seconds: 1 },
        burstLength: { seconds: 1 },
        restLength: { seconds: 1 },
      });
      const wrapped2 = providers.wrap(provider2, {
        burstInterval: { seconds: 1 },
        burstLength: { seconds: 1 },
        restLength: { seconds: 1 },
      });

      let resolved = false;
      (providers as any).readySignal.then(() => {
        resolved = true;
      });

      expect(applyDatabaseMigrations).toHaveBeenCalledTimes(0);
      expect(resolved).toBe(false);
      expect(scheduler.scheduleTask).not.toHaveBeenCalled();

      await wrapped1.connect({} as any); // simulates the catalog engine

      expect(resolved).toBe(false);
      expect(applyDatabaseMigrations).toHaveBeenCalledTimes(1);
      expect(scheduler.scheduleTask).toHaveBeenLastCalledWith(
        expect.objectContaining({
          id: 'provider1',
        }),
      );

      await wrapped2.connect({} as any);

      expect(resolved).toBe(true);
      expect(applyDatabaseMigrations).toHaveBeenCalledTimes(1);
      expect(scheduler.scheduleTask).toHaveBeenLastCalledWith(
        expect.objectContaining({
          id: 'provider2',
        }),
      );
    },
  );
});
