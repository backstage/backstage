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

export type Averagify<T extends string> = `${T} avg`;
export type Countify<T extends string> = `${T} count`;

export type Epoch = { __epoch: number };

export type ChartableStageDatapoints = Epoch & {
  [status in FilterStatusType]?: number;
} & {
  [status in Averagify<FilterStatusType>]?: number;
} & {
  [status in Countify<FilterStatusType>]?: number;
};

export interface ChartableStageAnalysis {
  /** Maximum duration */
  max: number;
  /** Minimum duration */
  min: number;
  /** Average duration */
  avg: number;
  /** Median duration */
  med: number;
}

export interface ChartableStage {
  analysis: Record<FilterStatusType, ChartableStageAnalysis>;
  combinedAnalysis: ChartableStageAnalysis;
  name: string;
  values: Array<ChartableStageDatapoints>;
  statusSet: Set<FilterStatusType>;

  stages: Map<string, ChartableStage>;
}

export type TriggerReasonsDatapoint = {
  [K in TriggerReason]?: number;
};
export type StatusesDatapoint = { [status in FilterStatusType]?: number };

export type ChartableDailyDatapoint = Epoch &
  TriggerReasonsDatapoint &
  StatusesDatapoint;

export interface ChartableDaily {
  values: Array<ChartableDailyDatapoint>;

  /**
   * The build trigger reasons
   */
  triggerReasons: Array<string>;

  /**
   * The top-level (build) statuses
   */
  statuses: Array<string>;
}

export interface ChartableStagesAnalysis {
  /**
   * Summary of statuses and trigger reasons per day
   */
  daily: ChartableDaily;

  /**
   * Total aggregates of sub stages
   */
  total: ChartableStage;

  /**
   * Top-level stages {name -> stage}
   */
  stages: Map<string, ChartableStage>;

  /**
   * All statuses found deeper in the stage tree. A stage might have been
   * _aborted_ although the build actually _failed_, e.g.
   */
  statuses: Array<string>;
}
