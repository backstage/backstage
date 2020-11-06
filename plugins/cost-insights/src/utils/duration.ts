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
import { Duration, DEFAULT_DATE_FORMAT } from '../types';
import { assertNever } from './assert';

/**
 * Derive the start date of a given period, assuming two repeating intervals.
 *
 * @param duration see comment on Duration enum
 * @param endDate from CostInsightsApi.getLastCompleteBillingDate
 */
export function inclusiveStartDateOf(
  duration: Duration,
  endDate: string,
): string {
  switch (duration) {
    case Duration.P30D:
    case Duration.P90D:
      return moment(endDate)
        .utc()
        .subtract(moment.duration(duration).add(moment.duration(duration)))
        .format(DEFAULT_DATE_FORMAT);
    case Duration.P1M:
      return moment(endDate)
        .utc()
        .startOf('month')
        .subtract(moment.duration(duration).add(moment.duration(duration)))
        .format(DEFAULT_DATE_FORMAT);
    case Duration.P3M:
      return moment(endDate)
        .utc()
        .startOf('quarter')
        .subtract(moment.duration(duration).add(moment.duration(duration)))
        .format(DEFAULT_DATE_FORMAT);
    default:
      return assertNever(duration);
  }
}

export function exclusiveEndDateOf(
  duration: Duration,
  endDate: string,
): string {
  switch (duration) {
    case Duration.P30D:
    case Duration.P90D:
      return moment(endDate).utc().add(1, 'day').format(DEFAULT_DATE_FORMAT);
    case Duration.P1M:
      return moment(endDate).utc().startOf('month').format(DEFAULT_DATE_FORMAT);
    case Duration.P3M:
      return moment(endDate)
        .utc()
        .startOf('quarter')
        .format(DEFAULT_DATE_FORMAT);
    default:
      return assertNever(duration);
  }
}

export function inclusiveEndDateOf(
  duration: Duration,
  endDate: string,
): string {
  return moment(exclusiveEndDateOf(duration, endDate))
    .utc()
    .subtract(1, 'day')
    .format(DEFAULT_DATE_FORMAT);
}

// https://en.wikipedia.org/wiki/ISO_8601#Repeating_intervals
export function intervalsOf(duration: Duration, endDate: string) {
  return `R2/${duration}/${exclusiveEndDateOf(duration, endDate)}`;
}
