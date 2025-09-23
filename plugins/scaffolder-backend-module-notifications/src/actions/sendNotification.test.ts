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

describe('notification:send', () => {
  const notificationService: jest.Mocked<NotificationService> = {
    send: jest.fn(),
  };

  let action: TemplateAction<any, any, 'v2'>;

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

  it('should send broadcast notification', async () => {
    const ctx = Object.assign({}, mockContext, {
      input: { recipients: 'broadcast', title: 'Test notification' },
    });
    await action.handler(ctx);
    expect(notificationService.send).toHaveBeenCalledWith({
      recipients: { type: 'broadcast' },
      payload: {
        title: 'Test notification',
      },
    });
  });

  it('should send entity notification with deprecated recipients', async () => {
    const ctx = Object.assign({}, mockContext, {
      input: {
        recipients: 'entity',
        entityRefs: ['user:default/john.doe'],
        title: 'Test notification',
      },
    });
    await action.handler(ctx);
    expect(notificationService.send).toHaveBeenCalledWith({
      recipients: {
        type: 'entities',
        entityRefs: ['user:default/john.doe'],
        excludedEntityRefs: [],
      },
      payload: {
        title: 'Test notification',
      },
    });
  });

  it('should send entity notification', async () => {
    const ctx = Object.assign({}, mockContext, {
      input: {
        recipients: 'entities',
        entityRefs: ['user:default/john.doe'],
        title: 'Test notification',
      },
    });
    await action.handler(ctx);
    expect(notificationService.send).toHaveBeenCalledWith({
      recipients: {
        type: 'entities',
        entityRefs: ['user:default/john.doe'],
        excludedEntityRefs: [],
      },
      payload: {
        title: 'Test notification',
      },
    });
  });

  it('should exclude entity references', async () => {
    const ctx = Object.assign({}, mockContext, {
      input: {
        recipients: 'entities',
        entityRefs: ['user:default/john.doe'],
        excludedEntityRefs: ['user:default/jane.doe'],
        title: 'Test notification',
      },
      user: { ref: 'user:default/jane.doe' },
    });
    await action.handler(ctx);
    expect(notificationService.send).toHaveBeenCalledWith({
      recipients: {
        type: 'entities',
        entityRefs: ['user:default/john.doe'],
        excludedEntityRefs: ['user:default/jane.doe'],
      },
      payload: {
        title: 'Test notification',
      },
    });
  });

  it('should exclude current user', async () => {
    const ctx = Object.assign({}, mockContext, {
      input: {
        recipients: 'entities',
        entityRefs: ['user:default/john.doe'],
        title: 'Test notification',
        excludeCurrentUser: true,
      },
      user: { ref: 'user:default/jane.doe' },
    });
    await action.handler(ctx);
    expect(notificationService.send).toHaveBeenCalledWith({
      recipients: {
        type: 'entities',
        entityRefs: ['user:default/john.doe'],
        excludedEntityRefs: ['user:default/jane.doe'],
      },
      payload: {
        title: 'Test notification',
      },
    });
  });

  it('should throw error if entity refs are missing', async () => {
    const ctx = Object.assign({}, mockContext, {
      input: {
        recipients: 'entities',
        title: 'Test notification',
      },
    });
    await expect(action.handler(ctx)).rejects.toThrow();
  });

  it('should not throw error if entity refs are missing but optional is true', async () => {
    const ctx = Object.assign({}, mockContext, {
      input: {
        recipients: 'entities',
        title: 'Test notification',
        optional: true,
      },
    });
    await expect(action.handler(ctx)).resolves.not.toThrow();
    expect(notificationService.send).not.toHaveBeenCalled();
  });
});
