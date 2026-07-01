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

import { mockServices } from '@backstage/backend-test-utils';
import { metricsServiceMock } from '@backstage/backend-test-utils/alpha';
import { SlackNotificationProcessor } from './SlackNotificationProcessor';
import { catalogServiceMock } from '@backstage/plugin-catalog-node/testUtils';
import { KnownBlock, WebClient } from '@slack/web-api';
import { Entity } from '@backstage/catalog-model';
import { Knex } from 'knex';
import pThrottle from 'p-throttle';
import { durationToMilliseconds } from '@backstage/types';

const throttleConfigs: Array<{ limit: number; interval: number }> = [];

jest.mock('p-throttle', () => ({
  __esModule: true,
  default: jest.fn((config: { limit: number; interval: number }) => {
    throttleConfigs.push(config);
    return <T extends (...args: any[]) => Promise<any> | any>(fn: T) =>
      (...args: Parameters<T>) =>
        Promise.resolve(fn(...args));
  }),
}));

const mockedPThrottle = pThrottle as jest.MockedFunction<typeof pThrottle>;

jest.mock('@slack/web-api', () => {
  const mockSlack = {
    chat: {
      postMessage: jest.fn(() => ({
        ok: true,
        ts: '1234567890.123456',
        channel: 'C12345678',
      })),
      update: jest.fn(() => ({
        ok: true,
        ts: '1234567890.123456',
        channel: 'C12345678',
      })),
    },
    conversations: {
      list: jest.fn(() => ({
        ok: true,
        channels: [{ id: 'C12345678', name: 'test' }],
      })),
    },
    users: {
      list: jest.fn(() => ({
        ok: true,
        members: [
          {
            id: 'U12345678',
            name: 'test',
            profile: { email: 'test@example.com' },
            real_name: 'Test User',
            is_bot: false,
            is_app_user: false,
            deleted: false,
          },
        ],
      })),
      lookupByEmail: jest.fn(),
    },
  };
  return { WebClient: jest.fn(() => mockSlack) };
});

const DEFAULT_ENTITIES_RESPONSE = {
  items: [
    {
      kind: 'User',
      metadata: {
        name: 'mock',
        namespace: 'default',
        annotations: {
          'slack.com/bot-notify': 'U12345678',
        },
      },
      spec: {
        type: 'service',
        owner: 'group:default/mock',
      },
    } as unknown as Entity,
    {
      kind: 'Group',
      metadata: {
        name: 'mock',
        namespace: 'default',
        annotations: {
          'slack.com/bot-notify': 'C12345678',
        },
      },
    } as unknown as Entity,
    {
      kind: 'User',
      metadata: {
        name: 'mock-without-slack-annotation',
        namespace: 'default',
        annotations: {},
      },
      spec: {
        profile: {
          email: 'test@example.com',
        },
      },
    } as unknown as Entity,
    {
      kind: 'Group',
      metadata: {
        name: 'mock-without-slack-annotation',
        namespace: 'default',
        annotations: {},
      },
    } as unknown as Entity,
  ],
};

