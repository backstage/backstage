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

import {
  coreServices,
  createServiceFactory,
} from '@backstage/backend-plugin-api';
import {
  mockServices,
  startTestBackend,
  type TestBackend,
  type TestDatabaseId,
  TestDatabases,
} from '@backstage/backend-test-utils';
import {
  eventsExtensionPoint,
  type EventsExtensionPoint,
} from '@backstage/plugin-events-node/alpha';
import { applyDatabaseMigrations } from './database/migrations';
import eventsModuleMicrosoftGraphWebhook from './eventsModuleMicrosoftGraphWebhook';
import { MicrosoftGraphSubscriptionsDatabaseClient } from './database/databaseClient';
import { MicrosoftGraphClient } from './service/MicrosoftGraphClient';
import { MicrosoftGraphSubscriptionManager } from './service/MicrosoftGraphSubscriptionManager';
import { createWebhookRequestValidator } from './service/createWebhookRequestValidator';
import { HttpTextPlainBodyParser } from './HttpTextPlainBodyParser';

jest.mock('./database/migrations', () => ({
  applyDatabaseMigrations: jest.fn(() => Promise.resolve()),
}));

jest.mock('./database/databaseClient', () => ({
  MicrosoftGraphSubscriptionsDatabaseClient: {
    create: jest.fn(() => 'mock-db-client'),
  },
}));

jest.mock('./service/MicrosoftGraphClient', () => ({
  MicrosoftGraphClient: {
    fromConfig: jest.fn(() => 'mock-ms-graph-client'),
  },
}));

jest.mock('./service/MicrosoftGraphSubscriptionManager', () => ({
  MicrosoftGraphSubscriptionManager: {
    fromConfig: jest.fn(() =>
      Promise.resolve({ schedule: jest.fn(() => Promise.resolve()) }),
    ),
  },
}));

const mockValidator = jest.fn();

jest.mock('./service/createWebhookRequestValidator', () => ({
  createWebhookRequestValidator: jest.fn(() => mockValidator),
}));

describe('eventsModuleMicrosoftGraphWebhook', () => {
  const mockEventsExtensionPoint: EventsExtensionPoint = {
    addHttpPostIngress: jest.fn(),
    addHttpPostBodyParser: jest.fn(),
    setEventBroker: jest.fn(),
    addPublishers: jest.fn(),
    addSubscribers: jest.fn(),
  };

  const databases = TestDatabases.create();

  async function mockKnexFactory(databaseId: TestDatabaseId) {
    const knex = await databases.init(databaseId);
    return mockServices.database.factory({ knex });
  }

  let backend: TestBackend | undefined = undefined;
  afterEach(async () => {
    if (backend) {
      await backend.stop();
      backend = undefined;
    }

    jest.clearAllMocks();
  });

  describe.each(databases.eachSupportedId())('For DB %p', databaseId => {
    it('should run DB migrations', async () => {
      backend = await startTestBackend({
        extensionPoints: [[eventsExtensionPoint, mockEventsExtensionPoint]],
        features: [
          eventsModuleMicrosoftGraphWebhook,
          await mockKnexFactory(databaseId),
        ],
      });

      expect(backend).toBeDefined();
      expect(applyDatabaseMigrations).toHaveBeenCalled();
    });

    it('should bail out on missing config', async () => {
      const mockLogger = mockServices.logger.mock();

      backend = await startTestBackend({
        extensionPoints: [[eventsExtensionPoint, mockEventsExtensionPoint]],
        features: [
          eventsModuleMicrosoftGraphWebhook,
          await mockKnexFactory(databaseId),
          createServiceFactory({
            service: coreServices.logger,
            deps: {},
            factory() {
              return mockLogger;
            },
          }),
        ],
      });

      expect(backend).toBeDefined();
      expect(mockLogger.warn).toHaveBeenCalledWith(
        'No configuration found for events.modules.msgraph, skipping Microsoft Graph events setup',
      );

      expect(
        mockEventsExtensionPoint.addHttpPostIngress,
      ).not.toHaveBeenCalled();

      expect(
        mockEventsExtensionPoint.addHttpPostBodyParser,
      ).not.toHaveBeenCalled();
    });

    it('should register ingress when config is present', async () => {
      backend = await startTestBackend({
        extensionPoints: [[eventsExtensionPoint, mockEventsExtensionPoint]],
        features: [
          eventsModuleMicrosoftGraphWebhook,
          await mockKnexFactory(databaseId),
          mockServices.rootConfig.factory({
            data: {
              events: {
                modules: {
                  msgraph: {
                    tenantId: 'test-tenant',
                    clientId: 'test-client',
                    clientSecret: 'test-secret',
                    notificationUrl: 'https://example.com/webhook',
                    resources: ['users'],
                  },
                },
              },
            },
          }),
        ],
      });

      expect(backend).toBeDefined();
      expect(applyDatabaseMigrations).toHaveBeenCalled();
      expect(
        MicrosoftGraphSubscriptionsDatabaseClient.create,
      ).toHaveBeenCalled();
      expect(MicrosoftGraphClient.fromConfig).toHaveBeenCalled();
      expect(MicrosoftGraphSubscriptionManager.fromConfig).toHaveBeenCalled();
      expect(createWebhookRequestValidator).toHaveBeenCalled();

      expect(
        mockEventsExtensionPoint.addHttpPostBodyParser,
      ).toHaveBeenCalledWith({
        contentType: 'text/plain',
        parser: HttpTextPlainBodyParser,
      });

      expect(mockEventsExtensionPoint.addHttpPostIngress).toHaveBeenCalledWith(
        expect.objectContaining({
          topic: 'msgraph',
          validator: mockValidator,
        }),
      );
    });

    it('should skip DB migrations when migrations.skip is set', async () => {
      const knex = await databases.init(databaseId);
      const dbFactory = mockServices.database.factory({
        knex,
        migrations: { skip: true },
      });

      backend = await startTestBackend({
        extensionPoints: [[eventsExtensionPoint, mockEventsExtensionPoint]],
        features: [eventsModuleMicrosoftGraphWebhook, dbFactory],
      });

      expect(backend).toBeDefined();
      expect(applyDatabaseMigrations).not.toHaveBeenCalled();
    });
  });
});
