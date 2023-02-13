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
import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { microsoftCalendarPlugin, MicrosoftCalendarCard } from '../src/plugin';
import { microsoftCalendarApiRef } from '../src';
import responseMock from './mock.json';
import { microsoftAuthApiRef } from '@backstage/core-plugin-api';
import { Content, Page } from '@backstage/core-components';
import { Grid } from '@material-ui/core';

createDevApp()
  .registerPlugin(microsoftCalendarPlugin)
  .registerApi({
    api: microsoftAuthApiRef,
    deps: {},
    factory: () =>
      ({
        async getAccessToken() {
          return Promise.resolve('token');
        },
      } as unknown as typeof microsoftAuthApiRef.T),
  })
  .registerApi({
    api: microsoftCalendarApiRef,
    deps: {},
    factory: () =>
      ({
        async getCalendars() {
          return Promise.resolve(responseMock.calendars);
        },
        async getEvents() {
          return Promise.resolve(responseMock.events);
        },
      } as unknown as typeof microsoftCalendarApiRef.T),
  })
  .addPage({
    element: (
      <Page themeId="home">
        <Content>
          <Grid item xs={12} md={6}>
            <MicrosoftCalendarCard />
          </Grid>
        </Content>
      </Page>
    ),
    title: 'Microsoft-Calendar Plugin Demo',
    path: '/microsoft-calendar',
  })
  .render();
