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

import { FilterStatusType } from '../apis/types';

export type Averagify<T extends string> = `${T} avg`;

export type ChartableStageDatapoints = {
  __epoch: number;
} & {
  [status in FilterStatusType]?: number;
} & {
  [status in Averagify<FilterStatusType>]?: number;
};

export interface ChartableStageAnalysis {
  max: number;
  min: number;
  avg: number;
}

export interface ChartableStage {
  analysis: Record<FilterStatusType, ChartableStageAnalysis>;
  combinedAnalysis: ChartableStageAnalysis;
  name: string;
  values: Array<ChartableStageDatapoints>;
  statusSet: Set<FilterStatusType>;

  stages: Map<string, ChartableStage>;
}

export interface ChartableStagesAnalysis {
  total: ChartableStage;
  stages: Map<string, ChartableStage>;
}
