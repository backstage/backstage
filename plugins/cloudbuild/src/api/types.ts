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

// export type Step = {
//   name: string;
//   status: string;
//   conclusion: string;
//   number: number; // starts from 1
//   started_at: string;
//   completed_at: string;
// };

// export type Job = {
//   html_url: string;
//   status: string;
//   conclusion: string;
//   started_at: string;
//   completed_at: string;
//   id: string;
//   name: string;
//   steps: Step[];
// };
export interface Build {
  id: string;
  status: string;
  source: Source;
  createTime: string;
  startTime: string;
  steps: Step[];
  timeout: string;
  projectId: string;
  logsBucket: string;
  sourceProvenance: SourceProvenance;
  buildTriggerId: string;
  options: Options;
  logUrl: string;
  substitutions: Substitutions;
  tags: string[];
  queueTtl: string;
  name: string;
  finishTime: any;
  results: Results;
  timing: Timing2;
}

export type Jobs = {
  total_count: number;
  jobs: Build[];
};

// export enum BuildStatus {
//   'success',
//   'failure',
//   'pending',
//   'running',
// }

export interface ActionsListWorkflowRunsForRepoResponseData {
  total_count: number;
  workflow_runs: {
    id: string;
    status: string;
    source: Source;
    createTime: string;
    startTime: string;
    steps: Step[];
    timeout: string;
    projectId: string;
    logsBucket: string;
    sourceProvenance: SourceProvenance;
    buildTriggerId: string;
    options: Options;
    logUrl: string;
    substitutions: Substitutions;
    tags: string[];
    queueTtl: string;
    name: string;
    finishTime: any;
    results: Results;
    timing: Timing2;
  }[];
}
export type ActionsGetWorkflowResponseData = {
  id: string;
  status: string;
  source: Source;
  createTime: string;
  startTime: string;
  steps: Step[];
  timeout: string;
  projectId: string;
  logsBucket: string;
  sourceProvenance: SourceProvenance;
  buildTriggerId: string;
  options: Options;
  logUrl: string;
  substitutions: Substitutions;
  tags: string[];
  queueTtl: string;
  name: string;
  finishTime: any;
  results: Results;
  timing: Timing2;
};
export type ActionsGetWorkflowRunResponseData = {
  id: string;
  status: string;
  source: Source;
  createTime: string;
  startTime: string;
  steps: Step[];
  timeout: string;
  projectId: string;
  logsBucket: string;
  sourceProvenance: SourceProvenance;
  buildTriggerId: string;
  options: Options;
  logUrl: string;
  substitutions: Substitutions;
  tags: string[];
  queueTtl: string;
  name: string;
  finishTime: any;
  results: Results;
  timing: Timing2;
};
export type EndpointInterface = {};

export interface Step {
  name: string;
  args: string[];
  id: string;
  waitFor: string[];
  entrypoint: string;
  volumes: Volume[];
  dir: string;
  timing: Timing;
  status: string;
  pullTiming: PullTiming;
}

export interface Timing2 {
  BUILD: BUILD;
  FETCHSOURCE: FETCHSOURCE;
}

export interface SourceProvenance {
  resolvedStorageSource: {};
  fileHashes: {};
}

export interface Options {
  machineType: string;
  substitutionOption: string;
  logging: string;
  dynamicSubstitutions: boolean;
}

export interface Substitutions {
  COMMIT_SHA: string;
  SHORT_SHA: string;
  BRANCH_NAME: string;
  REPO_NAME: string;
  REVISION_ID: string;
}

export interface Results {
  buildStepImages: string[];
  buildStepOutputs: string[];
}

export interface BUILD {
  startTime: string;
  endTime: string;
}

export interface FETCHSOURCE {
  startTime: string;
  endTime: string;
}

export interface StorageSource {
  bucket: string;
  object: string;
}

export interface Source {
  storageSource: StorageSource;
}

export interface Volume {
  name: string;
  path: string;
}

export interface Timing {
  startTime: string;
  endTime: string;
}

export interface PullTiming {
  startTime: string;
  endTime: string;
}

export interface ResolvedStorageSource {
  bucket: string;
  object: string;
  generation: string;
}
