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
import { SlackNotificationProcessor } from './SlackNotificationProcessor';
import { catalogServiceMock } from '@backstage/plugin-catalog-node/testUtils';
import { WebClient } from '@slack/web-api';
import { Entity } from '@backstage/catalog-model';

jest.mock('@slack/web-api', () => {
  const mockSlack = {
    chat: {
      postMessage: jest.fn(() => ({
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
  });

  it('should send a notification to a group', async () => {
    const slack = new WebClient();

    const processor = SlackNotificationProcessor.fromConfig(config, {
      auth,
      logger,
      catalog: catalogServiceMock({
        entities: DEFAULT_ENTITIES_RESPONSE.items,
      }),
      slack,
    })[0];

    await processor.processOptions({
      recipients: { type: 'entities', entityRefs: ['group:default/mock'] },
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

  describe('when a user notification is sent directly', () => {
    it('should send a notification to a user', async () => {
      const slack = new WebClient();

      const processor = SlackNotificationProcessor.fromConfig(config, {
        auth,
        logger,
        catalog: catalogServiceMock({
          entities: DEFAULT_ENTITIES_RESPONSE.items,
        }),
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
          recipients: { type: 'entities', entityRefs: ['user:default/mock'] },
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
          recipients: { type: 'entities', entityRefs: ['group:default/group'] },
          payload: { title: 'notification' },
        },
      );

      expect(slack.chat.postMessage).not.toHaveBeenCalled();
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

  describe('when slack.com/bot-notify annotation is missing', () => {
    it('should not send notification to a group without annotation', async () => {
      const slack = new WebClient();

      const processor = SlackNotificationProcessor.fromConfig(config, {
        auth,
        logger,
        catalog: catalogServiceMock({
          entities: DEFAULT_ENTITIES_RESPONSE.items,
        }),
        slack,
      })[0];

      await processor.processOptions({
        recipients: {
          type: 'entities',
          entityRefs: ['group:default/mock-without-slack-annotation'],
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
            type: 'entities',
            entityRefs: ['user:default/mock-without-slack-annotation'],
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
            type: 'entities',
            entityRefs: ['user:default/mock-without-slack-annotation'],
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
            type: 'entities',
            entityRefs: ['user:default/mock-without-slack-annotation'],
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
          recipients: { type: 'entities', entityRefs: ['user:default/mock'] },
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
          recipients: { type: 'entities', entityRefs: ['user:default/mock'] },
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
});
