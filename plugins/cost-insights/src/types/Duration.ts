/*
 * Copyright 2020 Spotify AB
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

import moment from 'moment';
import { assertNever } from './Maybe';

/**
 * Time periods for cost comparison; slight abuse of ISO 8601 periods. We take P1M and P3M to mean
 * 'last completed [month|quarter]', and P30D/P90D to be '[month|quarter] relative to today'. So if
 * it's September 15, P1M represents costs for the month of August and P30D represents August 16 -
 * September 15.
 */
export enum Duration {
  P30D = 'P30D',
  P90D = 'P90D',
  P1M = 'P1M',
  P3M = 'P3M',
}

export const DEFAULT_DATE_FORMAT = 'YYYY-MM-DD';

// Derive the start date of a given period, assuming two repeating intervals
export function inclusiveStartDateOf(duration: Duration): string {
  switch (duration) {
    case Duration.P30D:
    case Duration.P90D:
      return moment()
        .utc()
        .subtract(moment.duration(duration).add(moment.duration(duration)))
        .format(DEFAULT_DATE_FORMAT);
    case Duration.P1M:
      return moment()
        .utc()
        .startOf('month')
        .subtract(moment.duration(duration).add(moment.duration(duration)))
        .format(DEFAULT_DATE_FORMAT);
    case Duration.P3M:
      return moment()
        .utc()
        .startOf('quarter')
        .subtract(moment.duration(duration).add(moment.duration(duration)))
        .format(DEFAULT_DATE_FORMAT);
    default:
      return assertNever(duration);
  }
}

export function exclusiveEndDateOf(duration: Duration): string {
  switch (duration) {
    case Duration.P30D:
    case Duration.P90D:
      return moment().utc().add(1, 'day').format(DEFAULT_DATE_FORMAT);
    case Duration.P1M:
      return moment().utc().startOf('month').format(DEFAULT_DATE_FORMAT);
    case Duration.P3M:
      return moment().utc().startOf('quarter').format(DEFAULT_DATE_FORMAT);
    default:
      return assertNever(duration);
  }
}

export function inclusiveEndDateOf(duration: Duration): string {
  return moment(exclusiveEndDateOf(duration))
    .utc()
    .subtract(1, 'day')
    .format(DEFAULT_DATE_FORMAT);
}

// https://en.wikipedia.org/wiki/ISO_8601#Repeating_intervals
export function intervalsOf(duration: Duration) {
  return `R2/${duration}/${exclusiveEndDateOf(duration)}`;
}
