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
  NotificationProcessor,
  NotificationType,
} from '@backstage/plugin-notifications-node';
import {
  NewNotificationSignal,
  Notification,
} from '@backstage/plugin-notifications-common';
import { NotificationsStore } from '../database';
import { SignalsService } from '@backstage/plugin-signals-node';

/** @internal */
export class WebNotificationProcessor implements NotificationProcessor {
  constructor(
    private readonly store: NotificationsStore,
    private readonly signals: SignalsService,
  ) {}

  getName(): string {
    return 'Web';
  }

  private async sendUserNotifications(notification: Notification) {
    const { user, origin, payload } = notification;
    const { scope } = payload;
    if (!user) {
      throw new Error('Cannot send user notification without user');
    }

    let existingNotification;
    if (scope) {
      existingNotification = await this.store.getExistingScopeNotification({
        user,
        scope,
        origin,
      });
    }

    let ret = notification;
    if (existingNotification) {
      const restored = await this.store.restoreExistingNotification({
        id: existingNotification.id,
        notification,
      });
      ret = restored ?? notification;
    } else {
      await this.store.saveNotification(notification);
    }

    await this.signals.publish<NewNotificationSignal>({
      recipients: { type: 'user', entityRef: [user] },
      message: {
        action: 'new_notification',
        notification_id: ret.id,
      },
      channel: 'notifications',
    });
  }

  private async sendBroadcastNotification(notification: Notification) {
    const { origin, payload } = notification;
    const { scope } = payload;
    let existingNotification;
    if (scope) {
      existingNotification = await this.store.getExistingScopeBroadcast({
        scope,
        origin,
      });
    }

    let ret = notification;
    if (existingNotification) {
      const restored = await this.store.restoreExistingNotification({
        id: existingNotification.id,
        notification,
      });
      ret = restored ?? notification;
    } else {
      await this.store.saveBroadcast(notification);
    }

    await this.signals.publish<NewNotificationSignal>({
      recipients: { type: 'broadcast' },
      message: {
        action: 'new_notification',
        notification_id: ret.id,
      },
      channel: 'notifications',
    });
  }

  async send(
    notification: Notification,
    type: NotificationType,
  ): Promise<void> {
    if (type === 'user') {
      await this.sendUserNotifications(notification);
    } else {
      await this.sendBroadcastNotification(notification);
    }
  }
}
