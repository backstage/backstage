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

export const DEFAULT_DURATION = Duration.P30D;

/**
 * Derive the start date of a given period, assuming two repeating intervals.
 *
 * @param duration see comment on Duration enum
 * @param inclusiveEndDate from CostInsightsApi.getLastCompleteBillingDate
 */
export function inclusiveStartDateOf(
  duration: Duration,
  inclusiveEndDate: string,
): string {
  switch (duration) {
    case Duration.P7D:
    case Duration.P30D:
    case Duration.P90D:
      return moment(inclusiveEndDate)
        .subtract(moment.duration(duration).add(moment.duration(duration)))
        .format(DEFAULT_DATE_FORMAT);
    case Duration.P3M:
      return moment(inclusiveEndDate)
        .startOf('quarter')
        .subtract(moment.duration(duration).add(moment.duration(duration)))
        .format(DEFAULT_DATE_FORMAT);
    default:
      return assertNever(duration);
  }
}

export function exclusiveEndDateOf(
  duration: Duration,
  inclusiveEndDate: string,
): string {
  switch (duration) {
    case Duration.P7D:
    case Duration.P30D:
    case Duration.P90D:
      return moment(inclusiveEndDate).add(1, 'day').format(DEFAULT_DATE_FORMAT);
    case Duration.P3M:
      return moment(quarterEndDate(inclusiveEndDate))
        .add(1, 'day')
        .format(DEFAULT_DATE_FORMAT);
    default:
      return assertNever(duration);
  }
}

export function inclusiveEndDateOf(
  duration: Duration,
  inclusiveEndDate: string,
): string {
  return moment(exclusiveEndDateOf(duration, inclusiveEndDate))
    .subtract(1, 'day')
    .format(DEFAULT_DATE_FORMAT);
}

// https://en.wikipedia.org/wiki/ISO_8601#Repeating_intervals
export function intervalsOf(
  duration: Duration,
  inclusiveEndDate: string,
  repeating: number = 2,
) {
  return `R${repeating}/${duration}/${exclusiveEndDateOf(
    duration,
    inclusiveEndDate,
  )}`;
}

export function quarterEndDate(inclusiveEndDate: string): string {
  const endDate = moment(inclusiveEndDate);
  const endOfQuarter = endDate.endOf('quarter').format(DEFAULT_DATE_FORMAT);
  if (endOfQuarter === inclusiveEndDate) {
    return endDate.format(DEFAULT_DATE_FORMAT);
  }
  return endDate
    .startOf('quarter')
    .subtract(1, 'day')
    .format(DEFAULT_DATE_FORMAT);
}
