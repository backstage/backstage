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

import { mockServices } from '@backstage/backend-test-utils';
import { NotificationsEmailProcessor } from './NotificationsEmailProcessor';
import { ConfigReader } from '@backstage/config';
import { JsonArray } from '@backstage/types';
import { createTransport } from 'nodemailer';
import { catalogServiceMock } from '@backstage/plugin-catalog-node/testUtils';
import { Entity } from '@backstage/catalog-model';

const sendmailMock = jest.fn();
const mockTransport = {
  sendMail: sendmailMock,
};
jest.mock('nodemailer', () => ({
  ...jest.requireActual('nodemailer'),
  createTransport: jest.fn(),
}));

const DEFAULT_ENTITIES_RESPONSE = {
  items: [
    {
      kind: 'User',
      metadata: {
        name: 'mock',
        namespace: 'default',
      },
      spec: {
        profile: {
          email: 'mock@backstage.io',
        },
      },
    } as unknown as Entity,
  ],
};

const DEFAULT_SENDMAIL_CONFIG = {
  app: {
    baseUrl: 'https://example.org',
  },
  notifications: {
    processors: {
      email: {
        transportConfig: {
          transport: 'sendmail',
          path: '/usr/local/bin/sendmail',
        },
        sender: 'backstage@backstage.io',
      },
    },
  },
};

