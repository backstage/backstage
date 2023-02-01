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

import { MicrosoftCalendarEvent } from '../api';

export function getOnlineMeetingLink(event: MicrosoftCalendarEvent) {
  const onlineEntrypoint =
    event.onlineMeeting?.joinUrl || event.onlineMeetingUrl;
  if (onlineEntrypoint) {
    return onlineEntrypoint;
  }
  return '';
}

export function getTimePeriod(event: MicrosoftCalendarEvent) {
  if (isAllDay(event)) {
    return getAllDayTimePeriod(event);
  }

  const format: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
  };

  const startTime = DateTime.fromISO(event.start?.dateTime || '');
  const endTime = DateTime.fromISO(event.end?.dateTime || '');

  return `${startTime.toLocaleString(format)} - ${endTime.toLocaleString(
    format,
  )}`;
}

function getAllDayTimePeriod(event: MicrosoftCalendarEvent) {
  const format: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric' };
  const startTime = DateTime.fromISO(event.start?.dateTime || '');
  const endTime = DateTime.fromISO(event.end?.dateTime || '').minus({ day: 1 });

  if (startTime.toISO() === endTime.toISO()) {
    return startTime.toLocaleString(format);
  }

  return `${startTime.toLocaleString(format)} - ${endTime.toLocaleString(
    format,
  )}`;
}

export function isPassed(event: MicrosoftCalendarEvent) {
  if (!event.end?.dateTime) return false;
  const eventDate = DateTime.fromISO(event.end?.dateTime!);
  return DateTime.now() >= eventDate;
}

export function isAllDay(event: MicrosoftCalendarEvent) {
  const startTime = DateTime.fromISO(event.start?.dateTime || '');
  const endTime = DateTime.fromISO(event.end?.dateTime || '');

  return endTime.diff(startTime, 'day').days >= 1;
}

export function getStartDate(event: MicrosoftCalendarEvent) {
  return DateTime.fromISO(event.start?.dateTime || '');
}
