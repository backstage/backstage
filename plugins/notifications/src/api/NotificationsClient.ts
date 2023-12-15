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
import { GetNotificationsOptions, NotificationsApi } from './NotificationsApi';
import { DiscoveryApi, FetchApi } from '@backstage/core-plugin-api';
import { ResponseError } from '@backstage/errors';
import {
  Notification,
  NotificationIds,
  NotificationStatus,
} from '@backstage/plugin-notifications-common';

/** @public */
export class NotificationsClient implements NotificationsApi {
  private readonly discoveryApi: DiscoveryApi;
  private readonly fetchApi: FetchApi;

  public constructor(options: {
    discoveryApi: DiscoveryApi;
    fetchApi: FetchApi;
  }) {
    this.discoveryApi = options.discoveryApi;
    this.fetchApi = options.fetchApi;
  }

  async getNotifications(
    options?: GetNotificationsOptions,
  ): Promise<Notification[]> {
    const queryString = new URLSearchParams();
    if (options?.type) {
      queryString.append('type', options.type);
    }

    const urlSegment = `notifications?${queryString}`;

    return await this.request<Notification[]>(urlSegment);
  }

  async getStatus(): Promise<NotificationStatus> {
    return await this.request<NotificationStatus>('status');
  }

  async markRead(ids: string[]): Promise<NotificationIds> {
    return await this.request<NotificationIds>('read', {
      method: 'POST',
      body: JSON.stringify({ ids: ids }),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async markUnread(ids: string[]): Promise<NotificationIds> {
    return await this.request<NotificationIds>('unread', {
      method: 'POST',
      body: JSON.stringify({ ids: ids }),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async markSaved(ids: string[]): Promise<NotificationIds> {
    return await this.request<NotificationIds>('save', {
      method: 'POST',
      body: JSON.stringify({ ids: ids }),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async markUnsaved(ids: string[]): Promise<NotificationIds> {
    return await this.request<NotificationIds>('unsave', {
      method: 'POST',
      body: JSON.stringify({ ids: ids }),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  private async request<T>(path: string, init?: any): Promise<T> {
    const baseUrl = `${await this.discoveryApi.getBaseUrl('notifications')}/`;
    const url = new URL(path, baseUrl);

    const response = await this.fetchApi.fetch(url.toString(), init);

    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }

    return response.json() as Promise<T>;
  }
}