describe('NotificationsEmailProcessor', () => {
  const logger = mockServices.logger.mock();
  const auth = mockServices.auth();

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should create smtp transport', async () => {
    const processor = new NotificationsEmailProcessor(
      logger,
      new ConfigReader({
        app: {
          baseUrl: 'http://localhost:3000',
          externalBaseUrl: 'https://example.org',
        },
        notifications: {
          processors: {
            email: {
              transportConfig: {
                transport: 'smtp',
                hostname: 'localhost',
                port: 465,
                secure: true,
                requireTls: false,
              },
              sender: 'backstage@backstage.io',
            },
          },
        },
      }),
      catalogServiceMock(),
      auth,
    );

    await processor.postProcess(
      {
        origin: 'plugin',
        id: '1234',
        user: 'user:default/mock',
        created: new Date(),
        payload: { title: 'notification' },
      },
      {
        recipients: { type: 'entity', entityRef: 'user:default/mock' },
        payload: { title: 'notification' },
      },
    );

    expect(processor).toBeInstanceOf(NotificationsEmailProcessor);
    expect(createTransport as jest.Mock).toHaveBeenCalledWith({
      host: 'localhost',
      port: 465,
      requireTLS: false,
      secure: true,
    });
  });

  it('should create ses transport', async () => {
    const processor = new NotificationsEmailProcessor(
      logger,
      new ConfigReader({
        app: {
          baseUrl: 'http://localhost:3000',
          externalBaseUrl: 'https://example.org',
        },
        notifications: {
          processors: {
            email: {
              transportConfig: {
                transport: 'ses',
                region: 'us-west-2',
              },
              sender: 'backstage@backstage.io',
            },
          },
        },
      }),
      catalogServiceMock(),
      auth,
    );

    await processor.postProcess(
      {
        origin: 'plugin',
        id: '1234',
        user: 'user:default/mock',
        created: new Date(),
        payload: { title: 'notification' },
      },
      {
        recipients: { type: 'entity', entityRef: 'user:default/mock' },
        payload: { title: 'notification' },
      },
    );

    expect(processor).toBeInstanceOf(NotificationsEmailProcessor);
    expect(createTransport as jest.Mock).toHaveBeenCalledWith({
      SES: expect.anything(),
    });
  });

  it('should create sendmail transport', async () => {
    const processor = new NotificationsEmailProcessor(
      logger,
      new ConfigReader({
        app: {
          baseUrl: 'http://localhost:3000',
          externalBaseUrl: 'https://example.org',
        },
        notifications: {
          processors: {
            email: {
              transportConfig: {
                transport: 'sendmail',
                path: '/usr/local/bin/sendmail',
              },
              sender: 'backstage@backstage.io',
            },
          },
        },
      }),
      catalogServiceMock(),
      auth,
    );

    await processor.postProcess(
      {
        origin: 'plugin',
        id: '1234',
        user: 'user:default/mock',
        created: new Date(),
        payload: { title: 'notification' },
      },
      {
        recipients: { type: 'entity', entityRef: 'user:default/mock' },
        payload: { title: 'notification' },
      },
    );

    expect(processor).toBeInstanceOf(NotificationsEmailProcessor);
    expect(createTransport as jest.Mock).toHaveBeenCalledWith({
      sendmail: true,
      path: '/usr/local/bin/sendmail',
      newline: 'unix',
    });
  });

  it('should send user email', async () => {
    (createTransport as jest.Mock).mockReturnValue(mockTransport);
    const processor = new NotificationsEmailProcessor(
      logger,
      mockServices.rootConfig({ data: DEFAULT_SENDMAIL_CONFIG }),
      catalogServiceMock({ entities: [DEFAULT_ENTITIES_RESPONSE.items[0]] }),
      auth,
    );

    await processor.postProcess(
      {
        origin: 'plugin',
        id: '1234',
        user: 'user:default/mock',
        created: new Date(),
        payload: { title: 'notification' },
      },
      {
        recipients: { type: 'entity', entityRef: 'user:default/mock' },
        payload: { title: 'notification' },
      },
    );

    expect(sendmailMock).toHaveBeenCalledWith({
      from: 'backstage@backstage.io',
      html: '<p><a href="https://example.org/notifications">https://example.org/notifications</a></p>',
      replyTo: undefined,
      subject: 'notification',
      text: 'https://example.org/notifications',
      to: 'mock@backstage.io',
    });
  });

  it('should send email to all', async () => {
    (createTransport as jest.Mock).mockReturnValue(mockTransport);
    const processor = new NotificationsEmailProcessor(
      logger,
      mockServices.rootConfig({
        data: {
          ...DEFAULT_SENDMAIL_CONFIG,
          notifications: {
            processors: {
              email: {
                ...DEFAULT_SENDMAIL_CONFIG.notifications.processors.email,
                broadcastConfig: {
                  receiver: 'users',
                },
              },
            },
          },
        },
      }),
      catalogServiceMock({ entities: DEFAULT_ENTITIES_RESPONSE.items }),
      auth,
    );

    await processor.postProcess(
      {
        origin: 'plugin',
        id: '1234',
        user: null,
        created: new Date(),
        payload: { title: 'notification' },
      },
      {
        recipients: { type: 'broadcast' },
        payload: { title: 'notification' },
      },
    );

    expect(sendmailMock).toHaveBeenCalledWith({
      from: 'backstage@backstage.io',
      html: '<p><a href="https://example.org/notifications">https://example.org/notifications</a></p>',
      replyTo: undefined,
      subject: 'notification',
      text: 'https://example.org/notifications',
      to: 'mock@backstage.io',
    });
  });

  it('should send email to configured addresses', async () => {
    (createTransport as jest.Mock).mockReturnValue(mockTransport);
    const processor = new NotificationsEmailProcessor(
      logger,
      mockServices.rootConfig({
        data: {
          ...DEFAULT_SENDMAIL_CONFIG,
          notifications: {
            processors: {
              email: {
                ...DEFAULT_SENDMAIL_CONFIG.notifications.processors.email,
                broadcastConfig: {
                  receiver: 'config',
                  receiverEmails: ['broadcast@backstage.io'] as JsonArray,
                },
              },
            },
          },
        },
      }),
      catalogServiceMock({ entities: DEFAULT_ENTITIES_RESPONSE.items }),
      auth,
    );

    await processor.postProcess(
      {
        origin: 'plugin',
        id: '1234',
        user: null,
        created: new Date(),
        payload: { title: 'notification' },
      },
      {
        recipients: { type: 'broadcast' },
        payload: { title: 'notification' },
      },
    );

    expect(sendmailMock).toHaveBeenCalledWith({
      from: 'backstage@backstage.io',
      html: '<p><a href="https://example.org/notifications">https://example.org/notifications</a></p>',
      replyTo: undefined,
      subject: 'notification',
      text: 'https://example.org/notifications',
      to: 'broadcast@backstage.io',
    });
  });

  it('should send email with relative link to given address', async () => {
    (createTransport as jest.Mock).mockReturnValue(mockTransport);
    const processor = new NotificationsEmailProcessor(
      logger,
      mockServices.rootConfig({
        data: DEFAULT_SENDMAIL_CONFIG,
      }),
      catalogServiceMock({ entities: DEFAULT_ENTITIES_RESPONSE.items }),
      auth,
    );

    await processor.postProcess(
      {
        origin: 'plugin',
        id: '1234',
        user: 'user:default/mock',
        created: new Date(),
        payload: {
          title: 'notification',
          link: 'catalog/user/default/john.doe',
        },
      },
      {
        recipients: { type: 'entity', entityRef: 'user:default/mock' },
        payload: { title: 'notification' },
      },
    );

    expect(sendmailMock).toHaveBeenCalledWith({
      from: 'backstage@backstage.io',
      html: '<p><a href="https://example.org/catalog/user/default/john.doe">https://example.org/catalog/user/default/john.doe</a></p>',
      replyTo: undefined,
      subject: 'notification',
      text: 'https://example.org/catalog/user/default/john.doe',
      to: 'mock@backstage.io',
    });

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

    expect(sendmailMock).toHaveBeenCalledWith({
      from: 'backstage@backstage.io',
      html: '<p><a href="https://example.org/catalog/user/default/jane.doe">https://example.org/catalog/user/default/jane.doe</a></p>',
      replyTo: undefined,
      subject: 'notification',
      text: 'https://example.org/catalog/user/default/jane.doe',
      to: 'mock@backstage.io',
    });
  });

  it('should send email with absolute link to given address', async () => {
    (createTransport as jest.Mock).mockReturnValue(mockTransport);
    const processor = new NotificationsEmailProcessor(
      logger,
      mockServices.rootConfig({
        data: DEFAULT_SENDMAIL_CONFIG,
      }),
      catalogServiceMock({ entities: DEFAULT_ENTITIES_RESPONSE.items }),
      auth,
    );

    await processor.postProcess(
      {
        origin: 'plugin',
        id: '1234',
        user: 'user:default/mock',
        created: new Date(),
        payload: {
          title: 'notification',
          link: 'https://backstage.io',
        },
      },
      {
        recipients: { type: 'entity', entityRef: 'user:default/mock' },
        payload: { title: 'notification' },
      },
    );

    expect(sendmailMock).toHaveBeenCalledWith({
      from: 'backstage@backstage.io',
      html: '<p><a href="https://backstage.io/">https://backstage.io/</a></p>',
      replyTo: undefined,
      subject: 'notification',
      text: 'https://backstage.io/',
      to: 'mock@backstage.io',
    });
  });
});
