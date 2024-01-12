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
import { Notification } from '@backstage/plugin-notifications-common';
import {
  PluginEndpointDiscovery,
  TokenManager,
} from '@backstage/backend-common';
import { NotificationService } from './NotificationService';
import { LoggerService } from '@backstage/backend-plugin-api';

/** @public */
export type NotificationServiceOptions = {
  logger: LoggerService;
  discovery: PluginEndpointDiscovery;
  tokenManager: TokenManager;
};

/** @public */
export type NotificationSendOptions = {
  entityRef: string | string[];
  title: string;
  description: string;
  link: string;
};

/** @public */
export class DefaultNotificationService implements NotificationService {
  private constructor(
    private readonly logger: LoggerService,
    private readonly discovery: PluginEndpointDiscovery,
    private readonly tokenManager: TokenManager,
  ) {}

  static create({
    logger,
    tokenManager,
    discovery,
  }: NotificationServiceOptions): DefaultNotificationService {
    return new DefaultNotificationService(logger, discovery, tokenManager);
  }

  async send(options: NotificationSendOptions): Promise<Notification[]> {
    try {
      const baseUrl = await this.discovery.getBaseUrl('notifications');
      const { token } = await this.tokenManager.getToken();
      const response = await fetch(`${baseUrl}/notifications`, {
        method: 'POST',
        body: JSON.stringify(options),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      return await response.json();
    } catch (error) {
      this.logger.error(`Failed to send notifications: ${error}`);
      return [];
    }
  }
}
