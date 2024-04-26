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
import React from 'react';
import { Content, Page } from '@backstage/core-components';
import { googleAuthApiRef } from '@backstage/core-plugin-api';
import { createDevApp } from '@backstage/dev-utils';
import { calendarListMock, eventsMock } from './mocks';
import { gcalendarPlugin, HomePageCalendar } from '../src/plugin';
import { gcalendarApiRef } from '../src';

createDevApp()
  .registerPlugin(gcalendarPlugin)
  .registerApi({
    api: googleAuthApiRef,
    deps: {},
    factory: () =>
      ({
        async getAccessToken() {
          return Promise.resolve('token');
        },
      } as unknown as typeof googleAuthApiRef.T),
  })
  .registerApi({
    api: gcalendarApiRef,
    deps: {},
    factory: () =>
      ({
        async getCalendars() {
          return Promise.resolve(calendarListMock);
        },
        async getEvents() {
          return Promise.resolve({
            items: eventsMock,
          });
        },
      } as unknown as typeof gcalendarApiRef.T),
  })
  .addPage({
    element: (
      <Page themeId="home">
        <Content>
          <HomePageCalendar />
        </Content>
      </Page>
    ),
    title: 'Root Page',
  })
  .render();
