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
import { IdentityApi } from '@backstage/core-plugin-api';

import {
  CreateBody,
  DefaultConfig,
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
  identityApi: IdentityApi;
};

export class NotificationsApiImpl implements NotificationsApi {
  private readonly identityApi: IdentityApi;
  private readonly backendRestApi: NotificationsOpenApi;

  constructor(options: NotificationsApiOptions) {
    this.identityApi = options.identityApi;

    const configuration = DefaultConfig;
    this.backendRestApi = new NotificationsOpenApi(configuration);
  }

  private async getLogedInUsername(): Promise<string> {
    const { userEntityRef } = await this.identityApi.getBackstageIdentity();
    if (!userEntityRef.startsWith('user:')) {
      throw new Error('The logged-in user is not of an user entity type.');
    }
    return userEntityRef.slice('start:'.length - 1);
  }

  async createNotification(notification: CreateBody): Promise<string> {
    const data = await this.backendRestApi.createNotification({
      createBody: notification,
    });
    return data.messageId;
  }

  async getNotifications(
    query: GetNotificationsRequest,
  ): Promise<Notification[]> {
    const user = await this.getLogedInUsername();
    return this.backendRestApi.getNotifications({ ...query, user });
  }

  async getNotificationsCount(query: NotificationsCountQuery): Promise<number> {
    const user = await this.getLogedInUsername();
    const data = await this.backendRestApi.getNotificationsCount({
      ...query,
      user,
    });
    return data.count;
  }

  async markAsRead(params: NotificationMarkAsRead): Promise<void> {
    const user = await this.getLogedInUsername();

    return this.backendRestApi.setRead({ ...params, user });
  }
}
