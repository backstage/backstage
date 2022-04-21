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

import { googleAuthApiRef, storageApiRef } from '@backstage/core-plugin-api';
import {
  MockStorageApi,
  TestApiProvider,
  renderInTestApp,
} from '@backstage/test-utils';

import { HomePageCalendar } from '.';
import { gcalendarApiRef, gcalendarPlugin } from '../..';

describe('<HomePageCalendar />', () => {
  const primaryCalendar = {
    id: 'test-1@test.com',
    summary: 'test-1@test.com',
    primary: true,
  };
  const nonPrimaryCalendar = {
    id: 'test-2@test.com',
    summary: 'test-2@test.com',
    primary: false,
  };
  const calendarData = {
    items: [primaryCalendar, nonPrimaryCalendar],
  };
  const eventData = {
    items: [
      {
        id: '1',
        summary: 'Test event',
      },
      {
        id: '2',
        summary: 'Test event',
      },
    ],
  };

  const getMockedApi = (calendarMock = {}, eventMock = {}) => ({
    getCalendars: jest.fn().mockResolvedValue(calendarMock),
    getEvents: jest.fn().mockResolvedValue(eventMock),
  });

  const getAuthMockApi = (token = 'token') => ({
    getAccessToken: jest.fn().mockResolvedValue(token),
  });

  const mockStorage = MockStorageApi.create();

  it('should render "Sign in" button if user not signed in', async () => {
    const rendered = await renderInTestApp(
      <TestApiProvider
        apis={[
          [gcalendarApiRef, getMockedApi()],
          [googleAuthApiRef, getAuthMockApi('')],
        ]}
      >
        <HomePageCalendar />
      </TestApiProvider>,
    );

    expect(rendered.queryByText('Sign in')).toBeInTheDocument();
  });

  it('should render empty card', async () => {
    const rendered = await renderInTestApp(
      <TestApiProvider
        apis={[
          [gcalendarApiRef, getMockedApi()],
          [googleAuthApiRef, getAuthMockApi()],
        ]}
      >
        <HomePageCalendar />
      </TestApiProvider>,
    );

    expect(rendered.queryByText('No events')).toBeInTheDocument();
    expect(rendered.queryByText('Go to Calendar')).toBeInTheDocument();
  });

  it('should select primary calendar by default', async () => {
    const rendered = await renderInTestApp(
      <TestApiProvider
        apis={[
          [gcalendarApiRef, getMockedApi(calendarData, eventData)],
          [googleAuthApiRef, getAuthMockApi()],
        ]}
      >
        <HomePageCalendar />
      </TestApiProvider>,
    );

    expect(rendered.queryByText(primaryCalendar.summary)).toBeInTheDocument();
    expect(
      rendered.queryByText(nonPrimaryCalendar.summary),
    ).not.toBeInTheDocument();
  });

  it('should render calendar events', async () => {
    const rendered = await renderInTestApp(
      <TestApiProvider
        apis={[
          [gcalendarApiRef, getMockedApi(calendarData, eventData)],
          [googleAuthApiRef, getAuthMockApi()],
        ]}
      >
        <HomePageCalendar />
      </TestApiProvider>,
    );

    expect(rendered.queryByText('No events')).not.toBeInTheDocument();
    expect(rendered.queryAllByText('Test event')).toHaveLength(2);
  });

  it('should select stored calendar', async () => {
    mockStorage
      .forBucket(gcalendarPlugin.getId())
      .set('google_calendars_selected', [nonPrimaryCalendar.id]);

    const rendered = await renderInTestApp(
      <TestApiProvider
        apis={[
          [gcalendarApiRef, getMockedApi(calendarData, eventData)],
          [googleAuthApiRef, getAuthMockApi()],
          [storageApiRef, mockStorage],
        ]}
      >
        <HomePageCalendar />
      </TestApiProvider>,
    );

    expect(
      rendered.queryByText(nonPrimaryCalendar.summary),
    ).toBeInTheDocument();
    expect(
      rendered.queryByText(primaryCalendar.summary),
    ).not.toBeInTheDocument();
  });
});
