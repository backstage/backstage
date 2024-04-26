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

import { FilterStatusType, TriggerReason } from '../apis/types';

export const statusColorMap: Record<FilterStatusType, string> = {
  unknown: '#3d01a4',
  enqueued: '#7ad1b9',
  scheduled: '#0391ce',
  running: '#f3f318',
  aborted: '#8600af',
  succeeded: '#66b032',
  failed: '#fe2712',
  stalled: '#fb9904',
  expired: '#a7194b',
};

export const triggerColorMap: Record<TriggerReason, string> = {
  scm: '#0391ce',
  manual: '#a7194b',
  internal: '#82ca9d',
  other: '#f3f318',
};

export const fireColors: Array<[percent: string, color: string]> = [
  ['5%', '#e19678'],
  ['30%', '#dfe178'],
  ['50%', '#82ca9d'],
  ['95%', '#82ca9d'],
];

export const colorStroke = '#c0c0c0';
export const colorStrokeAvg = '#788ee1';
