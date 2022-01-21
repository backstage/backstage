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

import { FilterStatusType, statusTypes } from '../../apis/types';
import { Averagify, ChartableStage } from '../types';
import { countBuildsPerDay } from './count-builds-per-day';
import { getAnalysis, makeCombinedAnalysis } from './analysis';
import { average } from './utils';

interface FinalizeStageOptions {
  averageWidth: number;
  allEpochs: Array<number>;
}

/**
 * Calculate:
 *   * {avg, min, max}
 *   * count per day
 * of a stage and its sub stages, recursively.
 *
 * This is calculated per status (successful, failed, etc).
 */
export function finalizeStage(
  stage: ChartableStage,
  options: FinalizeStageOptions,
) {
  const { averageWidth, allEpochs } = options;
  const { values, analysis, combinedAnalysis } = stage;

  if (allEpochs.length > 0) {
    const valueEpochs = new Set(values.map(value => value.__epoch));

    allEpochs.forEach(epoch => {
      if (!valueEpochs.has(epoch)) {
        values.push({ __epoch: epoch });
      }
    });
  }

  values.sort((a, b) => a.__epoch - b.__epoch);

  countBuildsPerDay(values);

  const allDurations: Array<number> = [];

  statusTypes.forEach(status => {
    analysis[status] = getAnalysis(values, status);

    const durationsIndexes = values
      .map(value => value[status])
      .map((duration, index) => ({ index, duration }))
      .filter(({ duration }) => typeof duration !== 'undefined')
      .map(({ index }) => index);
    const durationsDense = values
      .map(value => value[status])
      .filter(
        (duration): duration is number => typeof duration !== 'undefined',
      );

    durationsDense.forEach(dur => allDurations.push(dur));

    const averages = durationsDense.map((_, i) =>
      average(
        durationsDense.slice(
          Math.max(i - averageWidth, 0),
          Math.min(i + averageWidth, durationsDense.length),
        ),
      ),
    );

    averages.forEach((avg, index) => {
      const key: Averagify<FilterStatusType> = `${status} avg`;
      values[durationsIndexes[index]][key] = avg;
    });
  });

  Object.assign(combinedAnalysis, makeCombinedAnalysis(analysis, allDurations));

  stage.stages.forEach(subStage => finalizeStage(subStage, options));
}
