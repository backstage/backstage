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

import { resolveZoneFromSchedule } from './resolveZoneFromSchedule';
import { ZoneSchedule } from './types';

describe('resolveZoneFromSchedule', () => {
  it('returns green by default when no windows match', () => {
    const schedule: ZoneSchedule = {
      operationId: 'test-op',
      windows: [
        {
          level: 'red',
          cron: '0 3 * * 6', // Saturday 3am
          durationMinutes: 60,
        },
      ],
    };

    // Monday 10am — no window active
    const now = new Date('2024-07-15T10:00:00Z'); // Monday
    const zone = resolveZoneFromSchedule(schedule, now);

    expect(zone.id).toBe('test-op');
    expect(zone.level).toBe('green');
    expect(zone.label).toBe('No active restrictions');
    expect(zone.activeUntil).toBeUndefined();
  });

  it('returns the configured defaultLevel when no windows match', () => {
    const schedule: ZoneSchedule = {
      operationId: 'cautious-op',
      defaultLevel: 'yellow',
      windows: [
        {
          level: 'green',
          cron: '0 2 * * 0', // Sunday 2am
          durationMinutes: 120,
        },
      ],
    };

    // Tuesday 10am — no window active
    const now = new Date('2024-07-16T10:00:00Z');
    const zone = resolveZoneFromSchedule(schedule, now);

    expect(zone.level).toBe('yellow');
    expect(zone.label).toBe('Caution advised');
  });

  it('resolves a window that is currently active', () => {
    const schedule: ZoneSchedule = {
      operationId: 'deploy-gate',
      windows: [
        {
          level: 'red',
          cron: '0 8 * * 1-5', // Weekdays 8am
          durationMinutes: 600, // 10 hours
        },
      ],
    };

    // Wednesday 14:00 — 6 hours into the 10-hour window
    const now = new Date('2024-07-17T14:00:00Z'); // Wednesday
    const zone = resolveZoneFromSchedule(schedule, now);

    expect(zone.level).toBe('red');
    expect(zone.label).toBe('Operations blocked');
    expect(zone.activeUntil).toEqual(new Date('2024-07-17T18:00:00Z'));
  });

  it('resolves green when a window has expired', () => {
    const schedule: ZoneSchedule = {
      operationId: 'deploy-gate',
      windows: [
        {
          level: 'red',
          cron: '0 8 * * 1-5', // Weekdays 8am
          durationMinutes: 60, // 1 hour
        },
      ],
    };

    // Wednesday 10:00 — 2 hours after start, window expired after 1 hour
    const now = new Date('2024-07-17T10:00:00Z');
    const zone = resolveZoneFromSchedule(schedule, now);

    expect(zone.level).toBe('green');
  });

  it('picks the highest severity when multiple windows are active', () => {
    const schedule: ZoneSchedule = {
      operationId: 'multi-window',
      windows: [
        {
          level: 'yellow',
          cron: '0 8 * * 1-5', // Weekdays 8am, 12 hours
          durationMinutes: 720,
        },
        {
          level: 'red',
          cron: '0 12 * * 3', // Wednesday noon, 2 hours
          durationMinutes: 120,
        },
      ],
    };

    // Wednesday 13:00 — both yellow (from 8am) and red (from noon) active
    const now = new Date('2024-07-17T13:00:00Z');
    const zone = resolveZoneFromSchedule(schedule, now);

    expect(zone.level).toBe('red');
    expect(zone.activeUntil).toEqual(new Date('2024-07-17T14:00:00Z'));
  });

  it('handles cron with step expressions (*/5)', () => {
    const schedule: ZoneSchedule = {
      operationId: 'frequent-check',
      windows: [
        {
          level: 'yellow',
          cron: '*/5 * * * *', // Every 5 minutes
          durationMinutes: 3,
        },
      ],
    };

    // 10:11 — last match was 10:10, within 3-minute window
    const now = new Date('2024-07-17T10:11:00Z');
    const zone = resolveZoneFromSchedule(schedule, now);

    expect(zone.level).toBe('yellow');

    // 10:14 — last match was 10:10, 4 minutes ago > 3 minute window
    const later = new Date('2024-07-17T10:14:00Z');
    const zoneAfter = resolveZoneFromSchedule(schedule, later);

    expect(zoneAfter.level).toBe('green');
  });

  it('handles day-of-week 0 and 7 both as Sunday', () => {
    const scheduleSunday0: ZoneSchedule = {
      operationId: 'sunday-test-0',
      windows: [{ level: 'red', cron: '0 2 * * 0', durationMinutes: 60 }],
    };
    const scheduleSunday7: ZoneSchedule = {
      operationId: 'sunday-test-7',
      windows: [{ level: 'red', cron: '0 2 * * 7', durationMinutes: 60 }],
    };

    // Sunday 2:30am
    const now = new Date('2024-07-14T02:30:00Z'); // July 14 2024 = Sunday
    expect(resolveZoneFromSchedule(scheduleSunday0, now).level).toBe('red');
    expect(resolveZoneFromSchedule(scheduleSunday7, now).level).toBe('red');
  });

  it('handles the exact start minute of a window', () => {
    const schedule: ZoneSchedule = {
      operationId: 'exact-start',
      windows: [{ level: 'red', cron: '30 9 * * *', durationMinutes: 60 }],
    };

    const now = new Date('2024-07-17T09:30:00Z');
    const zone = resolveZoneFromSchedule(schedule, now);

    expect(zone.level).toBe('red');
    expect(zone.activeUntil).toEqual(new Date('2024-07-17T10:30:00Z'));
  });

  it('handles comma-separated cron values', () => {
    const schedule: ZoneSchedule = {
      operationId: 'comma-test',
      windows: [{ level: 'yellow', cron: '0 9,14 * * *', durationMinutes: 60 }],
    };

    // 9:30 — within the 9am window
    expect(
      resolveZoneFromSchedule(schedule, new Date('2024-07-17T09:30:00Z')).level,
    ).toBe('yellow');

    // 14:30 — within the 2pm window
    expect(
      resolveZoneFromSchedule(schedule, new Date('2024-07-17T14:30:00Z')).level,
    ).toBe('yellow');

    // 11:00 — outside both windows
    expect(
      resolveZoneFromSchedule(schedule, new Date('2024-07-17T11:00:00Z')).level,
    ).toBe('green');
  });

  it('returns a valid Zone with all required fields', () => {
    const schedule: ZoneSchedule = {
      operationId: 'full-check',
      windows: [{ level: 'red', cron: '0 0 * * *', durationMinutes: 120 }],
    };

    const now = new Date('2024-07-17T01:00:00Z');
    const zone = resolveZoneFromSchedule(schedule, now);

    expect(zone).toEqual({
      id: 'full-check',
      level: 'red',
      label: 'Operations blocked',
      activeUntil: new Date('2024-07-17T02:00:00Z'),
    });
  });

  it('handles the example config from the spec', () => {
    const upgradesSchedule: ZoneSchedule = {
      operationId: 'backstage-upgrades',
      defaultLevel: 'green',
      windows: [
        { level: 'red', cron: '0 8 * * 1-5', durationMinutes: 600 },
        { level: 'green', cron: '0 2 * * 6', durationMinutes: 360 },
      ],
    };

    // Wednesday 10am — within the weekday red window
    const weekdayMorning = new Date('2024-07-17T10:00:00Z');
    expect(
      resolveZoneFromSchedule(upgradesSchedule, weekdayMorning).level,
    ).toBe('red');

    // Saturday 4am — within the Saturday green window (but default is already green)
    const saturdayNight = new Date('2024-07-20T04:00:00Z');
    expect(resolveZoneFromSchedule(upgradesSchedule, saturdayNight).level).toBe(
      'green',
    );

    // Sunday 10am — no window active, default green
    const sundayMorning = new Date('2024-07-21T10:00:00Z');
    expect(resolveZoneFromSchedule(upgradesSchedule, sundayMorning).level).toBe(
      'green',
    );
  });
});
