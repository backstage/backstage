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

import { TestDatabases, mockServices } from '@backstage/backend-test-utils';
import { initEmptyDatabase } from '../../__fixtures__/initEmptyDatabase';
import {
  PostgresListenNotifyChangeEngine,
  TOPIC_PUBLISH,
} from './PostgresListenNotifyChangeEngine';

jest.setTimeout(60_000);

describe('PostgresListenNotifyChangeEngine', () => {
  const logger = mockServices.logger.mock();
  const databases = TestDatabases.create();

  it.each(databases.eachSupportedId())(
    'basic low level test, %p',
    async databaseId => {
      if (!databaseId.startsWith('POSTGRES_')) {
        return;
      }

      const { knex, shutdown } = await initEmptyDatabase(databases, databaseId);

      const store = new PostgresListenNotifyChangeEngine(knex, logger);

      const controller = new AbortController();
      const listener = await store.setupListenerInternal(
        new Set(['test']),
        controller.signal,
      );

      const notifyResult = await knex.select(
        knex.raw(`pg_notify(?, ?)`, [TOPIC_PUBLISH, 'test']),
      );
      expect(notifyResult).toMatchObject({ length: 1 });

      await expect(listener.waitForUpdate()).resolves.toMatchObject({
        topic: 'test',
      });

      await store.shutdown();
      await shutdown();
    },
  );

  it.each(databases.eachSupportedId())(
    'triggers cause notifications, %p',
    async databaseId => {
      if (!databaseId.startsWith('POSTGRES_')) {
        return;
      }

      const { knex, provider, shutdown } = await initEmptyDatabase(
        databases,
        databaseId,
      );

      const store = new PostgresListenNotifyChangeEngine(knex, logger);

      const controller = new AbortController();
      const listener = await store.setupListenerInternal(
        new Set(['history_event_created']),
        controller.signal,
      );

      provider.addEntity({
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: { name: 'test' },
        spec: {
          type: 'service',
          lifecycle: 'production',
          owner: 'test',
        },
      });

      await expect(listener.waitForUpdate()).resolves.toMatchObject({
        topic: 'history_event_created',
      });

      await store.shutdown();
      await shutdown();
    },
  );
});
