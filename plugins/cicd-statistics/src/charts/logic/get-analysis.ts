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
  };

  const definedValues = values.filter(
    value => typeof value[status] !== 'undefined',
  );

  analysis.max = definedValues.reduce(
    (prev, cur) => Math.max(prev, cur[status]!),
    0,
  );
  analysis.min = definedValues.reduce(
    (prev, cur) => Math.min(prev, cur[status]!),
    analysis.max,
  );
  analysis.avg =
    definedValues.length === 0
      ? 0
      : definedValues.reduce((prev, cur) => prev + cur[status]!, 0) /
        values.length;

  return analysis;
}
