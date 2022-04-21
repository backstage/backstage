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

/// <reference types="gapi.auth2" />
/// <reference types="gapi.client.calendar" />

export type GCalendarList = gapi.client.calendar.CalendarList;

export type GCalendar = gapi.client.calendar.CalendarListEntry;

export type EventAttendee = gapi.client.calendar.EventAttendee;

export type GCalendarEvent = gapi.client.calendar.Event &
  Pick<GCalendar, 'backgroundColor' | 'primary'> &
  Pick<EventAttendee, 'responseStatus'> & {
    calendarId?: string;
  };

export enum ResponseStatus {
  needsAction = 'needsAction',
  accepted = 'accepted',
  declined = 'declined',
  maybe = 'tentative',
}
