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

/**
 * Human friendly durations object.
 *
 * @public
 */
export type HumanDuration = {
  years?: number;
  months?: number;
  weeks?: number;
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
  milliseconds?: number;
};

/**
 * Converts a {@link HumanDuration} to milliseconds.
 *
 * @public
 * @remarks
 *
 * Note that this conversion by definition is an approximation in the absence of
 * an anchor to a point in time and time zone, as the number of milliseconds is
 * not constant for many units. So the conversion assumes 365-day years, 30-day
 * months, and fixed 24-hour days.
 *
 * @param duration - A human friendly duration object.
 * @returns The number of approximate milliseconds that the duration represents.
 */
export function durationToMilliseconds(duration: HumanDuration): number {
  const {
    years = 0,
    months = 0,
    weeks = 0,
    days = 0,
    hours = 0,
    minutes = 0,
    seconds = 0,
    milliseconds = 0,
  } = duration;

  const totalDays = years * 365 + months * 30 + weeks * 7 + days;
  const totalHours = totalDays * 24 + hours;
  const totalMinutes = totalHours * 60 + minutes;
  const totalSeconds = totalMinutes * 60 + seconds;
  const totalMilliseconds = totalSeconds * 1000 + milliseconds;

  return totalMilliseconds;
}
