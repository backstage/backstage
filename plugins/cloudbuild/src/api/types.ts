/*
 * Copyright 2020 The Backstage Authors
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

/** @public */
export interface ActionsListWorkflowRunsForRepoResponseData {
  builds: ActionsGetWorkflowResponseData[];
}

/** @public */
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

/** @public */
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

/** @public */
export interface Timing2 {
  BUILD: BUILD;
  FETCHSOURCE: FETCHSOURCE;
}

/** @public */
export interface SourceProvenance {
  resolvedStorageSource: {};
  fileHashes: {};
}

/** @public */
export interface Options {
  machineType: string;
  substitutionOption: string;
  logging: string;
  dynamicSubstitutions: boolean;
}

/** @public */
export interface Substitutions {
  COMMIT_SHA: string;
  SHORT_SHA: string;
  REF_NAME: string;
  REPO_NAME: string;
  REVISION_ID: string;
}

/** @public */
export interface Results {
  buildStepImages: string[];
  buildStepOutputs: string[];
}

/** @public */
export interface BUILD {
  startTime: string;
  endTime: string;
}

/** @public */
export interface FETCHSOURCE {
  startTime: string;
  endTime: string;
}

/** @public */
export interface StorageSource {
  bucket: string;
  object: string;
}

/** @public */
export interface Source {
  storageSource: StorageSource;
}

/** @public */
export interface Volume {
  name: string;
  path: string;
}

/** @public */
export interface Timing {
  startTime: string;
  endTime: string;
}

/** @public */
export interface PullTiming {
  startTime: string;
  endTime: string;
}

/** @public */
export interface ResolvedStorageSource {
  bucket: string;
  object: string;
  generation: string;
}
