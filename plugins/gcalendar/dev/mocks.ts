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
import { DateTime } from 'luxon';
import { GCalendar, GCalendarEvent } from '../src/api';

const primaryCalendar: GCalendar = {
  id: 'calendar-1',
  summary: 'test-1@test.com',
  primary: true,
};
const nonPrimaryCalendar: GCalendar = {
  id: 'calendar-2',
  summary: 'test-2@test.com',
  primary: false,
  backgroundColor: '#9BF0E1',
};

export const calendarListMock = {
  items: [primaryCalendar, nonPrimaryCalendar],
};

export const eventsMock: GCalendarEvent[] = [...Array(3).keys()].map(i => ({
  id: i.toString(),
  summary: `Meeting ${i + 1}`,
  start: {
    dateTime: DateTime.now()
      .minus({ hour: i + 1 })
      .toISO(),
    timeZone: 'Europe/London',
  },
  end: {
    dateTime: DateTime.now().minus({ hour: i }).toISO(),
    timeZone: 'Europe/London',
  },
  description: '<h3>Dummy title</h3><p>Dummy description</p>',
  conferenceData: {
    entryPoints: [
      {
        entryPointType: 'video',
        uri: 'https://zoom.us/',
      },
    ],
  },
}));
