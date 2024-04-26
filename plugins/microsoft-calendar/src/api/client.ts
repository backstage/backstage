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
import { ResponseError } from '@backstage/errors';
import { MicrosoftCalendarEvent, MicrosoftCalendar } from './types';

/** @public */
export const microsoftCalendarApiRef = createApiRef<MicrosoftCalendarApiClient>(
  {
    id: 'plugin.microsoft-calendar.service',
  },
);

/** @public */
export class MicrosoftCalendarApiClient {
  private readonly authApi: OAuthApi;
  private readonly fetchApi: FetchApi;

  constructor(options: { authApi: OAuthApi; fetchApi: FetchApi }) {
    this.authApi = options.authApi;
    this.fetchApi = options.fetchApi;
  }

  private async get<T>(
    path: string,
    params: { [key in string]: any } = {},
    headers?: any,
  ): Promise<T> {
    const query = new URLSearchParams(params);
    const url = new URL(
      `${path}?${query.toString()}`,
      'https://graph.microsoft.com',
    );
    const token = await this.authApi.getAccessToken();
    let temp: any = {};

    if (headers && typeof headers === 'object') {
      temp = {
        ...headers,
      };
    }

    if (token) {
      temp.Authorization = `Bearer ${token}`;
    }

    const response = await this.fetchApi.fetch(url.toString(), {
      headers: temp,
    });

    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }

    return response.json() as Promise<T>;
  }

  public async getCalendars(): Promise<MicrosoftCalendar[]> {
    const data = await this.get<{
      id: string;
      value: MicrosoftCalendar[];
    }>('v1.0/me/calendars');

    return data.value;
  }

  public async getEvents(
    calendarId: string,
    params: {
      startDateTime: string;
      endDateTime: string;
    },
    headers: { [key in string]: any },
  ): Promise<MicrosoftCalendarEvent[]> {
    const data = await this.get<{
      id: string;
      value: [MicrosoftCalendarEvent];
    }>(`v1.0/me/calendars/${calendarId}/calendarview`, params, headers);
    return data.value;
  }
}
