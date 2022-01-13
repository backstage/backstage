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

import { Build, Stage, FilterStatusType, statusTypes } from '../apis/types';
import {
  Averagify,
  ChartableStage,
  ChartableStageAnalysis,
  ChartableStageDatapoints,
  ChartableStagesAnalysis,
} from './types';

function makeStage(name: string): ChartableStage {
  return {
    analysis: {
      unknown: { avg: 0, max: 0, min: 0 },
      enqueued: { avg: 0, max: 0, min: 0 },
      scheduled: { avg: 0, max: 0, min: 0 },
      running: { avg: 0, max: 0, min: 0 },
      aborted: { avg: 0, max: 0, min: 0 },
      succeeded: { avg: 0, max: 0, min: 0 },
      failed: { avg: 0, max: 0, min: 0 },
      stalled: { avg: 0, max: 0, min: 0 },
      expired: { avg: 0, max: 0, min: 0 },
    },
    combinedAnalysis: { avg: 0, max: 0, min: 0 },
    statusSet: new Set<FilterStatusType>(),
    name,
    values: [],
    stages: new Map(),
  };
}

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
    status: FilterStatusType,
    stageMap: Map<string, ChartableStage>,
    stage: Stage,
    __epoch: number,
  ) => {
    const { name, duration } = stage;

    const subChartableStage = getOrSetStage(stageMap, name);

    subChartableStage.statusSet.add(status);
    subChartableStage.values.push({
      __epoch,
      [status]: duration,
      [`${status} avg`]: duration,
    });

    stage.stages?.forEach(subStage => {
      recurseDown(status, subChartableStage.stages, subStage, __epoch);
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
      recurseDown(status, stages, subStage, __epoch);
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

  return { total, stages };
}

function getAnalysis(
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

interface FinalizeStageOptions {
  averageWidth: number;
  allEpochs: Array<number>;
}

/**
 * Calculate {avg, min, max} of a stage and its sub stages, recursively.
 * This is calculated per status (successful, failed, etc).
 */
function finalizeStage(stage: ChartableStage, options: FinalizeStageOptions) {
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

  const avgDuration: [duration: number, count: number] = [0, 0];

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

    avgDuration[0] += durationsDense.reduce((prev, cur) => prev + cur, 0);
    avgDuration[1] += durationsDense.length;

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

  const analysisValues = Object.values(analysis);
  combinedAnalysis.max = analysisValues.reduce(
    (prev, cur) => Math.max(prev, cur.max),
    0,
  );
  combinedAnalysis.min = analysisValues.reduce(
    (prev, cur) => Math.min(prev, cur.min),
    combinedAnalysis.max,
  );
  combinedAnalysis.avg = !avgDuration[1] ? 0 : avgDuration[0] / avgDuration[1];

  stage.stages.forEach(subStage => finalizeStage(subStage, options));
}

function average(values: number[]): number {
  return !values.length
    ? 0
    : Math.round(values.reduce((prev, cur) => prev + cur, 0) / values.length);
}

function getOrSetStage(
  stages: Map<string, ChartableStage>,
  name: string,
): ChartableStage {
  const stage = stages.get(name);
  if (stage) return stage;

  const newStage: ChartableStage = makeStage(name);
  stages.set(name, newStage);
  return newStage;
}
