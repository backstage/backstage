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

import { map } from 'already';

import { Build, Stage, FilterStatusType } from '../../apis/types';
import { ChartableStage, ChartableStagesAnalysis } from '../types';
import { getOrSetStage, makeStage, sortStatuses } from './utils';
import { finalizeStage } from './finalize-stage';
import { dailySummary } from './daily-summary';

export interface ChartableStagesOptions {
  normalizeTimeRange: boolean;
}

/**
 * Converts a list of builds, each with a tree of stages (and durations) into a
 * merged tree of stages, and calculates {avg, min, max} of each stage.
 */
export async function buildsToChartableStages(
  builds: Array<Build>,
  options: ChartableStagesOptions,
): Promise<ChartableStagesAnalysis> {
  const { normalizeTimeRange } = options;

  const total: ChartableStage = makeStage('Total');

  const recurseDown = (
    stageMap: Map<string, ChartableStage>,
    stage: Stage,
    __epoch: number,
  ) => {
    const { name, status, duration } = stage;

    const subChartableStage = getOrSetStage(stageMap, name);

    subChartableStage.statusSet.add(status);
    subChartableStage.values.push({
      __epoch,
      [status]: duration,
      [`${status} avg`]: duration,
    });

    stage.stages?.forEach(subStage => {
      recurseDown(subChartableStage.stages, subStage, __epoch);
    });
  };

  const stages = new Map<string, ChartableStage>();

  await map(builds, { chunk: 'idle' }, build => {
    const { duration, requestedAt, status } = build;
    const __epoch = requestedAt.getTime();

    total.statusSet.add(status);
    total.values.push({
      __epoch,
      [status]: duration,
      [`${status} avg`]: duration,
    });

    build.stages?.forEach(subStage => {
      recurseDown(stages, subStage, __epoch);
    });
  });

  const allEpochs = normalizeTimeRange
    ? builds.map(build => build.requestedAt.getTime())
    : [];

  // Recurse down again and calculate averages
  await map([...stages.values()], { chunk: 'idle' }, stage =>
    finalizeStage(stage, { allEpochs, averageWidth: 10 }),
  );
  finalizeStage(total, { allEpochs, averageWidth: 10 });

  const daily = dailySummary(builds);

  const statuses = findStatuses(total, [...stages.values()]);

  return { daily, total, stages, statuses };
}

function findStatuses(
  total: ChartableStage,
  stages: Array<ChartableStage>,
): Array<string> {
  const statuses = new Set<string>();

  const addStatuses = (set: Set<FilterStatusType>) => {
    set.forEach(status => {
      statuses.add(status);
    });
  };

  addStatuses(total.statusSet);

  const recurse = (subStages: Array<ChartableStage>) => {
    subStages.forEach(stage => {
      addStatuses(stage.statusSet);
      recurse([...stage.stages.values()]);
    });
  };
  recurse(stages);

  return sortStatuses([...statuses]);
}
