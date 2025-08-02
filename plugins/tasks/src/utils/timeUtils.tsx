/*
 * Copyright 2025 The Backstage Authors
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
import { Duration, DateTime } from 'luxon';
import cronstrue from 'cronstrue';

/**
 * Time utilities following Backstage ADR012: Use Luxon.toLocaleString and date/time presets
 * @see https://backstage.io/docs/architecture-decisions/adrs-adr012
 */

/**
 * Duration parsing and humanization utilities
 */

/**
 * Humanizes a duration string into a readable format
 * @param duration - ISO 8601 duration string (PT1H30M, P1D, etc.) or cron expression
 * @param asPeriod - Whether to prefix with "Every " for periodic durations
 * @returns Humanized duration string
 */
export function humanizeDuration(
  duration: string,
  asPeriod: boolean = false,
): string {
  if (!duration) return 'Unknown';

  // Handle ISO8601 without time (P1D, P1W, P1M, P1Y, PT1H30M, PT45M, etc.)
  if (duration.startsWith('P')) {
    const luxonDuration = Duration.fromISO(duration);
    if (!luxonDuration.isValid) return duration;
    return (
      (asPeriod ? 'Every ' : '') +
      luxonDuration.toHuman({
        unitDisplay: 'short',
        listStyle: 'narrow',
        maximumFractionDigits: 0,
      })
    );
  }

  // Handle cron expressions
  if (duration.includes(' ')) {
    // XXX(GabDug): Pass locale when i18n is supported
    return cronstrue.toString(duration);
  }

  return duration;
}

/**
 * Humanizes a cadence string (periodic duration)
 * @param cadence - Cadence string to humanize
 * @returns Humanized cadence string with "Every " prefix
 */
export function humanizeCadence(cadence: string): string {
  return humanizeDuration(cadence, true);
}

/**
 * Relative time formatting utilities
 */

/**
 * Formats a past date/time as a relative time string
 * @param lastRunEndedAt - Date or ISO string to format
 * @returns Relative time string (e.g., "2h ago", "3d ago", "just now")
 */
export function formatLastRun(lastRunEndedAt?: Date | string): string {
  if (!lastRunEndedAt) return 'never';

  const dateTime =
    typeof lastRunEndedAt === 'string'
      ? DateTime.fromISO(lastRunEndedAt)
      : DateTime.fromJSDate(lastRunEndedAt);
  if (!dateTime.isValid) return 'Invalid date';

  const now = DateTime.now();
  const diff = now.diff(dateTime);

  if (diff.as('minutes') < 1) return 'just now';
  if (diff.as('hours') < 1) return `${Math.floor(diff.as('minutes'))}m ago`;
  if (diff.as('days') < 1) return `${Math.floor(diff.as('hours'))}h ago`;
  if (diff.as('days') < 7) return `${Math.floor(diff.as('days'))}d ago`;

  // Use Luxon preset for dates beyond 7 days (following ADR012)
  return dateTime.toLocaleString(DateTime.DATE_MED);
}

/**
 * Formats a future date/time as a relative time string
 * @param nextRunAt - Date or ISO string to format
 * @returns Relative time string (e.g., "in 2h", "in 3d", "starting now")
 */
export function formatNextRun(nextRunAt?: string | Date): string {
  if (!nextRunAt) return 'not scheduled';

  const dateTime =
    typeof nextRunAt === 'string'
      ? DateTime.fromISO(nextRunAt)
      : DateTime.fromJSDate(nextRunAt);

  if (!dateTime.isValid) return 'Invalid date';

  const now = DateTime.now();
  const diff = dateTime.diff(now);

  if (diff.as('milliseconds') < 0) return 'overdue';

  if (diff.as('minutes') < 1) return 'starting now';
  if (diff.as('hours') < 1) return `in ${Math.floor(diff.as('minutes'))}m`;
  if (diff.as('days') < 1) return `in ${Math.floor(diff.as('hours'))}h`;
  if (diff.as('days') < 7) return `in ${Math.floor(diff.as('days'))}d`;

  // Use Luxon preset for dates beyond 7 days (following ADR012)
  return dateTime.toLocaleString(DateTime.DATE_MED);
}

