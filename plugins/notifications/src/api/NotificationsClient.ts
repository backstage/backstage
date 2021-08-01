/*
 * Copyright 2021 The Backstage Authors
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
import { ResponseError } from '@backstage/errors';
import { Notifications } from '@backstage/plugin-notifications-backend';
import { NotificationsApi } from './NotificationsApi';
import { DiscoveryApi } from '@backstage/core-plugin-api';

export class NotificationsClient implements NotificationsApi {
  url: string = '';

  constructor(public discovery: DiscoveryApi) {}

  private async fetch<T = unknown | string | Notifications>(
    path: string,
    init?: RequestInit,
  ): Promise<T | string> {
    if (!this.url) {
      this.url = await this.discovery.getBaseUrl('notifications');
    }
    const resp = await fetch(`${this.url}${path}`, init);
    if (!resp.ok) {
      throw await ResponseError.fromResponse(resp);
    }
    if (resp.headers.get('content-type')?.includes('application/json')) {
      return await resp.json();
    }
    return await resp.text();
  }

  async getNotifications(userId: string): Promise<Notifications> {
    return (await this.fetch<Notifications>(
      `/user/${userId}`,
    )) as Notifications;
  }
}
