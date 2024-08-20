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
import { createSendNotificationAction } from './sendNotification';
import { NotificationService } from '@backstage/plugin-notifications-node';
import { TemplateAction } from '@backstage/plugin-scaffolder-node';
import { createMockActionContext } from '@backstage/plugin-scaffolder-node-test-utils';
import { examples } from './sendNotification.examples';
import yaml from 'yaml';

describe('notification:send', () => {
  const notificationService: jest.Mocked<NotificationService> = {
    send: jest.fn(),
  };

  let action: TemplateAction<any>;

  beforeEach(() => {
    jest.resetAllMocks();
    action = createSendNotificationAction({
      notifications: notificationService,
    });
  });

  const mockContext = createMockActionContext({
    input: {
      recipients: 'broadcast',
      title: 'Test notification',
    },
  });

  it(`should ${examples[0].description}`, async () => {
    const input = yaml.parse(examples[0].example).steps[0].input;
    const ctx = Object.assign({}, mockContext, {
      input: input,
    });
    await action.handler(ctx);
    expect(notificationService.send).toHaveBeenCalledWith({
      recipients: { type: 'broadcast' },
      payload: {
        title: 'Test notification',
      },
    });
  });

  it(`should ${examples[1].description}`, async () => {
    const input = yaml.parse(examples[1].example).steps[0].input;
    const ctx = Object.assign({}, mockContext, {
      input: input,
    });
    await action.handler(ctx);
    expect(notificationService.send).toHaveBeenCalledWith({
      recipients: {
        entityRef: ['entity:component:1'],
        type: 'entity',
      },
      payload: {
        description: 'A security update has been applied. Please review.',
        title: 'Security Update',
        link: 'https://example.com/security/update',
        severity: 'high',
        scope: 'internal',
      },
    });
  });

  it(`should ${examples[2].description}`, async () => {
    const input = yaml.parse(examples[2].example).steps[0].input;
    const ctx = Object.assign({}, mockContext, {
      input: input,
    });
    await action.handler(ctx);
    expect(notificationService.send).toHaveBeenCalledWith({
      recipients: {
        type: 'entity',
        entityRef: ['entity:component:1'],
      },
      payload: {
        description: 'Here is your weekly update.',
        link: undefined,
        severity: 'low',
        scope: undefined,
        title: 'Weekly Update',
      },
    });
  });

  it(`should ${examples[3].description}`, async () => {
    const input = yaml.parse(examples[3].example).steps[0].input;
    const ctx = Object.assign({}, mockContext, {
      input: input,
    });
    await action.handler(ctx);
    expect(notificationService.send).toHaveBeenCalledWith({
      recipients: { type: 'broadcast' },
      payload: {
        description: 'Version 2.0.0 is now available. Upgrade now!',
        link: undefined,
        severity: 'normal',
        scope: 'public',
        title: 'New Release Available',
      },
    });
  });

  it(`should ${examples[4].description}`, async () => {
    const input = yaml.parse(examples[4].example).steps[0].input;
    const ctx = Object.assign({}, mockContext, {
      input: input,
    });
    await action.handler(ctx);
    expect(notificationService.send).toHaveBeenCalledWith({
      recipients: {
        type: 'entity',
        entityRef: ['entity:component:1'],
      },
      payload: {
        description:
          'A critical bug has been identified. Immediate action required.',
        link: undefined,
        scope: 'internal',
        severity: 'critical',
        title: 'Critical Bug Found',
      },
    });
  });

  it(`should ${examples[5].description}`, async () => {
    const input = yaml.parse(examples[5].example).steps[0].input;
    const ctx = Object.assign({}, mockContext, {
      input: input,
    });
    await action.handler(ctx);
    expect(notificationService.send).toHaveBeenCalledWith({
      recipients: {
        type: 'broadcast',
      },
      payload: {
        description: 'Server maintenance will occur tonight at 11 PM.',
        link: undefined,
        scope: 'internal',
        severity: 'normal',
        title: 'Server Maintenance Scheduled',
      },
    });
  });

  it(`should ${examples[6].description}`, async () => {
    const input = yaml.parse(examples[6].example).steps[0].input;
    const ctx = Object.assign({}, mockContext, {
      input: input,
    });
    await action.handler(ctx);
    expect(notificationService.send).toHaveBeenCalledWith({
      recipients: { type: 'broadcast' },
      payload: {
        description: 'New features have been deployed. Explore them now!',
        link: undefined,
        scope: undefined,
        severity: 'normal',
        title: 'New Feature Deployment',
      },
    });
  });

  it(`should ${examples[7].description}`, async () => {
    const input = yaml.parse(examples[7].example).steps[0].input;
    const ctx = Object.assign({}, mockContext, {
      input: input,
    });
    await action.handler(ctx);
    expect(notificationService.send).toHaveBeenCalledWith({
      recipients: { type: 'broadcast' },
      payload: {
        description: undefined,
        link: undefined,
        scope: 'internal',
        severity: 'low',
        title: 'Holiday Office Closure',
      },
    });
  });

  it(`should ${examples[8].description}`, async () => {
    const input = yaml.parse(examples[8].example).steps[0].input;
    const ctx = Object.assign({}, mockContext, {
      input: input,
    });
    await action.handler(ctx);
    expect(notificationService.send).toHaveBeenCalledWith({
      recipients: { type: 'broadcast' },
      payload: {
        description:
          "Don't forget, the weekly meeting is scheduled for tomorrow.",
        link: undefined,
        scope: 'internal',
        severity: undefined,
        title: 'Reminder: Weekly Meeting Tomorrow',
      },
    });
  });

  it(`should ${examples[9].description}`, async () => {
    const input = yaml.parse(examples[9].example).steps[0].input;
    const ctx = Object.assign({}, mockContext, {
      input: input,
    });
    await action.handler(ctx);
    expect(notificationService.send).toHaveBeenCalledWith({
      recipients: { type: 'broadcast' },
      payload: {
        title: 'Important Announcement',
        description:
          'Please read the latest announcement regarding the upcoming changes.',
        link: undefined,
        scope: undefined,
        severity: 'high',
      },
    });
  });

  it(`should ${examples[10].description}`, async () => {
    const input = yaml.parse(examples[10].example).steps[0].input;
    const ctx = Object.assign({}, mockContext, {
      input: input,
    });
    await action.handler(ctx);
    expect(notificationService.send).toHaveBeenCalledWith({
      recipients: { type: 'broadcast' },
      payload: {
        title: 'Broadcast Notification',
        description: 'This is a broadcast notification',
        link: undefined,
        scope: undefined,
        severity: 'low',
      },
    });
  });

  it(`should ${examples[11].description}`, async () => {
    const input = yaml.parse(examples[11].example).steps[0].input;
    const ctx = Object.assign({}, mockContext, {
      input: input,
    });
    await action.handler(ctx);
    expect(notificationService.send).toHaveBeenCalledWith({
      recipients: {
        type: 'entity',
        entityRef: ['entity:service1'],
      },
      payload: {
        title: 'Entity Notification',
        description: 'This is a notification for entity service1',
        link: undefined,
        scope: undefined,
        severity: 'normal',
      },
    });
  });
});
