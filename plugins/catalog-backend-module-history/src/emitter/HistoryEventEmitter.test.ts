/*
 * Copyright 2025 The Backstage Authors
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
import waitFor from 'wait-for-expect';
import { initEmptyDatabase } from '../__fixtures__/initEmptyDatabase';
import { getHistoryConfig } from '../config';
import { sleep } from '../helpers';
import { HistoryEventEmitter } from './HistoryEventEmitter';

jest.setTimeout(60_000);

describe('HistoryEventEmitter', () => {
  const databases = TestDatabases.create();
  const logger = mockServices.logger.mock();

  it.each(databases.eachSupportedId())(
    'should emit events, %p',
    async databaseId => {
      const { knex, provider, shutdown } = await initEmptyDatabase(
        databases,
        databaseId,
      );

      const lifecycle = mockServices.lifecycle.mock();
      const events = mockServices.events.mock();

      HistoryEventEmitter.create({
        knexPromise: Promise.resolve(knex),
        lifecycle,
        logger,
        events,
        historyConfig: getHistoryConfig({
          overrides: {
            blockDuration: { seconds: 1 },
            blockPollFrequency: { milliseconds: 100 },
          },
        }),
      });

      await sleep({ seconds: 1 });

      provider.addEntity({
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          annotations: {
            'backstage.io/managed-by-location':
              'url:http://mockEntityProvider.com',
          },
          name: 'foo',
          namespace: 'default',
        },
        spec: {
          type: 'service',
          lifecycle: 'production',
          owner: 'test',
        },
      });

      await waitFor(() => {
        expect(events.publish).toHaveBeenCalledWith({
          topic: 'backstage.catalog.history.event',
          eventPayload: {
            eventId: '1',
            eventAt: expect.any(String),
            eventType: 'entity_created',
            entityRef: 'component:default/foo',
            entityId: expect.any(String),
            entity: expect.objectContaining({ kind: 'Component' }),
            locationRef: 'url:http://mockEntityProvider.com',
          },
          metadata: {
            eventType: 'entity_created',
          },
        });
      });

      await shutdown();
    },
  );
});
