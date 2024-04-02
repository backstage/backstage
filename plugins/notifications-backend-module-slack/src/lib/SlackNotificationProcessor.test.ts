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
import { AuthService, DiscoveryService } from '@backstage/backend-plugin-api';
import { CatalogClient } from '@backstage/catalog-client';
import { ConfigReader } from '@backstage/config';
import { Notification } from '@backstage/plugin-notifications-common';
import { NotificationSendOptions } from '@backstage/plugin-notifications-node';
import { setupRequestMockHandlers } from '@backstage/test-utils';
import { faker } from '@faker-js/faker';
import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';
import { SlackNotificationProcessor } from './SlackNotificationProcessor';
import { ANNOTATION_SLACK_NOTIFICATIONS } from './constants';

const generateNotification = (): Notification => {
  return {
    id: faker.string.uuid(),
    created: faker.date.recent(),
    origin: 'test',
    user: 'user-ref',
    payload: {
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      link: faker.internet.url(),
      severity: faker.helpers.arrayElement([
        'critical',
        'high',
        'normal',
        'low',
      ]),
    },
  };
};

const generateNotificationSendOptions = (
  notification: Notification,
): NotificationSendOptions => {
  return {
    recipients: { type: 'entity', entityRef: notification.user as string },
    payload: notification.payload,
  };
};

const server = setupServer();

describe('SlackNotificationProcessor', () => {
  setupRequestMockHandlers(server);

  const config = {
    notifications: {
      processors: {
        slack: [
          {
            directWebhookUrl: 'https://example.com/webhook/1',
            channelWebhookUrl: 'https://example.com/webhook/2',
          },
        ],
      },
    },
  };

  const auth: jest.Mocked<Partial<AuthService>> = {
    getPluginRequestToken: jest.fn().mockResolvedValue({ token: 'token' }),
    getOwnServiceCredentials: jest.fn().mockResolvedValue({}),
  };

  const discovery: DiscoveryService = {
    getBaseUrl: jest.fn().mockResolvedValue('http://example.com/api/catalog'),
    getExternalBaseUrl: jest.fn(),
  };

  const email = faker.internet.email();
  const catalogClient: jest.Mocked<Partial<CatalogClient>> = {
    getEntitiesByRefs: jest.fn().mockImplementation(async ({ entityRefs }) => {
      if (entityRefs.includes('no-email')) {
        return {
          items: [
            {
              spec: { profile: {} },
            },
          ],
        };
      }
      if (entityRefs.includes('not-found')) {
        return { items: [null] };
      }
      return {
        items: [
          {
            spec: { profile: { email } },
          },
        ],
      };
    }),
  };

  let processor: SlackNotificationProcessor;

  beforeEach(() => {
    processor = SlackNotificationProcessor.fromConfig(
      new ConfigReader(config),
      {
        auth: auth as AuthService,
        discovery,
        logger: getVoidLogger(),
        catalogClient: catalogClient as CatalogClient,
      },
    )[0];
  });

  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
  afterAll(() => server.close());
  afterEach(() => server.resetHandlers());

  describe('postProcess', () => {
    it('should send a Slack direct message', async () => {
      const notification = generateNotification();
      const options = generateNotificationSendOptions(notification);

      server.use(
        http.post('https://example.com/webhook/1', () => {
          return HttpResponse.json({ status: 'ok' });
        }),
      );

      await expect(
        processor.postProcess(notification, options),
      ).resolves.not.toThrow();
    });

    it('should throw an error if sending Slack direct message notification fails', async () => {
      const notification = generateNotification();
      const options = generateNotificationSendOptions(notification);

      server.use(
        http.post('https://example.com/webhook/1', () => {
          return new HttpResponse(null, { status: 500 });
        }),
      );

      await expect(
        processor.postProcess(notification, options),
      ).rejects.toThrow(
        'Failed to send Slack notification: 500 Internal Server Error',
      );
    });

    it('should not send a Slack notification for broadcast notifications', async () => {
      const notification = generateNotification();
      const options = generateNotificationSendOptions(notification);
      options.recipients = { type: 'broadcast' };

      await processor.postProcess(notification, options);

      const jestMock = jest.fn();
      global.fetch = jestMock;

      expect(global.fetch).not.toHaveBeenCalled();

      jestMock.mockReset();
    });
  });

  describe('getEmailFromUser', () => {
    it('should return the email of the user entity', async () => {
      const entityRef = 'user-ref';
      const token = 'token';

      const result = await processor.getEmailFromUser(entityRef);

      expect(auth.getPluginRequestToken).toHaveBeenCalledWith({
        onBehalfOf: {},
        targetPluginId: 'catalog',
      });
      expect(catalogClient.getEntitiesByRefs).toHaveBeenCalledWith(
        {
          entityRefs: [entityRef],
          fields: [
            `metadata.annotations.${ANNOTATION_SLACK_NOTIFICATIONS}`,
            'spec.profile.email',
          ],
        },
        {
          token,
        },
      );
      expect(result).toBe(email);
    });

    it('should throw an error if the entity is not found', async () => {
      const entityRef = 'not-found';

      await expect(processor.getEmailFromUser(entityRef)).rejects.toThrow(
        `Email not found for entity: ${entityRef}`,
      );
    });

    it('should throw an error if the email is not found for the entity', async () => {
      const entityRef = 'no-email';

      await expect(processor.getEmailFromUser(entityRef)).rejects.toThrow(
        `Email not found for entity: ${entityRef}`,
      );
    });
  });
});
