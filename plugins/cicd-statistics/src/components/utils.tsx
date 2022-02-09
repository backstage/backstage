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

import React, { CSSProperties } from 'react';
import { DateTime, Duration } from 'luxon';
import humanizeDuration from 'humanize-duration';
import { capitalize } from 'lodash';

const infoText: CSSProperties = { color: 'InfoText' };

/**
 * Picks {num} elements from {arr} evenly, from the first to the last
 */
export function pickElements<T>(arr: ReadonlyArray<T>, num: number): Array<T> {
  if (arr.length <= num) {
    return [...arr];
  }

  if (num < 2) {
    return [arr[arr.length / 2]];
  }

  const step = arr.length / (num - 1);
  return [
    ...Array.from(Array(num - 1)).map(
      (_, index) => arr[Math.round(index * step)],
    ),
    arr[arr.length - 1],
  ];
}

function formatDateShort(milliseconds: number) {
  if ((milliseconds as any) === 'auto') {
    // When recharts gets confused (empty data)
    return '';
  }
  return DateTime.fromMillis(milliseconds).toLocaleString(DateTime.DATE_SHORT);
}
function formatDateTimeShort(milliseconds: number) {
  if ((milliseconds as any) === 'auto') {
    // When recharts gets confused (empty data)
    return '';
  }
  return DateTime.fromMillis(milliseconds).toLocaleString(
    DateTime.DATETIME_SHORT,
  );
}

export function labelFormatter(epoch: number) {
  return <span style={infoText}>{formatDateTimeShort(epoch)}</span>;
}

export function labelFormatterWithoutTime(epoch: number) {
  return <span style={infoText}>{formatDateShort(epoch)}</span>;
}

export function tickFormatterX(epoch: number) {
  return formatDateShort(epoch);
}

export function tickFormatterY(duration: number) {
  if (duration === 0) {
    return '0';
  } else if (duration < 500) {
    return `${duration} ms`;
  }
  return formatDuration(duration)
    .replace(/second.*/, 'sec')
    .replace(/minute.*/, 'min')
    .replace(/hour.*/, 'h')
    .replace(/day.*/, 'd')
    .replace(/month.*/, 'm')
    .replace(/year.*/, 'y');
}

export function tooltipValueFormatter(durationOrCount: number, name: string) {
  return [
    <span style={infoText}>
      {capitalize(name)}:{' '}
      {name.endsWith(' count')
        ? durationOrCount
        : formatDuration(durationOrCount)}
    </span>,
    null,
  ];
}

export function formatDuration(millis: number) {
  let rest = Math.round(millis);
  const days = Math.floor(rest / (1000 * 60 * 60 * 24));
  rest -= days * (1000 * 60 * 60 * 24);
  const hours = Math.floor(rest / (1000 * 60 * 60));
  rest -= hours * (1000 * 60 * 60);
  const minutes = Math.floor(rest / (1000 * 60));
  rest -= minutes * (1000 * 60);
  const seconds = Math.floor(rest / 1000);
  rest -= seconds * 1000;
  const milliseconds = rest;

  if (!days && !hours && !minutes) {
    if (seconds < 1) {
      return `${milliseconds}ms`;
    } else if (seconds < 2) {
      return `${((milliseconds + seconds * 1000) / 1000).toFixed(1)}s`;
    }
  }

  const dur = Duration.fromObject({
    ...(days && { days }),
    ...(hours && { hours }),
    ...(minutes && !days && { minutes }),
    ...(seconds && !days && !hours && { seconds }),
  });

  return humanizeDuration(dur.toMillis(), { round: true });
}

export function formatDurationFromSeconds(seconds: number) {
  return formatDuration(seconds * 1000);
}
