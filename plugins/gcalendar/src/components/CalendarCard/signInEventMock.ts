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
import { GCalendarEvent } from '../../api';

export const eventsMock: GCalendarEvent[] = [
  {
    id: '1',
    htmlLink: 'https://www.google.com/calendar/',
    summary: 'Backstage Community Sessions',
    start: {
      dateTime: '2021-12-07T09:00:00+01:00',
      timeZone: 'Europe/London',
    },
    end: {
      dateTime: '2021-12-07T10:00:00+01:00',
      timeZone: 'Europe/London',
    },
  },
  {
    id: '2',
    htmlLink: 'https://www.google.com/calendar/',
    summary: 'Backstage Community Sessions',
    start: {
      dateTime: '2021-12-07T10:30:00+01:00',
      timeZone: 'Europe/London',
    },
    end: {
      dateTime: '2021-12-07T10:45:00+01:00',
      timeZone: 'Europe/London',
    },
    conferenceData: {
      entryPoints: [
        {
          entryPointType: 'video',
          uri: 'https://zoom.us',
        },
      ],
    },
  },
  {
    id: '3',
    htmlLink: 'https://www.google.com/calendar',
    summary: 'Backstage Community Sessions',
    start: {
      dateTime: '2021-12-07T12:00:00+01:00',
      timeZone: 'Europe/London',
    },
    end: {
      dateTime: '2021-12-07T13:00:00+01:00',
      timeZone: 'Europe/London',
    },
    conferenceData: {
      entryPoints: [
        {
          entryPointType: 'video',
          uri: 'https://zoom.us',
          label: 'zoom.us',
        },
      ],
    },
  },
  {
    id: '4',
    htmlLink: 'https://www.google.com/calendar',
    summary: 'Backstage Community Sessions',
    start: {
      dateTime: '2021-12-07T15:00:00+01:00',
      timeZone: 'Europe/London',
    },
    end: {
      dateTime: '2021-12-07T16:30:00+01:00',
      timeZone: 'Europe/London',
    },
    conferenceData: {
      entryPoints: [
        {
          entryPointType: 'video',
          uri: 'https://zoom.us',
        },
      ],
    },
  },
  {
    id: '5',
    htmlLink: 'https://www.google.com/calendar',
    summary: 'Backstage Community Sessions',
    start: {
      dateTime: '2021-12-07T17:00:00+01:00',
      timeZone: 'Europe/London',
    },
    end: {
      dateTime: '2021-12-07T17:30:00+01:00',
      timeZone: 'Europe/London',
    },
    conferenceData: {
      entryPoints: [
        {
          entryPointType: 'video',
          uri: 'https://zoom.us',
        },
      ],
    },
  },
];
