/*
 * Copyright 2023 The Backstage Authors
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
import { TokenManager } from '@backstage/backend-common';
import { NotificationService } from './NotificationService';
import { DiscoveryService } from '@backstage/backend-plugin-api';
import { NotificationPayload } from '@backstage/plugin-notifications-common';

/** @public */
export type NotificationServiceOptions = {
  discovery: DiscoveryService;
  tokenManager: TokenManager;
  pluginId: string;
};

/** @public */
export type NotificationRecipients = {
  type: 'entity';
  entityRef: string | string[];
};

// TODO: Support for broadcast messages
//  | { type: 'broadcast' };

/** @public */
export type NotificationSendOptions = {
  recipients: NotificationRecipients;
  payload: NotificationPayload;
};

/** @public */
export class DefaultNotificationService implements NotificationService {
  private constructor(
    private readonly discovery: DiscoveryService,
    private readonly tokenManager: TokenManager,
    private readonly pluginId: string,
  ) {}

  static create({
    tokenManager,
    discovery,
    pluginId,
  }: NotificationServiceOptions): DefaultNotificationService {
    return new DefaultNotificationService(discovery, tokenManager, pluginId);
  }

  async send(notification: NotificationSendOptions): Promise<void> {
    try {
      const baseUrl = await this.discovery.getBaseUrl('notifications');
      const { token } = await this.tokenManager.getToken();
      const response = await fetch(`${baseUrl}/`, {
        method: 'POST',
        body: JSON.stringify({
          ...notification,
          // TODO: Should retrieve this in the backend from service auth instead
          origin: `plugin-${this.pluginId}`,
        }),
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
    } catch (error) {
      // TODO: Should not throw in optimal case, see BEP
      throw new Error(`Failed to send notifications: ${error}`);
    }
  }
}
