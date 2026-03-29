/*
 * Copyright 2024 The Backstage Authors
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

import { Zone, ZoneLevel, ZoneSchedule } from './types';

const ZONE_SEVERITY: Record<ZoneLevel, number> = {
  green: 0,
  yellow: 1,
  red: 2,
};

/**
 * Parse a single cron field into a set of matching integer values.
 * Supports: *, numbers, ranges (a-b), steps (asterisk/n, a-b/n), and comma-separated lists.
 */
function parseField(field: string, min: number, max: number): Set<number> {
  const result = new Set<number>();

  for (const part of field.split(',')) {
    const stepMatch = part.match(/^(.+)\/(\d+)$/);
    const step = stepMatch ? parseInt(stepMatch[2], 10) : 1;
    const range = stepMatch ? stepMatch[1] : part;

    let start: number;
    let end: number;

    if (range === '*') {
      start = min;
      end = max;
    } else if (range.includes('-')) {
      const [a, b] = range.split('-').map(Number);
      start = a;
      end = b;
    } else {
      start = parseInt(range, 10);
      end = start;
    }

    for (let i = start; i <= end; i += step) {
      result.add(i);
    }
  }

  return result;
}

/**
 * Check whether a given Date matches a 5-field cron expression.
 */
function matchesCron(cron: string, date: Date): boolean {
  const fields = cron.trim().split(/\s+/);
  if (fields.length !== 5) {
    return false;
  }

  const minute = date.getMinutes();
  const hour = date.getHours();
  const dayOfMonth = date.getDate();
  const month = date.getMonth() + 1; // cron months are 1-12
  const dayOfWeek = date.getDay(); // 0 = Sunday

  const minutes = parseField(fields[0], 0, 59);
  const hours = parseField(fields[1], 0, 23);
  const daysOfMonth = parseField(fields[2], 1, 31);
  const months = parseField(fields[3], 1, 12);
  const daysOfWeek = parseField(fields[4], 0, 7);

  // Normalize day-of-week: 7 is also Sunday
  const dowMatches =
    daysOfWeek.has(dayOfWeek) || (dayOfWeek === 0 && daysOfWeek.has(7));

  return (
    minutes.has(minute) &&
    hours.has(hour) &&
    daysOfMonth.has(dayOfMonth) &&
    months.has(month) &&
    dowMatches
  );
}

/**
 * Resolve the current zone from a schedule definition.
 *
 * @remarks
 *
 * For each window, walks backwards from `now` up to `durationMinutes` to find
 * the most recent cron match. If a match is found within range, the window is
 * active. When multiple windows are active, the highest severity wins.
 *
 * @param schedule - The zone schedule to evaluate
 * @param now - The reference time (defaults to current time)
 * @returns The resolved Zone
 *
 * @public
 */
export function resolveZoneFromSchedule(
  schedule: ZoneSchedule,
  now: Date = new Date(),
): Zone {
  const defaultLevel = schedule.defaultLevel ?? 'green';
  let activeLevel: ZoneLevel = defaultLevel;
  let activeUntil: Date | undefined;

  for (const window of schedule.windows) {
    // Walk backwards minute-by-minute to find the most recent cron match
    for (let offset = 0; offset <= window.durationMinutes; offset++) {
      const candidate = new Date(now.getTime() - offset * 60_000);
      // Truncate to the start of the minute
      candidate.setSeconds(0, 0);

      if (matchesCron(window.cron, candidate)) {
        // Found a match at `candidate`. Window is active if we're still within duration.
        const windowEnd = new Date(
          candidate.getTime() + window.durationMinutes * 60_000,
        );

        if (now < windowEnd) {
          // Window is active — use it if it's higher severity than current
          if (ZONE_SEVERITY[window.level] > ZONE_SEVERITY[activeLevel]) {
            activeLevel = window.level;
            activeUntil = windowEnd;
          } else if (
            ZONE_SEVERITY[window.level] === ZONE_SEVERITY[activeLevel] &&
            activeLevel !== defaultLevel
          ) {
            // Same severity: pick the later expiry
            if (!activeUntil || windowEnd > activeUntil) {
              activeUntil = windowEnd;
            }
          }
        }
        break; // Found the most recent match for this window
      }
    }
  }

  const labels: Record<ZoneLevel, string> = {
    green: 'No active restrictions',
    yellow: 'Caution advised',
    red: 'Operations blocked',
  };
  const label = labels[activeLevel];

  return {
    id: schedule.operationId,
    level: activeLevel,
    label,
    activeUntil: activeLevel !== defaultLevel ? activeUntil : undefined,
  };
}
