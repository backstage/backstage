/*
 * Copyright 2020 Spotify AB
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

/**
 * This is the tag name used to identify an evaluation set. It's used for filtering
 * in the run list view.
 */
export const EVALUATION_SET_TAG: string = 'mlflow.backstage.evaluation_set';

// https://www.mlflow.org/docs/latest/rest-api.html#mlflowexperimenttag
export type ExperimentTag = {
  name: string;
  value: string;
};

// https://www.mlflow.org/docs/latest/rest-api.html#mlflowexperiment
export type Experiment = {
  experiment_id: string;
  name: string;
  artifact_location: string;
  lifecycle_stage: string; // "active" or "deleted"
  last_update_time: number;
  creation_time: number;
  tags: ExperimentTag[];
};

// https://www.mlflow.org/docs/latest/rest-api.html#mlflowrunstatus
export enum RunStatus {
  RUNNING = 'RUNNING',
  SCHEDULED = 'SCHEDULED',
  FINISHED = 'FINISHED',
  FAILED = 'FAILED',
  KILLED = 'KILLED',
}

// https://www.mlflow.org/docs/latest/rest-api.html#mlflowruninfo
export type RunInfo = {
  run_id: string;
  // run_uuid: string;  - DEPRECATED
  experiment_id: string;
  user_id: string;
  status: RunStatus;
  start_time: number;
  end_time: number;
  artifact_uri: string;
  lifecycle_stage: string; // "active" or "deleted"
};

export type RunTag = {
  key: string;
  value: string;
};

// https://www.mlflow.org/docs/latest/rest-api.html#mlflowmetric
export type Metric = {
  key: string;
  value: number;
  timestamp: number;
  step: number;
};

// https://www.mlflow.org/docs/latest/rest-api.html#mlflowparam
export type Param = {
  key: string;
  value: string;
};

export type RunData = {
  metrics: Metric[];
  params: Param[];
  tags: RunTag[];
};

// https://www.mlflow.org/docs/latest/rest-api.html#run
export type Run = {
  info: RunInfo;
  data: RunData;
};
