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
import {
  Duration,
  inclusiveEndDateOf,
  inclusiveStartDateOf,
} from '../types/Duration';
import { pluralOf } from '../utils/grammar';

export type Period = {
  periodStart: string;
  periodEnd: string;
};

export const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export const lengthyCurrencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  minimumSignificantDigits: 2,
  maximumSignificantDigits: 2,
});

export const numberFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export const monthFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: 'UTC',
  month: 'long',
  year: 'numeric',
});

export const dateFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: 'UTC',
  day: 'numeric',
  month: 'short',
});

export const monthOf = (date: string): string => {
  return monthFormatter.format(Date.parse(date));
};

export const quarterOf = (date: string): string => {
  // Supports formatting YYYY-MM-DD and YYYY-[Q]Q returned in alerts
  const d = moment(date).isValid() ? moment(date) : moment(date, 'YYYY-[Q]Q');
  return d.format('[Q]Q YYYY');
};

export function formatCurrency(amount: number, currency?: string): string {
  const n = Math.round(amount);
  const numString = numberFormatter.format(n);

  return currency ? `${numString} ${pluralOf(n, currency)}` : numString;
}

export function formatPercent(n: number): string {
  // Number.toFixed shows scientific notation for extreme numbers
  if (isNaN(n) || Math.abs(n) < 0.01) {
    return '0%';
  }
  if (Math.abs(n) >= 1e19) {
    return '∞%';
  }
  return `${(n * 100).toFixed(0)}%`;
}

export const formatLastTwoLookaheadQuarters = () => {
  const start = moment(inclusiveStartDateOf(Duration.P3M)).format('[Q]Q YYYY');
  const end = moment(inclusiveEndDateOf(Duration.P3M)).format('[Q]Q YYYY');
  return `${start} vs ${end}`;
};

export const formatLastTwoMonths = () => {
  const start = moment(inclusiveStartDateOf(Duration.P1M)).utc().format('MMMM');
  const end = moment(inclusiveEndDateOf(Duration.P1M)).utc().format('MMMM');
  return `${start} vs ${end}`;
};

export const dateRegex: RegExp = /^\d{4}-\d{2}-\d{2}$/;

export const formatRelativeDuration = (
  date: string,
  duration: Duration,
): string => {
  const periodStart = inclusiveStartDateOf(duration);
  const periodEnd = inclusiveEndDateOf(duration);
  const days = moment.duration(duration).asDays();
  if (![periodStart, periodEnd].includes(date)) {
    throw new Error(`Invalid relative date ${date} for duration ${duration}`);
  }
  return date === periodStart ? `First ${days} Days` : `Last ${days} Days`;
};

export function formatDuration(date: string, duration: Duration) {
  switch (duration) {
    case Duration.P1M:
      return monthOf(date);
    case Duration.P3M:
      return quarterOf(date);
    default:
      return formatRelativeDuration(date, duration);
  }
}
