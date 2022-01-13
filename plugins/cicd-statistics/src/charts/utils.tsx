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
import { formatISO9075, formatDistanceStrict } from 'date-fns';

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

export function labelFormatter(epoch: number) {
  return <span style={infoText}>{formatISO9075(new Date(epoch))}</span>;
}

export function labelFormatterWithoutTime(epoch: number) {
  return (
    <span style={infoText}>
      {formatISO9075(new Date(epoch), { representation: 'date' })}
    </span>
  );
}

export function tickFormatterX(epoch: number) {
  return formatISO9075(new Date(epoch), { representation: 'date' });
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

export function tooltipValueFormatter(duration: number, name: string) {
  return [
    <span style={infoText}>
      {name}: {formatDuration(duration)}
    </span>,
    null,
  ];
}

const baseDate = new Date();
const baseEpoch = baseDate.getTime();
export function formatDuration(milliseconds: number) {
  return formatDistanceStrict(baseDate, new Date(baseEpoch + milliseconds));
}
