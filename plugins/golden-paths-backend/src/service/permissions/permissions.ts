/*
 * Copyright 2026 The Backstage Authors
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
import { PermissionRule } from '@backstage/plugin-permission-node';
import { PermissionRuleParams } from '@backstage/plugin-permission-common';
import {
  GoldenPathEntityStepV1beta1,
  GoldenPathParametersV1beta1,
  RESOURCE_TYPE_GOLDEN_PATHS_GOLDEN_PATH,
  RESOURCE_TYPE_GOLDEN_PATHS_TASK,
} from '@backstage/plugin-golden-paths-common';
import { SerializedTask } from '../../golden-paths';

/**
 *
 * @public
 */
export type GoldenPathsPermissionRuleInput =
  | GoldenPathPermissionRuleInput
  | TaskPermissionRuleInput;

/**
 *
 * @public
 */
export type GoldenPathPermissionRuleInput<
  TParams extends PermissionRuleParams = PermissionRuleParams,
> = PermissionRule<
  GoldenPathEntityStepV1beta1 | GoldenPathParametersV1beta1,
  {},
  typeof RESOURCE_TYPE_GOLDEN_PATHS_GOLDEN_PATH,
  TParams
>;

export function isGoldenPathPermissionRuleInput(
  permissionRule: GoldenPathsPermissionRuleInput,
): permissionRule is GoldenPathPermissionRuleInput {
  return permissionRule.resourceType === RESOURCE_TYPE_GOLDEN_PATHS_GOLDEN_PATH;
}

/**
 * @public
 */
export type TaskPermissionRuleInput<
  TParams extends PermissionRuleParams = PermissionRuleParams,
> = PermissionRule<
  SerializedTask,
  {
    key: string;
    values?: string[];
  },
  typeof RESOURCE_TYPE_GOLDEN_PATHS_TASK,
  TParams
>;

export function isTaskPermissionRuleInput(
  permissionRule: GoldenPathsPermissionRuleInput,
): permissionRule is TaskPermissionRuleInput {
  return permissionRule.resourceType === RESOURCE_TYPE_GOLDEN_PATHS_TASK;
}
