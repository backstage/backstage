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
import {
  GetNotificationsCommonOptions,
  GetNotificationsOptions,
  GetNotificationsResponse,
  GetTopicsOptions,
  GetTopicsResponse,
  NotificationsApi,
  UpdateNotificationsOptions,
} from './NotificationsApi';
import { DiscoveryApi, FetchApi } from '@backstage/core-plugin-api';
import { ResponseError } from '@backstage/errors';
import {
  Notification,
  NotificationSettings,
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
  ): Promise<GetNotificationsResponse> {
    const queryString = new URLSearchParams();
    if (options?.limit !== undefined) {
      queryString.append('limit', options.limit.toString(10));
    }
    if (options?.offset !== undefined) {
      queryString.append('offset', options.offset.toString(10));
    }
    if (options?.sort !== undefined) {
      queryString.append(
        'orderField',
        `${options.sort},${options?.sortOrder ?? 'desc'}`,
      );
    }

    this.appendCommonQueryStrings(queryString, options);

    if (options?.topic !== undefined) {
      queryString.append('topic', options.topic);
    }

    return await this.request<GetNotificationsResponse>(
      `/notifications?${queryString}`,
    );
  }

  async getNotification(id: string): Promise<Notification> {
    return await this.request<Notification>(
      `/notifications/${encodeURIComponent(id)}`,
    );
  }

  async getStatus(): Promise<NotificationStatus> {
    return await this.request<NotificationStatus>('/status');
  }

  async updateNotifications(
    options: UpdateNotificationsOptions,
  ): Promise<Notification[]> {
    return await this.request<Notification[]>('/notifications/update', {
      method: 'POST',
      body: JSON.stringify(options),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async getNotificationSettings(): Promise<NotificationSettings> {
    return await this.request<NotificationSettings>('/settings');
  }

  async updateNotificationSettings(
    settings: NotificationSettings,
  ): Promise<NotificationSettings> {
    return await this.request<NotificationSettings>('/settings', {
      method: 'POST',
      body: JSON.stringify(settings),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async getTopics(options?: GetTopicsOptions): Promise<GetTopicsResponse> {
    const queryString = new URLSearchParams();
    this.appendCommonQueryStrings(queryString, options);

    return await this.request<GetTopicsResponse>(`/topics?${queryString}`);
  }

  private appendCommonQueryStrings(
    queryString: URLSearchParams,
    options?: GetNotificationsCommonOptions,
  ) {
    if (options?.search) {
      queryString.append('search', options.search);
    }
    if (options?.read !== undefined) {
      queryString.append('read', options.read ? 'true' : 'false');
    }
    if (options?.saved !== undefined) {
      queryString.append('saved', options.saved ? 'true' : 'false');
    }
    if (options?.createdAfter !== undefined) {
      queryString.append('createdAfter', options.createdAfter.toISOString());
    }
    if (options?.minimumSeverity !== undefined) {
      queryString.append('minimumSeverity', options.minimumSeverity);
    }
  }

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const baseUrl = await this.discoveryApi.getBaseUrl('notifications');
    const res = await this.fetchApi.fetch(`${baseUrl}${path}`, init);

    if (!res.ok) {
      throw await ResponseError.fromResponse(res);
    }

    return res.json() as Promise<T>;
  }
}
