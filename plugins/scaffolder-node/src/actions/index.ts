/*
 * Copyright 2023 The Backstage Authors
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

export {
  createTemplateAction,
  type TemplateActionOptionsV2,
  type TemplateActionOptionsV1,
  type TemplateActionOptions,
} from './createTemplateAction';
export {
  executeShellCommand,
  type ExecuteShellCommandOptions,
} from './executeShellCommand';
export { fetchContents, fetchFile } from './fetch';
export {
  addFiles,
  cloneRepo,
  commitAndPushBranch,
  commitAndPushRepo,
  createBranch,
  initRepoAndPush,
} from './gitHelpers';
export type {
  ActionContext,
  ActionContextV1,
  ActionContextV2,
  InferActionType,
  TemplateAction,
  TemplateActionV1,
  TemplateActionV2,
  TemplateExample,
} from './types';
export { getRepoSourceDirectory, parseRepoUrl } from './util';
