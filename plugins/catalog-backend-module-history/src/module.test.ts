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

import {
  TestDatabases,
  mockServices,
  startTestBackend,
} from '@backstage/backend-test-utils';
import { Entity } from '@backstage/catalog-model';
import catalogBackend from '@backstage/plugin-catalog-backend';
import waitFor from 'wait-for-expect';
import { createMockEntityProvider } from './__fixtures__/createMockEntityProvider';
import { catalogModuleHistory } from './module';
import { createBackendModule } from '@backstage/backend-plugin-api';
import { historyConsumersExtensionPoint } from './extensions';
import { EventSendingHistoryConsumer } from './consumers/EventSendingHistoryConsumer';
import {
  eventsServiceFactory,
  eventsServiceRef,
} from '@backstage/plugin-events-node';

jest.setTimeout(60_000);

describe('module', () => {
  const databases = TestDatabases.create();

  it.each(databases.eachSupportedId())('integrates, %p', async databaseId => {
    const knex = await databases.init(databaseId);
    const mockEntityProvider = createMockEntityProvider();

    const entityRef = 'component:default/foo';
    const entity: Entity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Component',
      metadata: {
        namespace: 'default',
        name: 'foo',
      },
      spec: {
        type: 'service',
        owner: 'me',
        lifecycle: 'experimental',
      },
    };

    const receivedEvents: unknown[] = [];

    const backend = await startTestBackend({
      features: [
        mockServices.database.mock({ getClient: async () => knex }).factory,
        catalogBackend,
        catalogModuleHistory,
        mockEntityProvider,
        eventsServiceFactory,
        createBackendModule({
          pluginId: 'catalog',
          moduleId: 'history-events-bridge',
          register(reg) {
            reg.registerInit({
              deps: {
                events: eventsServiceRef,
                historyConsumers: historyConsumersExtensionPoint,
              },
              async init({ events, historyConsumers }) {
                historyConsumers.addConsumer(
                  new EventSendingHistoryConsumer(events),
                );
                events.subscribe({
                  id: 'catalog-history',
                  topics: [EventSendingHistoryConsumer.EVENT_TOPIC],
                  onEvent: async ({ eventPayload }) => {
                    receivedEvents.push(eventPayload);
                  },
                });
              },
            });
          },
        }),
      ],
    });

    await mockEntityProvider.ready;

    // Expect that an insertion leads to an event
    mockEntityProvider.addEntity(entity);

    await waitFor(() => {
      expect(receivedEvents).toEqual([
        {
          id: expect.any(String),
          eventAt: expect.any(String),
          eventType: 'entity_inserted',
          entityRef: 'component:default/foo',
          entityJson: expect.stringContaining('"owner":"me"'),
        },
      ]);
    }, 20_000);

    // Expect that an update of the entity leads to an event
    entity.spec!.owner = 'you';
    mockEntityProvider.addEntity(entity);

    await waitFor(() => {
      expect(receivedEvents).toEqual([
        {
          id: expect.any(String),
          eventAt: expect.any(String),
          eventType: 'entity_inserted',
          entityRef: 'component:default/foo',
          entityJson: expect.stringContaining('"owner":"me"'),
        },
        {
          id: expect.any(String),
          eventAt: expect.any(String),
          eventType: 'entity_updated',
          entityRef: 'component:default/foo',
          entityJson: expect.stringContaining('"owner":"you"'),
        },
      ]);
    }, 20_000);

    // Expect that a deletion of the final entity leads to an event
    mockEntityProvider.removeEntity(entityRef);

    await waitFor(() => {
      expect(receivedEvents).toEqual([
        {
          id: expect.any(String),
          eventAt: expect.any(String),
          eventType: 'entity_inserted',
          entityRef: 'component:default/foo',
          entityJson: expect.stringContaining('"owner":"me"'),
        },
        {
          id: expect.any(String),
          eventAt: expect.any(String),
          eventType: 'entity_updated',
          entityRef: 'component:default/foo',
          entityJson: expect.stringContaining('"owner":"you"'),
        },
        {
          id: expect.any(String),
          eventAt: expect.any(String),
          eventType: 'entity_deleted',
          entityRef: 'component:default/foo',
          entityJson: expect.stringContaining('"owner":"you"'),
        },
      ]);
    }, 20_000);

    await backend.stop();
    await knex.destroy();
  });
});
