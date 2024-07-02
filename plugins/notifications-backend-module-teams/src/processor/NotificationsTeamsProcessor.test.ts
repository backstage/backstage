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

import { getVoidLogger } from '@backstage/backend-common';
import { DiscoveryService } from '@backstage/backend-plugin-api';
import { CatalogClient } from '@backstage/catalog-client';
import { ConfigReader } from '@backstage/config';
import { mockServices } from '@backstage/backend-test-utils';
import { setupRequestMockHandlers } from '@backstage/test-utils';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { JsonObject } from '@backstage/types';
import { ANNOTATION_TEAMS_WEBHOOK } from '../constants';
import { NotificationsTeamsProcessor } from './NotificationsTeamsProcessor';
import { NotificationSendOptions } from '@backstage/plugin-notifications-node';

const server = setupServer();

describe('NotificationTeamsProcessor', () => {
  setupRequestMockHandlers(server);

  const config: JsonObject = {
    app: {
      baseUrl: 'https://demo.backstage.io',
    },
    notifications: {
      processors: {
        teams: {
          broadcastConfig: {
            webhooks: ['https://example.com/webhook/1'],
          },
        },
      },
    },
  };

  const discovery: DiscoveryService = {
    getBaseUrl: jest.fn().mockResolvedValue('http://example.com/api/catalog'),
    getExternalBaseUrl: jest.fn(),
  };

  const catalogClient: jest.Mocked<Partial<CatalogClient>> = {
    getEntitiesByRefs: jest.fn().mockImplementation(async () => {
      return {
        items: [
          {
            metadata: {
              annotations: {
                [ANNOTATION_TEAMS_WEBHOOK]: 'https://example.com/webhook/2',
              },
            },
          },
        ],
      };
    }),
  };

  let processor: NotificationsTeamsProcessor;

  beforeEach(() => {
    processor = NotificationsTeamsProcessor.fromConfig(
      new ConfigReader(config),
      {
        auth: mockServices.auth(),
        discovery,
        logger: getVoidLogger(),
        catalogClient: catalogClient as CatalogClient,
        cache: mockServices.cache.mock(),
      },
    );
  });

  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
  afterAll(() => server.close());
  afterEach(() => server.resetHandlers());

  describe('processOptions', () => {
    it('should send a teams to broadcast', async () => {
      const options: NotificationSendOptions = {
        recipients: { type: 'broadcast' },
        payload: {
          title: 'Test notification',
          description: 'Test description',
          link: 'https://backstage.io',
        },
      };

      server.use(
        http.post<{}, any>(
          'https://example.com/webhook/1',
          async ({ request }) => {
            const json = await request.json();
            if (json.title !== 'Test notification') {
              return new HttpResponse(null, { status: 400 });
            }
            return HttpResponse.json({ status: 'ok' });
          },
        ),
      );

      await expect(processor.processOptions(options)).resolves.not.toThrow();
    });

    it('should send a notification to entity', async () => {
      const options: NotificationSendOptions = {
        recipients: { type: 'entity', entityRef: 'component:default/comp' },
        payload: {
          title: 'Test notification',
          description: 'Test description',
          link: 'https://backstage.io',
        },
      };

      server.use(
        http.post<{}, any>(
          'https://example.com/webhook/2',
          async ({ request }) => {
            const json = await request.json();
            if (json.title !== 'Test notification') {
              return new HttpResponse(null, { status: 400 });
            }
            return HttpResponse.json({ status: 'ok' });
          },
        ),
      );

      await expect(processor.processOptions(options)).resolves.not.toThrow();
    });
  });
});
