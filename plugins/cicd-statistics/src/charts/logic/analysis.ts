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

import { FilterStatusType } from '../../apis/types';
import { ChartableStageAnalysis, ChartableStageDatapoints } from '../types';

export function getAnalysis(
  values: Array<ChartableStageDatapoints>,
  status: FilterStatusType,
): ChartableStageAnalysis {
  const analysis: ChartableStageAnalysis = {
    max: 0,
    min: 0,
    avg: 0,
    med: 0,
  };

  const definedValues = values
    .filter(value => typeof value[status] !== 'undefined')
    .map(value => value[status]!)
    .sort((a, b) => a - b);

  analysis.max = definedValues[definedValues.length - 1] ?? 0;

  analysis.min = definedValues[0] ?? 0;

  analysis.avg =
    definedValues.length === 0
      ? 0
      : definedValues.reduce((prev, cur) => prev + cur, 0) / values.length;

  analysis.med = definedValues[Math.ceil(definedValues.length / 2)] ?? 0;

  return analysis;
}

export function makeCombinedAnalysis(
  analysis: Record<FilterStatusType, ChartableStageAnalysis>,
  allDurations: Array<number>,
): ChartableStageAnalysis {
  if (analysis.succeeded) {
    // If succeeded is a viewed status, it's probably what's expected to see
    // overall. Otherwise combine all other.
    return analysis.succeeded;
  }

  const analysisValues = Object.values(analysis);

  const max = analysisValues.reduce((prev, cur) => Math.max(prev, cur.max), 0);
  const min = analysisValues.reduce(
    (prev, cur) => Math.min(prev, cur.min),
    max,
  );
  const avg = !allDurations.length
    ? 0
    : allDurations.reduce((prev, cur) => prev + cur, 0) / allDurations.length;
  allDurations.sort((a, b) => a - b);
  const med = allDurations[Math.ceil(allDurations.length / 2)] ?? 0;

  return {
    max,
    min,
    avg,
    med,
  };
}