/**
 * Absolute time formatting utilities
 */

/**
 * Formats a date/time as a medium-length absolute string
 * @param dateTime - Date, ISO string, or DateTime object to format
 * @returns Absolute date/time string (e.g., "Jan 15, 2024, 2:30 PM")
 */
export function formatAbsoluteDateTime(
  dateTime?: Date | string | DateTime,
): string {
  if (!dateTime) return 'Unknown';

  let luxonDateTime: DateTime;
  if (dateTime instanceof DateTime) {
    luxonDateTime = dateTime;
  } else if (typeof dateTime === 'string') {
    luxonDateTime = DateTime.fromISO(dateTime);
  } else {
    luxonDateTime = DateTime.fromJSDate(dateTime);
  }

  if (!luxonDateTime.isValid) return 'Invalid date';

  // Use Luxon preset for datetime formatting (following ADR012)
  return luxonDateTime.toLocaleString(DateTime.DATETIME_MED);
}

/**
 * Formats a date/time as a short absolute string (date only)
 * @param dateTime - Date, ISO string, or DateTime object to format
 * @returns Absolute date string (e.g., "Jan 15, 2024")
 */
export function formatAbsoluteDate(
  dateTime?: Date | string | DateTime,
): string {
  if (!dateTime) return 'Unknown';

  let luxonDateTime: DateTime;
  if (dateTime instanceof DateTime) {
    luxonDateTime = dateTime;
  } else if (typeof dateTime === 'string') {
    luxonDateTime = DateTime.fromISO(dateTime);
  } else {
    luxonDateTime = DateTime.fromJSDate(dateTime);
  }

  if (!luxonDateTime.isValid) return 'Invalid date';

  // Use Luxon preset for date formatting (following ADR012)
  return luxonDateTime.toLocaleString(DateTime.DATE_MED);
}

/**
 * Utility functions for date/time parsing and validation
 */

/**
 * Safely parses a date/time value into a Luxon DateTime
 * @param dateTime - Date, ISO string, or DateTime object
 * @returns Luxon DateTime object or null if invalid
 */
export function parseDateTime(
  dateTime?: Date | string | DateTime,
): DateTime | null {
  if (!dateTime) return null;

  try {
    let luxonDateTime: DateTime;
    if (dateTime instanceof DateTime) {
      luxonDateTime = dateTime;
    } else if (typeof dateTime === 'string') {
      luxonDateTime = DateTime.fromISO(dateTime);
    } else {
      luxonDateTime = DateTime.fromJSDate(dateTime);
    }

    return luxonDateTime.isValid ? luxonDateTime : null;
  } catch {
    return null;
  }
}

/**
 * Checks if a date/time is in the past
 * @param dateTime - Date, ISO string, or DateTime object
 * @returns True if the date/time is in the past
 */
export function isPast(dateTime?: Date | string | DateTime): boolean {
  const parsed = parseDateTime(dateTime);
  if (!parsed) return false;

  return parsed < DateTime.now();
}

/**
 * Checks if a date/time is in the future
 * @param dateTime - Date, ISO string, or DateTime object
 * @returns True if the date/time is in the future
 */
export function isFuture(dateTime?: Date | string | DateTime): boolean {
  const parsed = parseDateTime(dateTime);
  if (!parsed) return false;

  return parsed > DateTime.now();
}

/**
 * Gets the time difference between now and a given date/time
 * @param dateTime - Date, ISO string, or DateTime object
 * @returns Duration object representing the difference
 */
export function getTimeDifference(
  dateTime?: Date | string | DateTime,
): Duration | null {
  const parsed = parseDateTime(dateTime);
  if (!parsed) return null;

  return DateTime.now().diff(parsed);
}

/**
 * Formats a duration in milliseconds to a human-readable string
 * @param milliseconds - Duration in milliseconds
 * @returns Human-readable duration string (e.g., "2min", "30s")
 */
export function formatDuration(milliseconds: number): string {
  const duration = Duration.fromMillis(milliseconds);
  if (duration.as('minutes') >= 1) {
    return `${Math.round(duration.as('minutes'))}min`;
  }
  return `${Math.round(duration.as('seconds'))}s`;
}
