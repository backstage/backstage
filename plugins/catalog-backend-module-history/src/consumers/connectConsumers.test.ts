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
import catalogBackend from '@backstage/plugin-catalog-backend';
import waitFor from 'wait-for-expect';
import { createMockConsumer } from '../__fixtures__/createMockConsumer';
import { createMockEntityProvider } from '../__fixtures__/createMockEntityProvider';
import { catalogModuleHistory } from '../module';
import { connectConsumers } from './connectConsumers';

jest.setTimeout(60_000);

describe('connectConsumers', () => {
  const databases = TestDatabases.create();

  it.each(databases.eachSupportedId())(
    'feeds subscriptions, %p',
    async databaseId => {
      const knex = await databases.init(databaseId);
      const mockProvider = createMockEntityProvider();
      const controller = new AbortController();

      const backend = await startTestBackend({
        features: [
          mockServices.database.mock({ getClient: async () => knex }).factory,
          catalogBackend,
          catalogModuleHistory,
          mockProvider,
        ],
      });

      await waitFor(async () => {
        await mockProvider.ready;
        await expect(knex('module_history__events')).resolves.toEqual([]);
        await expect(knex('module_history__subscriptions')).resolves.toEqual(
          [],
        );
      });

      const mockConsumer1 = createMockConsumer('a');
      const mockConsumer2 = createMockConsumer('b');
      await connectConsumers({
        consumers: [mockConsumer1, mockConsumer2],
        knex,
        signal: controller.signal,
      });

      mockProvider.addEntity({
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
      });

      await waitFor(() => {
        expect(mockConsumer1.received).toEqual([
          {
            id: expect.any(String),
            eventAt: expect.any(Date),
            eventType: 'entity_inserted',
            entityRef: 'component:default/foo',
            entityJson: expect.stringContaining('"owner":"me"'),
          },
        ]);
        expect(mockConsumer1.received[0].eventAt.getTime()).toBeCloseTo(
          Date.now(),
          -4, // at most 5s offset
        );
      });

      await waitFor(() => {
        expect(mockConsumer2.received).toEqual([
          {
            id: expect.any(String),
            eventAt: expect.any(Date),
            eventType: 'entity_inserted',
            entityRef: 'component:default/foo',
            entityJson: expect.stringContaining('"owner":"me"'),
          },
        ]);
        expect(mockConsumer2.received[0].eventAt.getTime()).toBeCloseTo(
          Date.now(),
          -4, // at most 5s offset
        );
      });

      controller.abort();
      await backend.stop();
      await knex.destroy();
    },
  );
});