describe('SlackNotificationProcessor', () => {
  const logger = mockServices.logger.mock();
  const auth = mockServices.auth();
  const metrics = metricsServiceMock.mock();
  const config = mockServices.rootConfig({
    data: {
      app: {
        baseUrl: 'https://example.org',
      },
      notifications: {
        processors: {
          slack: [
            {
              token: 'mock-token',
            },
          ],
        },
      },
    },
  });

  beforeEach(() => {
    jest.clearAllMocks();
    throttleConfigs.length = 0;
    mockedPThrottle.mockClear();
  });

  it('should send a notification to a group', async () => {
    const slack = new WebClient();

    const processor = SlackNotificationProcessor.fromConfig(config, {
      auth,
      logger,
      catalog: catalogServiceMock({
        entities: DEFAULT_ENTITIES_RESPONSE.items,
      }),
      metrics,
      slack,
    })[0];

    await processor.processOptions({
      recipients: { type: 'entity', entityRef: 'group:default/mock' },
      payload: { title: 'notification' },
    });

    expect(slack.chat.postMessage).toHaveBeenCalledWith({
      channel: 'C12345678',
      text: 'notification',
      attachments: [
        {
          color: '#00A699',
          blocks: [
            {
              type: 'section',
              text: {
                text: 'No description provided',
                type: 'mrkdwn',
              },
              accessory: {
                type: 'button',
                text: {
                  type: 'plain_text',
                  text: 'View More',
                },
                action_id: 'button-action',
              },
            },
            {
              type: 'context',
              elements: [
                {
                  type: 'plain_text',
                  text: 'Severity: normal',
                  emoji: true,
                },
                {
                  type: 'plain_text',
                  text: 'Topic: N/A',
                  emoji: true,
                },
              ],
            },
          ],
          fallback: 'notification',
        },
      ],
    });
  });

  it('should use a custom block kit renderer when provided', async () => {
    const slack = new WebClient();
    const customBlocks: KnownBlock[] = [
      {
        type: 'section',
        text: { type: 'mrkdwn', text: 'Custom block' },
      },
    ];

    const processor = SlackNotificationProcessor.fromConfig(config, {
      auth,
      logger,
      catalog: catalogServiceMock({
        entities: DEFAULT_ENTITIES_RESPONSE.items,
      }),
      metrics,
      slack,
      blockKitRenderer: () => customBlocks,
    })[0];

    await processor.processOptions({
      recipients: { type: 'entity', entityRef: 'group:default/mock' },
      payload: { title: 'notification' },
    });

    expect(slack.chat.postMessage).toHaveBeenCalledWith({
      channel: 'C12345678',
      text: 'notification',
      attachments: [
        {
          color: '#00A699',
          blocks: customBlocks,
          fallback: 'notification',
        },
      ],
    });
  });

  describe('when a user notification is sent directly', () => {
    it('should send a notification to a user', async () => {
      const slack = new WebClient();

      const processor = SlackNotificationProcessor.fromConfig(config, {
        auth,
        logger,
        catalog: catalogServiceMock({
          entities: DEFAULT_ENTITIES_RESPONSE.items,
        }),
        metrics,
        slack,
      })[0];

      await processor.postProcess(
        {
          origin: 'plugin',
          id: '1234',
          user: 'user:default/mock',
          created: new Date(),
          payload: {
            title: 'notification',
            link: '/catalog/user/default/jane.doe',
          },
        },
        {
          recipients: { type: 'entity', entityRef: 'user:default/mock' },
          payload: { title: 'notification' },
        },
      );

      expect(slack.chat.postMessage).toHaveBeenCalledWith({
        channel: 'U12345678',
        text: 'notification',
        attachments: [
          {
            color: '#00A699',
            blocks: [
              {
                type: 'section',
                text: {
                  text: 'No description provided',
                  type: 'mrkdwn',
                },
                accessory: {
                  type: 'button',
                  text: {
                    type: 'plain_text',
                    text: 'View More',
                  },
                  action_id: 'button-action',
                },
              },
              {
                type: 'context',
                elements: [
                  {
                    type: 'plain_text',
                    text: 'Severity: normal',
                    emoji: true,
                  },
                  {
                    type: 'plain_text',
                    text: 'Topic: N/A',
                    emoji: true,
                  },
                ],
              },
            ],
            fallback: 'notification',
          },
        ],
      });
    });
  });

  describe('when a user notification is expanded from a group', () => {
    it('should not send a notification', async () => {
      const slack = new WebClient();

      const processor = SlackNotificationProcessor.fromConfig(config, {
        auth,
        logger,
        catalog: catalogServiceMock({
          entities: DEFAULT_ENTITIES_RESPONSE.items,
        }),
        metrics,
        slack,
      })[0];

      await processor.postProcess(
        {
          origin: 'plugin',
          id: '1234',
          user: 'user:default/mock',
          created: new Date(),
          payload: {
            title: 'notification',
            link: '/catalog/user/default/jane.doe',
          },
        },
        {
          recipients: { type: 'entity', entityRef: 'group:default/group' },
          payload: { title: 'notification' },
        },
      );

      expect(slack.chat.postMessage).not.toHaveBeenCalled();
    });
  });

  describe('when recipients include both users and a group', () => {
    it('should still DM explicit user recipients', async () => {
      const slack = new WebClient();

      const processor = SlackNotificationProcessor.fromConfig(config, {
        auth,
        logger,
        catalog: catalogServiceMock({
          entities: DEFAULT_ENTITIES_RESPONSE.items,
        }),
        metrics,
        slack,
      })[0];

      await processor.processOptions({
        recipients: {
          type: 'entity',
          entityRef: ['group:default/mock', 'user:default/mock'],
        },
        payload: { title: 'notification' },
      });

      await processor.postProcess(
        {
          origin: 'plugin',
          id: 'explicit-user-1',
          user: 'user:default/mock',
          created: new Date(),
          payload: { title: 'notification' },
        },
        {
          recipients: {
            type: 'entity',
            entityRef: ['group:default/mock', 'user:default/mock'],
          },
          payload: { title: 'notification' },
        },
      );

      expect(slack.chat.postMessage).toHaveBeenCalledTimes(2);
      expect(slack.chat.postMessage).toHaveBeenCalledWith(
        expect.objectContaining({ channel: 'U12345678' }),
      );
    });
  });

  describe('when broadcast channels are not configured', () => {
    it('should not send broadcast messages', async () => {
      const slack = new WebClient();

      const processor = SlackNotificationProcessor.fromConfig(config, {
        auth,
        logger,
        catalog: catalogServiceMock({
          entities: DEFAULT_ENTITIES_RESPONSE.items,
        }),
        metrics,
        slack,
      })[0];

      await processor.processOptions({
        recipients: { type: 'broadcast' },
        payload: { title: 'notification' },
      });

      await processor.postProcess(
        {
          origin: 'plugin',
          id: '1234',
          user: null,
          created: new Date(),
          payload: {
            title: 'notification',
            link: '/catalog/user/default/jane.doe',
          },
        },
        {
          recipients: { type: 'broadcast' },
          payload: { title: 'notification' },
        },
      );
      expect(slack.chat.postMessage).not.toHaveBeenCalled();
    });
  });

  describe('when broadcast channels are configured', () => {
    it('should send broadcast messages', async () => {
      const slack = new WebClient();
      const broadcastConfig = mockServices.rootConfig({
        data: {
          app: {
            baseUrl: 'https://example.org',
          },
          notifications: {
            processors: {
              slack: [
                {
                  token: 'mock-token',
                  broadcastChannels: ['C12345678', 'D12345678'],
                },
              ],
            },
          },
        },
      });

      const processor = SlackNotificationProcessor.fromConfig(broadcastConfig, {
        auth,
        logger,
        catalog: catalogServiceMock({
          entities: DEFAULT_ENTITIES_RESPONSE.items,
        }),
        metrics,
        slack,
      })[0];

      await processor.processOptions({
        recipients: { type: 'broadcast' },
        payload: { title: 'notification' },
      });

      await processor.postProcess(
        {
          origin: 'plugin',
          id: '1234',
          user: null,
          created: new Date(),
          payload: {
            title: 'notification',
            link: '/catalog/user/default/jane.doe',
          },
        },
        {
          recipients: { type: 'broadcast' },
          payload: { title: 'notification' },
        },
      );
      expect(slack.chat.postMessage).toHaveBeenCalledTimes(2);
    });
  });

  describe('when broadcast routes are configured', () => {
    it('should route by origin and topic (highest priority)', async () => {
      const slack = new WebClient();
      const routesConfig = mockServices.rootConfig({
        data: {
          app: {
            baseUrl: 'https://example.org',
          },
          notifications: {
            processors: {
              slack: [
                {
                  token: 'mock-token',
                  broadcastChannels: ['default-channel'],
                  broadcastRoutes: [
                    { origin: 'plugin:catalog', channel: 'catalog-channel' },
                    { topic: 'alerts', channel: 'alerts-channel' },
                    {
                      origin: 'plugin:catalog',
                      topic: 'alerts',
                      channel: 'catalog-alerts-channel',
                    },
                  ],
                },
              ],
            },
          },
        },
      });

      const processor = SlackNotificationProcessor.fromConfig(routesConfig, {
        auth,
        logger,
        catalog: catalogServiceMock({
          entities: DEFAULT_ENTITIES_RESPONSE.items,
        }),
        metrics,
        slack,
      })[0];

      await processor.postProcess(
        {
          origin: 'plugin:catalog',
          id: '1234',
          user: null,
          created: new Date(),
          payload: {
            title: 'notification',
            topic: 'alerts',
          },
        },
        {
          recipients: { type: 'broadcast' },
          payload: { title: 'notification', topic: 'alerts' },
        },
      );

      expect(slack.chat.postMessage).toHaveBeenCalledTimes(1);
      expect(slack.chat.postMessage).toHaveBeenCalledWith(
        expect.objectContaining({ channel: 'catalog-alerts-channel' }),
      );
    });

    it('should route by origin only when no origin+topic match', async () => {
      const slack = new WebClient();
      const routesConfig = mockServices.rootConfig({
        data: {
          app: {
            baseUrl: 'https://example.org',
          },
          notifications: {
            processors: {
              slack: [
                {
                  token: 'mock-token',
                  broadcastRoutes: [
                    { origin: 'plugin:catalog', channel: 'catalog-channel' },
                    { topic: 'alerts', channel: 'alerts-channel' },
                  ],
                },
              ],
            },
          },
        },
      });

      const processor = SlackNotificationProcessor.fromConfig(routesConfig, {
        auth,
        logger,
        catalog: catalogServiceMock({
          entities: DEFAULT_ENTITIES_RESPONSE.items,
        }),
        metrics,
        slack,
      })[0];

      await processor.postProcess(
        {
          origin: 'plugin:catalog',
          id: '1234',
          user: null,
          created: new Date(),
          payload: {
            title: 'notification',
            topic: 'updates',
          },
        },
        {
          recipients: { type: 'broadcast' },
          payload: { title: 'notification', topic: 'updates' },
        },
      );

      expect(slack.chat.postMessage).toHaveBeenCalledTimes(1);
      expect(slack.chat.postMessage).toHaveBeenCalledWith(
        expect.objectContaining({ channel: 'catalog-channel' }),
      );
    });

    it('should route by topic only when no origin match', async () => {
      const slack = new WebClient();
      const routesConfig = mockServices.rootConfig({
        data: {
          app: {
            baseUrl: 'https://example.org',
          },
          notifications: {
            processors: {
              slack: [
                {
                  token: 'mock-token',
                  broadcastRoutes: [
                    { origin: 'plugin:catalog', channel: 'catalog-channel' },
                    { topic: 'alerts', channel: 'alerts-channel' },
                  ],
                },
              ],
            },
          },
        },
      });

      const processor = SlackNotificationProcessor.fromConfig(routesConfig, {
        auth,
        logger,
        catalog: catalogServiceMock({
          entities: DEFAULT_ENTITIES_RESPONSE.items,
        }),
        metrics,
        slack,
      })[0];

      await processor.postProcess(
        {
          origin: 'plugin:unknown',
          id: '1234',
          user: null,
          created: new Date(),
          payload: {
            title: 'notification',
            topic: 'alerts',
          },
        },
        {
          recipients: { type: 'broadcast' },
          payload: { title: 'notification', topic: 'alerts' },
        },
      );

      expect(slack.chat.postMessage).toHaveBeenCalledTimes(1);
      expect(slack.chat.postMessage).toHaveBeenCalledWith(
        expect.objectContaining({ channel: 'alerts-channel' }),
      );
    });

    it('should fall back to broadcastChannels when no route matches', async () => {
      const slack = new WebClient();
      const routesConfig = mockServices.rootConfig({
        data: {
          app: {
            baseUrl: 'https://example.org',
          },
          notifications: {
            processors: {
              slack: [
                {
                  token: 'mock-token',
                  broadcastChannels: ['default-channel'],
                  broadcastRoutes: [
                    { origin: 'plugin:catalog', channel: 'catalog-channel' },
                  ],
                },
              ],
            },
          },
        },
      });

      const processor = SlackNotificationProcessor.fromConfig(routesConfig, {
        auth,
        logger,
        catalog: catalogServiceMock({
          entities: DEFAULT_ENTITIES_RESPONSE.items,
        }),
        metrics,
        slack,
      })[0];

      await processor.postProcess(
        {
          origin: 'plugin:unknown',
          id: '1234',
          user: null,
          created: new Date(),
          payload: {
            title: 'notification',
          },
        },
        {
          recipients: { type: 'broadcast' },
          payload: { title: 'notification' },
        },
      );

      expect(slack.chat.postMessage).toHaveBeenCalledTimes(1);
      expect(slack.chat.postMessage).toHaveBeenCalledWith(
        expect.objectContaining({ channel: 'default-channel' }),
      );
    });

    it('should support multiple channels in a route', async () => {
      const slack = new WebClient();
      const routesConfig = mockServices.rootConfig({
        data: {
          app: {
            baseUrl: 'https://example.org',
          },
          notifications: {
            processors: {
              slack: [
                {
                  token: 'mock-token',
                  broadcastRoutes: [
                    {
                      origin: 'plugin:catalog',
                      channel: ['channel1', 'channel2', 'channel3'],
                    },
                  ],
                },
              ],
            },
          },
        },
      });

      const processor = SlackNotificationProcessor.fromConfig(routesConfig, {
        auth,
        logger,
        catalog: catalogServiceMock({
          entities: DEFAULT_ENTITIES_RESPONSE.items,
        }),
        metrics,
        slack,
      })[0];

      await processor.postProcess(
        {
          origin: 'plugin:catalog',
          id: '1234',
          user: null,
          created: new Date(),
          payload: {
            title: 'notification',
          },
        },
        {
          recipients: { type: 'broadcast' },
          payload: { title: 'notification' },
        },
      );

      expect(slack.chat.postMessage).toHaveBeenCalledTimes(3);
      expect(slack.chat.postMessage).toHaveBeenCalledWith(
        expect.objectContaining({ channel: 'channel1' }),
      );
      expect(slack.chat.postMessage).toHaveBeenCalledWith(
        expect.objectContaining({ channel: 'channel2' }),
      );
      expect(slack.chat.postMessage).toHaveBeenCalledWith(
        expect.objectContaining({ channel: 'channel3' }),
      );
    });

    it('should support single channel as string in a route', async () => {
      const slack = new WebClient();
      const routesConfig = mockServices.rootConfig({
        data: {
          app: {
            baseUrl: 'https://example.org',
          },
          notifications: {
            processors: {
              slack: [
                {
                  token: 'mock-token',
                  broadcastRoutes: [
                    { topic: 'alerts', channel: 'single-alerts-channel' },
                  ],
                },
              ],
            },
          },
        },
      });

      const processor = SlackNotificationProcessor.fromConfig(routesConfig, {
        auth,
        logger,
        catalog: catalogServiceMock({
          entities: DEFAULT_ENTITIES_RESPONSE.items,
        }),
        metrics,
        slack,
      })[0];

      await processor.postProcess(
        {
          origin: 'plugin:any',
          id: '1234',
          user: null,
          created: new Date(),
          payload: {
            title: 'notification',
            topic: 'alerts',
          },
        },
        {
          recipients: { type: 'broadcast' },
          payload: { title: 'notification', topic: 'alerts' },
        },
      );

      expect(slack.chat.postMessage).toHaveBeenCalledTimes(1);
      expect(slack.chat.postMessage).toHaveBeenCalledWith(
        expect.objectContaining({ channel: 'single-alerts-channel' }),
      );
    });

    it('should not send when no route matches and no broadcastChannels configured', async () => {
      const slack = new WebClient();
      const routesConfig = mockServices.rootConfig({
        data: {
          app: {
            baseUrl: 'https://example.org',
          },
          notifications: {
            processors: {
              slack: [
                {
                  token: 'mock-token',
                  broadcastRoutes: [
                    { origin: 'plugin:catalog', channel: 'catalog-channel' },
                  ],
                },
              ],
            },
          },
        },
      });

      const processor = SlackNotificationProcessor.fromConfig(routesConfig, {
        auth,
        logger,
        catalog: catalogServiceMock({
          entities: DEFAULT_ENTITIES_RESPONSE.items,
        }),
        metrics,
        slack,
      })[0];

      await processor.postProcess(
        {
          origin: 'plugin:unknown',
          id: '1234',
          user: null,
          created: new Date(),
          payload: {
            title: 'notification',
            topic: 'unknown-topic',
          },
        },
        {
          recipients: { type: 'broadcast' },
          payload: { title: 'notification', topic: 'unknown-topic' },
        },
      );

      expect(slack.chat.postMessage).not.toHaveBeenCalled();
    });

    it('should match origin+topic route over origin-only route', async () => {
      const slack = new WebClient();
      const routesConfig = mockServices.rootConfig({
        data: {
          app: {
            baseUrl: 'https://example.org',
          },
          notifications: {
            processors: {
              slack: [
                {
                  token: 'mock-token',
                  broadcastRoutes: [
                    // Origin-only route defined first
                    { origin: 'plugin:catalog', channel: 'general-catalog' },
                    // More specific origin+topic route defined second
                    {
                      origin: 'plugin:catalog',
                      topic: 'entity-deleted',
                      channel: 'catalog-deletions',
                    },
                  ],
                },
              ],
            },
          },
        },
      });

      const processor = SlackNotificationProcessor.fromConfig(routesConfig, {
        auth,
        logger,
        catalog: catalogServiceMock({
          entities: DEFAULT_ENTITIES_RESPONSE.items,
        }),
        metrics,
        slack,
      })[0];

      await processor.postProcess(
        {
          origin: 'plugin:catalog',
          id: '1234',
          user: null,
          created: new Date(),
          payload: {
            title: 'notification',
            topic: 'entity-deleted',
          },
        },
        {
          recipients: { type: 'broadcast' },
          payload: { title: 'notification', topic: 'entity-deleted' },
        },
      );

      // Should use the origin+topic match, not the origin-only match
      expect(slack.chat.postMessage).toHaveBeenCalledTimes(1);
      expect(slack.chat.postMessage).toHaveBeenCalledWith(
        expect.objectContaining({ channel: 'catalog-deletions' }),
      );
    });
  });

  describe('when slack.com/bot-notify annotation is missing', () => {
    it('should not send notification to a group without annotation', async () => {
      const slack = new WebClient();

      const processor = SlackNotificationProcessor.fromConfig(config, {
        auth,
        logger,
        catalog: catalogServiceMock({
          entities: DEFAULT_ENTITIES_RESPONSE.items,
        }),
        metrics,
        slack,
      })[0];

      await processor.processOptions({
        recipients: {
          type: 'entity',
          entityRef: 'group:default/mock-without-slack-annotation',
        },
        payload: { title: 'notification' },
      });

      expect(slack.chat.postMessage).not.toHaveBeenCalled();
    });

    it('should not send notification to a user without annotation and email', async () => {
      const slack = new WebClient();

      const processor = SlackNotificationProcessor.fromConfig(config, {
        auth,
        logger,
        catalog: catalogServiceMock({
          entities: [DEFAULT_ENTITIES_RESPONSE.items[2]],
        }),
        metrics,
        slack,
      })[0];

      await processor.postProcess(
        {
          origin: 'plugin',
          id: '1234',
          user: 'user:default/mock-without-slack-annotation',
          created: new Date(),
          payload: {
            title: 'notification',
            link: '/catalog/user/default/jane.doe',
          },
        },
        {
          recipients: {
            type: 'entity',
            entityRef: 'user:default/mock-without-slack-annotation',
          },
          payload: { title: 'notification' },
        },
      );

      expect(slack.chat.postMessage).not.toHaveBeenCalled();
    });

    it('should try to find user by email when annotation is missing', async () => {
      const slack = new WebClient();
      (slack.users.lookupByEmail as jest.Mock).mockResolvedValueOnce({
        ok: true,
        user: { id: 'U12345678' },
      });

      const processor = SlackNotificationProcessor.fromConfig(config, {
        auth,
        logger,
        catalog: catalogServiceMock({
          entities: DEFAULT_ENTITIES_RESPONSE.items,
        }),
        metrics,
        slack,
      })[0];

      await processor.postProcess(
        {
          origin: 'plugin',
          id: '1234',
          user: 'user:default/mock-without-slack-annotation',
          created: new Date(),
          payload: {
            title: 'notification',
            link: '/catalog/user/default/jane.doe',
          },
        },
        {
          recipients: {
            type: 'entity',
            entityRef: 'user:default/mock-without-slack-annotation',
          },
          payload: { title: 'notification' },
        },
      );

      expect(slack.users.lookupByEmail).toHaveBeenCalledWith({
        email: 'test@example.com',
      });
      expect(slack.chat.postMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          channel: 'U12345678',
        }),
      );
    });

    it('should log warning when email lookup fails', async () => {
      const slack = new WebClient();
      (slack.users.lookupByEmail as jest.Mock).mockRejectedValueOnce(
        new Error('User not found'),
      );

      const processor = SlackNotificationProcessor.fromConfig(config, {
        auth,
        logger,
        catalog: catalogServiceMock({
          entities: DEFAULT_ENTITIES_RESPONSE.items,
        }),
        metrics,
        slack,
      })[0];

      await processor.postProcess(
        {
          origin: 'plugin',
          id: '1234',
          user: 'user:default/mock-without-slack-annotation',
          created: new Date(),
          payload: {
            title: 'notification',
            link: '/catalog/user/default/jane.doe',
          },
        },
        {
          recipients: {
            type: 'entity',
            entityRef: 'user:default/mock-without-slack-annotation',
          },
          payload: { title: 'notification' },
        },
      );

      expect(logger.warn).toHaveBeenCalledWith(
        expect.stringContaining(
          'Failed to lookup Slack user by email test@example.com',
        ),
      );
      expect(slack.chat.postMessage).not.toHaveBeenCalled();
    });
  });

  describe('when username is configured', () => {
    it('should include username in group messages', async () => {
      const slack = new WebClient();
      const usernameConfig = mockServices.rootConfig({
        data: {
          app: {
            baseUrl: 'https://example.org',
          },
          notifications: {
            processors: {
              slack: [
                {
                  token: 'mock-token',
                  username: 'BackstageBot',
                },
              ],
            },
          },
        },
      });

      const processor = SlackNotificationProcessor.fromConfig(usernameConfig, {
        auth,
        logger,
        catalog: catalogServiceMock({
          entities: DEFAULT_ENTITIES_RESPONSE.items,
        }),
        metrics,
        slack,
      })[0];

      await processor.processOptions({
        recipients: { type: 'entity', entityRef: 'group:default/mock' },
        payload: { title: 'notification' },
      });

      expect(slack.chat.postMessage).toHaveBeenCalledWith({
        channel: 'C12345678',
        text: 'notification',
        username: 'BackstageBot',
        attachments: [
          {
            color: '#00A699',
            blocks: [
              {
                type: 'section',
                text: {
                  text: 'No description provided',
                  type: 'mrkdwn',
                },
                accessory: {
                  type: 'button',
                  text: {
                    type: 'plain_text',
                    text: 'View More',
                  },
                  action_id: 'button-action',
                },
              },
              {
                type: 'context',
                elements: [
                  {
                    type: 'plain_text',
                    text: 'Severity: normal',
                    emoji: true,
                  },
                  {
                    type: 'plain_text',
                    text: 'Topic: N/A',
                    emoji: true,
                  },
                ],
              },
            ],
            fallback: 'notification',
          },
        ],
      });
    });

    it('should include username in direct user messages', async () => {
      const slack = new WebClient();
      const usernameConfig = mockServices.rootConfig({
        data: {
          app: {
            baseUrl: 'https://example.org',
          },
          notifications: {
            processors: {
              slack: [
                {
                  token: 'mock-token',
                  username: 'BackstageBot',
                },
              ],
            },
          },
        },
      });

      const processor = SlackNotificationProcessor.fromConfig(usernameConfig, {
        auth,
        logger,
        catalog: catalogServiceMock({
          entities: DEFAULT_ENTITIES_RESPONSE.items,
        }),
        metrics,
        slack,
      })[0];

      await processor.postProcess(
        {
          origin: 'plugin',
          id: '1234',
          user: 'user:default/mock',
          created: new Date(),
          payload: {
            title: 'notification',
            link: '/catalog/user/default/jane.doe',
          },
        },
        {
          recipients: { type: 'entity', entityRef: 'user:default/mock' },
          payload: { title: 'notification' },
        },
      );

      expect(slack.chat.postMessage).toHaveBeenCalledWith({
        channel: 'U12345678',
        text: 'notification',
        username: 'BackstageBot',
        attachments: [
          {
            color: '#00A699',
            blocks: [
              {
                type: 'section',
                text: {
                  text: 'No description provided',
                  type: 'mrkdwn',
                },
                accessory: {
                  type: 'button',
                  text: {
                    type: 'plain_text',
                    text: 'View More',
                  },
                  action_id: 'button-action',
                },
              },
              {
                type: 'context',
                elements: [
                  {
                    type: 'plain_text',
                    text: 'Severity: normal',
                    emoji: true,
                  },
                  {
                    type: 'plain_text',
                    text: 'Topic: N/A',
                    emoji: true,
                  },
                ],
              },
            ],
            fallback: 'notification',
          },
        ],
      });
    });

    it('should include username in broadcast messages', async () => {
      const slack = new WebClient();
      const usernameAndBroadcastConfig = mockServices.rootConfig({
        data: {
          app: {
            baseUrl: 'https://example.org',
          },
          notifications: {
            processors: {
              slack: [
                {
                  token: 'mock-token',
                  username: 'BackstageBot',
                  broadcastChannels: ['C12345678'],
                },
              ],
            },
          },
        },
      });

      const processor = SlackNotificationProcessor.fromConfig(
        usernameAndBroadcastConfig,
        {
          auth,
          logger,
          catalog: catalogServiceMock({
            entities: DEFAULT_ENTITIES_RESPONSE.items,
          }),
          metrics,
          slack,
        },
      )[0];

      await processor.postProcess(
        {
          origin: 'plugin',
          id: '1234',
          user: null,
          created: new Date(),
          payload: {
            title: 'notification',
            link: '/catalog/user/default/jane.doe',
          },
        },
        {
          recipients: { type: 'broadcast' },
          payload: { title: 'notification' },
        },
      );

      expect(slack.chat.postMessage).toHaveBeenCalledWith({
        channel: 'C12345678',
        text: 'notification',
        username: 'BackstageBot',
        attachments: [
          {
            color: '#00A699',
            blocks: [
              {
                type: 'section',
                text: {
                  text: 'No description provided',
                  type: 'mrkdwn',
                },
                accessory: {
                  type: 'button',
                  text: {
                    type: 'plain_text',
                    text: 'View More',
                  },
                  action_id: 'button-action',
                },
              },
              {
                type: 'context',
                elements: [
                  {
                    type: 'plain_text',
                    text: 'Severity: normal',
                    emoji: true,
                  },
                  {
                    type: 'plain_text',
                    text: 'Topic: N/A',
                    emoji: true,
                  },
                ],
              },
            ],
            fallback: 'notification',
          },
        ],
      });
    });
  });

  describe('when username is not configured', () => {
    it('should not include username in messages', async () => {
      const slack = new WebClient();

      const processor = SlackNotificationProcessor.fromConfig(config, {
        auth,
        logger,
        catalog: catalogServiceMock({
          entities: DEFAULT_ENTITIES_RESPONSE.items,
        }),
        metrics,
        slack,
      })[0];

      await processor.processOptions({
        recipients: { type: 'entity', entityRef: 'group:default/mock' },
        payload: { title: 'notification' },
      });

      const calls = (slack.chat.postMessage as jest.Mock).mock.calls;
      expect(calls).toHaveLength(1);
      expect(calls[0][0].username).toBeUndefined();
    });
  });

  describe('when replacing user entity refs with Slack IDs', () => {
    const createBaseMessage = (text: string) => ({
      channel: 'U12345678',
      text: 'notification',
      attachments: [
        {
          color: '#00A699',
          blocks: [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text,
              },
              accessory: {
                type: 'button',
                text: {
                  type: 'plain_text',
                  text: 'View More',
                },
                action_id: 'button-action',
              },
            },
            {
              type: 'context',
              elements: [
                {
                  type: 'plain_text',
                  text: 'Severity: normal',
                  emoji: true,
                },
                {
                  type: 'plain_text',
                  text: 'Topic: N/A',
                  emoji: true,
                },
              ],
            },
          ],
          fallback: 'notification',
        },
      ],
    });

    it('should replace user entity refs with Slack compatible mentions', async () => {
      const slack = new WebClient();
      const processor = SlackNotificationProcessor.fromConfig(config, {
        auth,
        logger,
        catalog: catalogServiceMock({
          entities: DEFAULT_ENTITIES_RESPONSE.items,
        }),
        metrics,
        slack,
      })[0];

      await processor.postProcess(
        {
          origin: 'plugin',
          id: '1234',
          user: 'user:default/mock',
          created: new Date(),
          payload: {
            title: 'notification',
            description:
              'Hello <@user:default/mock> and <@user:default/mock-without-slack-annotation>',
          },
        },
        {
          recipients: { type: 'entity', entityRef: 'user:default/mock' },
          payload: {
            title: 'notification',
            description:
              'Hello <@user:default/mock> and <@user:default/mock-without-slack-annotation>',
          },
        },
      );

      expect(slack.chat.postMessage).toHaveBeenCalledWith(
        createBaseMessage(
          'Hello <@U12345678> and <@user:default/mock-without-slack-annotation>',
        ),
      );
    });

    it('should handle text without user entity refs', async () => {
      const slack = new WebClient();
      const processor = SlackNotificationProcessor.fromConfig(config, {
        auth,
        logger,
        catalog: catalogServiceMock({
          entities: DEFAULT_ENTITIES_RESPONSE.items,
        }),
        metrics,
        slack,
      })[0];

      await processor.postProcess(
        {
          origin: 'plugin',
          id: '1234',
          user: 'user:default/mock',
          created: new Date(),
          payload: {
            title: 'notification',
            description: 'Hello world',
          },
        },
        {
          recipients: { type: 'entity', entityRef: 'user:default/mock' },
          payload: {
            title: 'notification',
            description: 'Hello world',
          },
        },
      );

      expect(slack.chat.postMessage).toHaveBeenCalledWith(
        createBaseMessage('Hello world'),
      );
    });
  });

  describe('when throttling is not configured', () => {
    it('should use default concurrency limit of 10 per minute', async () => {
      const slack = new WebClient();

      const processor = SlackNotificationProcessor.fromConfig(config, {
        auth,
        logger,
        catalog: catalogServiceMock({
          entities: DEFAULT_ENTITIES_RESPONSE.items,
        }),
        metrics,
        slack,
      })[0];

      await processor.processOptions({
        recipients: { type: 'entity', entityRef: 'group:default/mock' },
        payload: { title: 'notification' },
      });

      expect(slack.chat.postMessage).toHaveBeenCalled();
      expect(throttleConfigs).toEqual([
        {
          limit: 10,
          interval: durationToMilliseconds({ minutes: 1 }),
        },
      ]);
    });
  });

  describe('when throttling is configured', () => {
    it('should use custom concurrency limit and interval values', async () => {
      const slack = new WebClient();
      const throttlingConfig = mockServices.rootConfig({
        data: {
          app: {
            baseUrl: 'https://example.org',
          },
          notifications: {
            processors: {
              slack: [
                {
                  token: 'mock-token',
                  concurrencyLimit: 5,
                  throttleInterval: 'PT30S',
                },
              ],
            },
          },
        },
      });

      const processor = SlackNotificationProcessor.fromConfig(
        throttlingConfig,
        {
          auth,
          logger,
          catalog: catalogServiceMock({
            entities: DEFAULT_ENTITIES_RESPONSE.items,
          }),
          metrics,
          slack,
        },
      )[0];

      await processor.processOptions({
        recipients: { type: 'entity', entityRef: 'group:default/mock' },
        payload: { title: 'notification' },
      });

      expect(slack.chat.postMessage).toHaveBeenCalled();
      expect(throttleConfigs).toEqual([
        {
          limit: 5,
          interval: durationToMilliseconds({ seconds: 30 }),
        },
      ]);
    });
  });

  describe('scope-based message updates', () => {
    function createMockDb() {
      const store = new Map<
        string,
        {
          origin: string;
          scope: string;
          channel: string;
          ts: string;
          created_at: Date;
        }
      >();

      function storeKey(origin: string, scope: string, channel: string) {
        return `${origin}:${scope}:${channel}`;
      }

      // Each call to db() creates a fresh query builder that tracks its own
      // chained .where()/.insert() arguments, avoiding cross-call interference.
      function createQueryBuilder(): any {
        let lastWhereArgs: any;
        let lastInsertRow: any;
        const qb: any = {
          where: jest.fn().mockImplementation((args: any) => {
            lastWhereArgs = args;
            return qb;
          }),
          first: jest.fn().mockImplementation(() => {
            if (lastWhereArgs) {
              const key = storeKey(
                lastWhereArgs.origin,
                lastWhereArgs.scope,
                lastWhereArgs.channel,
              );
              return Promise.resolve(store.get(key));
            }
            return Promise.resolve(undefined);
          }),
          insert: jest.fn().mockImplementation((row: any) => {
            lastInsertRow = row;
            store.set(storeKey(row.origin, row.scope, row.channel), row);
            return qb;
          }),
          onConflict: jest.fn().mockReturnThis(),
          merge: jest.fn().mockImplementation((row: any) => {
            if (lastInsertRow) {
              const key = storeKey(
                lastInsertRow.origin,
                lastInsertRow.scope,
                lastInsertRow.channel,
              );
              const existing = store.get(key);
              if (existing) {
                store.set(key, { ...existing, ...row });
              }
            }
            return Promise.resolve();
          }),
          delete: jest.fn().mockResolvedValue(0),
        };
        return qb;
      }

      const db = jest
        .fn()
        .mockImplementation(() => createQueryBuilder()) as unknown as Knex;
      (db as any).fn = { now: jest.fn().mockReturnValue(new Date()) };
      return { db, store, storeKey };
    }

    function createProcessorWithDb(
      slack: WebClient,
      db: Knex,
    ): SlackNotificationProcessor {
      const processor = SlackNotificationProcessor.fromConfig(config, {
        auth,
        logger,
        catalog: catalogServiceMock({
          entities: DEFAULT_ENTITIES_RESPONSE.items,
        }),
        metrics,
        slack,
      })[0];
      processor.setDatabase(db);
      return processor;
    }

    it('should store the message timestamp after initial scoped send', async () => {
      const slack = new WebClient();
      const { db, store, storeKey } = createMockDb();
      const processor = createProcessorWithDb(slack, db);

      await processor.postProcess(
        {
          origin: 'plugin',
          id: '1234',
          user: 'user:default/mock',
          created: new Date(),
          payload: {
            title: 'notification',
            scope: 'deployment-failure/my-service/42',
          },
        },
        {
          recipients: { type: 'entity', entityRef: 'user:default/mock' },
          payload: {
            title: 'notification',
            scope: 'deployment-failure/my-service/42',
          },
        },
      );

      expect(slack.chat.postMessage).toHaveBeenCalledTimes(1);
      expect(store.size).toBe(1);
      const key = storeKey(
        'plugin',
        'deployment-failure/my-service/42',
        'U12345678',
      );
      expect(store.get(key)).toEqual(
        expect.objectContaining({
          origin: 'plugin',
          scope: 'deployment-failure/my-service/42',
          channel: 'U12345678',
          ts: '1234567890.123456',
        }),
      );
    });

    it('should use chat.update when the notification has been updated and a stored ts exists', async () => {
      const slack = new WebClient();
      const { db, store, storeKey } = createMockDb();

      // Pre-populate the store with a previously sent message.
      store.set(
        storeKey('plugin', 'deployment-failure/my-service/42', 'U12345678'),
        {
          origin: 'plugin',
          scope: 'deployment-failure/my-service/42',
          channel: 'U12345678',
          ts: '1111111111.111111',
          created_at: new Date(),
        },
      );

      const processor = createProcessorWithDb(slack, db);

      await processor.postProcess(
        {
          origin: 'plugin',
          id: '1234',
          user: 'user:default/mock',
          created: new Date(),
          updated: new Date(),
          payload: {
            title: 'notification',
            description: 'Updated with analysis',
            scope: 'deployment-failure/my-service/42',
          },
        },
        {
          recipients: { type: 'entity', entityRef: 'user:default/mock' },
          payload: {
            title: 'notification',
            description: 'Updated with analysis',
            scope: 'deployment-failure/my-service/42',
          },
        },
      );

      expect(slack.chat.postMessage).not.toHaveBeenCalled();
      expect(slack.chat.update).toHaveBeenCalledTimes(1);

      // Verify chat.update receives only the fields it supports (channel, ts,
      // text, blocks, attachments) and not the full ChatPostMessageArguments.
      const updateArgs = (slack.chat.update as jest.Mock).mock.calls[0][0];
      const updateKeys = Object.keys(updateArgs).sort();
      expect(updateKeys).toEqual(['attachments', 'channel', 'text', 'ts']);
      expect(updateArgs.channel).toBe('U12345678');
      expect(updateArgs.ts).toBe('1111111111.111111');
    });

    it('should fall back to chat.postMessage when notification is updated but no stored ts exists', async () => {
      const slack = new WebClient();
      const { db } = createMockDb();
      const processor = createProcessorWithDb(slack, db);

      await processor.postProcess(
        {
          origin: 'plugin',
          id: '1234',
          user: 'user:default/mock',
          created: new Date(),
          updated: new Date(),
          payload: {
            title: 'notification',
            scope: 'deployment-failure/my-service/42',
          },
        },
        {
          recipients: { type: 'entity', entityRef: 'user:default/mock' },
          payload: {
            title: 'notification',
            scope: 'deployment-failure/my-service/42',
          },
        },
      );

      // Should fall back to postMessage since there is no stored ts.
      expect(slack.chat.update).not.toHaveBeenCalled();
      expect(slack.chat.postMessage).toHaveBeenCalledTimes(1);
    });

    it('should not interact with the database for non-scoped notifications', async () => {
      const slack = new WebClient();
      const { db } = createMockDb();
      const processor = createProcessorWithDb(slack, db);

      await processor.postProcess(
        {
          origin: 'plugin',
          id: '1234',
          user: 'user:default/mock',
          created: new Date(),
          payload: {
            title: 'notification',
          },
        },
        {
          recipients: { type: 'entity', entityRef: 'user:default/mock' },
          payload: { title: 'notification' },
        },
      );

      expect(slack.chat.postMessage).toHaveBeenCalledTimes(1);
      // The db function should not have been called since there is no scope.
      expect(db).not.toHaveBeenCalled();
    });

    it('should work without a database (graceful degradation)', async () => {
      const slack = new WebClient();

      // No db set — the processor should still send messages normally.
      const processor = SlackNotificationProcessor.fromConfig(config, {
        auth,
        logger,
        catalog: catalogServiceMock({
          entities: DEFAULT_ENTITIES_RESPONSE.items,
        }),
        metrics,
        slack,
      })[0];

      await processor.postProcess(
        {
          origin: 'plugin',
          id: '1234',
          user: 'user:default/mock',
          created: new Date(),
          payload: {
            title: 'notification',
            scope: 'deployment-failure/my-service/42',
          },
        },
        {
          recipients: { type: 'entity', entityRef: 'user:default/mock' },
          payload: {
            title: 'notification',
            scope: 'deployment-failure/my-service/42',
          },
        },
      );

      expect(slack.chat.postMessage).toHaveBeenCalledTimes(1);
      expect(slack.chat.update).not.toHaveBeenCalled();
    });

    it('should handle concurrent postProcess calls with different scopes correctly', async () => {
      const slack = new WebClient();
      const { db, store, storeKey } = createMockDb();

      // Pre-populate stored timestamps for both scopes.
      store.set(storeKey('plugin', 'scope-a', 'U12345678'), {
        origin: 'plugin',
        scope: 'scope-a',
        channel: 'U12345678',
        ts: '1111111111.111111',
        created_at: new Date(),
      });
      store.set(storeKey('plugin', 'scope-b', 'U12345678'), {
        origin: 'plugin',
        scope: 'scope-b',
        channel: 'U12345678',
        ts: '2222222222.222222',
        created_at: new Date(),
      });

      const processor = createProcessorWithDb(slack, db);

      // Fire both postProcess calls concurrently with different scopes.
      await Promise.all([
        processor.postProcess(
          {
            origin: 'plugin',
            id: '1',
            user: 'user:default/mock',
            created: new Date(),
            updated: new Date(),
            payload: { title: 'A', scope: 'scope-a' },
          },
          {
            recipients: { type: 'entity', entityRef: 'user:default/mock' },
            payload: { title: 'A', scope: 'scope-a' },
          },
        ),
        processor.postProcess(
          {
            origin: 'plugin',
            id: '2',
            user: 'user:default/mock',
            created: new Date(),
            updated: new Date(),
            payload: { title: 'B', scope: 'scope-b' },
          },
          {
            recipients: { type: 'entity', entityRef: 'user:default/mock' },
            payload: { title: 'B', scope: 'scope-b' },
          },
        ),
      ]);

      // Both should use chat.update, not postMessage.
      expect(slack.chat.postMessage).not.toHaveBeenCalled();
      expect(slack.chat.update).toHaveBeenCalledTimes(2);

      // Each update should use the correct ts for its scope.
      const updateCalls = (slack.chat.update as jest.Mock).mock.calls;
      const timestamps = updateCalls.map((call: any[]) => call[0].ts).sort();
      expect(timestamps).toEqual(['1111111111.111111', '2222222222.222222']);
    });

    it('should not collide across different origins with the same scope', async () => {
      const slack = new WebClient();
      const { db, store, storeKey } = createMockDb();

      // Pre-populate a stored timestamp for origin-a only.
      store.set(storeKey('origin-a', 'shared-scope', 'U12345678'), {
        origin: 'origin-a',
        scope: 'shared-scope',
        channel: 'U12345678',
        ts: '1111111111.111111',
        created_at: new Date(),
      });

      const processor = createProcessorWithDb(slack, db);

      // Send an update from origin-b with the same scope — should NOT find
      // the stored ts from origin-a, and should fall back to postMessage.
      await processor.postProcess(
        {
          origin: 'origin-b',
          id: '1',
          user: 'user:default/mock',
          created: new Date(),
          updated: new Date(),
          payload: { title: 'From B', scope: 'shared-scope' },
        },
        {
          recipients: { type: 'entity', entityRef: 'user:default/mock' },
          payload: { title: 'From B', scope: 'shared-scope' },
        },
      );

      expect(slack.chat.update).not.toHaveBeenCalled();
      expect(slack.chat.postMessage).toHaveBeenCalledTimes(1);
    });
  });
});
