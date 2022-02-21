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
import axios, { AxiosInstance } from 'axios';

import { OAuthApi, createApiRef } from '@backstage/core-plugin-api';

import { GCalendar, GCalendarEvent } from '../components/CalendarCard/types';

type Options = {
  authApi: OAuthApi;
};

export const gcalendarApiRef = createApiRef<GCalendarApiClient>({
  id: 'plugin.gcalendar.service',
});

export class GCalendarApiClient {
  private readonly authApi: OAuthApi;
  private readonly http: AxiosInstance;

  constructor(options: Options) {
    this.authApi = options.authApi;
    this.http = axios.create({
      baseURL: 'https://www.googleapis.com/calendar/v3',
    });
    this.http.interceptors.request.use(async config => {
      const token = await this.authApi.getAccessToken();
      if (!config.headers) {
        config.headers = {};
      }
      config.headers.Authorization = `Bearer ${token}`;

      return config;
    });
  }

  public async getCalendars(params?: any): Promise<{ items: GCalendar[] }> {
    const { data } = await this.http.get('/users/me/calendarList', {
      params,
    });

    return data;
  }

  public async getEvents(
    calendarId: string,
    params?: any,
  ): Promise<{ items: GCalendarEvent[] }> {
    const { data } = await this.http.get(
      `/calendars/${encodeURIComponent(calendarId)}/events`,
      {
        params,
      },
    );

    return data;
  }
}
