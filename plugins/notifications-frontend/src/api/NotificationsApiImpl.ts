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
import { FetchApi } from '@backstage/core-plugin-api';

import {
  Configuration,
  CreateBody,
  GetNotificationsRequest,
  Notification,
  NotificationsApi as NotificationsOpenApi,
} from '../openapi';
import {
  NotificationMarkAsRead,
  NotificationsApi,
  NotificationsCountQuery,
} from './notificationsApi';

export type NotificationsApiOptions = {
  fetchApi: FetchApi;
};

export class NotificationsApiImpl implements NotificationsApi {
  private readonly backendRestApi: NotificationsOpenApi;

  constructor(options: NotificationsApiOptions) {
    const configuration = new Configuration({
      fetchApi: options.fetchApi.fetch,
    });
    this.backendRestApi = new NotificationsOpenApi(configuration);
  }

  async createNotification(notification: CreateBody): Promise<string> {
    const data = await this.backendRestApi.createNotification({
      createBody: notification,
    });
    return data.messageId;
  }

  getNotifications(query: GetNotificationsRequest): Promise<Notification[]> {
    return this.backendRestApi.getNotifications(query);
  }

  async getNotificationsCount(query: NotificationsCountQuery): Promise<number> {
    const data = await this.backendRestApi.getNotificationsCount(query);
    return data.count;
  }

  async markAsRead(params: NotificationMarkAsRead): Promise<void> {
    return this.backendRestApi.setRead(params);
  }
}
