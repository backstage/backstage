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
import { DiscoveryService, LoggerService } from '@backstage/backend-plugin-api';
import { SignalService } from '@backstage/plugin-signals-node';
import { NotificationPayload } from '@backstage/plugin-notifications-common';

/** @public */
export type NotificationServiceOptions = {
  logger: LoggerService;
  discovery: DiscoveryService;
  tokenManager: TokenManager;
  signalService: SignalService;
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
    private readonly logger: LoggerService,
    private readonly discovery: DiscoveryService,
    private readonly tokenManager: TokenManager,
    private readonly pluginId?: string,
  ) {}

  static create({
    logger,
    tokenManager,
    discovery,
  }: NotificationServiceOptions): DefaultNotificationService {
    return new DefaultNotificationService(logger, discovery, tokenManager);
  }

  forPlugin(pluginId: string): NotificationService {
    return new DefaultNotificationService(
      this.logger,
      this.discovery,
      this.tokenManager,
      pluginId,
    );
  }

  async send(notification: NotificationSendOptions): Promise<void> {
    if (!this.pluginId) {
      throw new Error('Invalid initialization of the NotificationService');
    }

    try {
      const baseUrl = await this.discovery.getBaseUrl('notifications');
      const { token } = await this.tokenManager.getToken();
      await fetch(`${baseUrl}/notifications`, {
        method: 'POST',
        body: JSON.stringify({
          ...notification,
          origin: `plugin-${this.pluginId}`,
        }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      this.logger.error(`Failed to send notifications: ${error}`);
    }
  }
}
