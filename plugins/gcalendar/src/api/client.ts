/*
 * Copyright 2022 The Backstage Authors
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
import { OAuthApi, createApiRef, FetchApi } from '@backstage/core-plugin-api';

import { GCalendarEvent, GCalendarList } from './types';
import { ResponseError } from '@backstage/errors';

type Options = {
  authApi: OAuthApi;
  fetchApi: FetchApi;
};

export const gcalendarApiRef = createApiRef<GCalendarApiClient>({
  id: 'plugin.gcalendar.service',
});

export class GCalendarApiClient {
  private readonly authApi: OAuthApi;
  private readonly fetchApi: FetchApi;

  constructor(options: Options) {
    this.authApi = options.authApi;
    this.fetchApi = options.fetchApi;
  }

  private async get<T>(
    path: string,
    params: { [key in string]: any },
  ): Promise<T> {
    const query = new URLSearchParams(params);
    const url = new URL(
      `${path}?${query.toString()}`,
      'https://www.googleapis.com',
    );
    const token = await this.authApi.getAccessToken();
    const response = await this.fetchApi.fetch(url.toString(), {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }

    return response.json() as Promise<T>;
  }

  public async getCalendars(params?: any) {
    return this.get<GCalendarList>(
      '/calendar/v3/users/me/calendarList',
      params,
    );
  }

  public async getEvents(calendarId: string, params?: any) {
    return this.get<{ items: GCalendarEvent[] }>(
      `/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`,
      params,
    );
  }
}
