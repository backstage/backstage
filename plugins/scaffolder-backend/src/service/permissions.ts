/*
 * Copyright 2025 The Backstage Authors
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
import {
  TemplateEntityStepV1beta3,
  TemplateParametersV1beta3,
} from '@backstage/plugin-scaffolder-common';
import {
  RESOURCE_TYPE_SCAFFOLDER_ACTION,
  RESOURCE_TYPE_SCAFFOLDER_TASK,
  RESOURCE_TYPE_SCAFFOLDER_TEMPLATE,
} from '@backstage/plugin-scaffolder-common/alpha';
import { PermissionRuleParams } from '@backstage/plugin-permission-common';
import { SerializedTask } from '@backstage/plugin-scaffolder-node';

/**
 *
 * @public
 */
export type ScaffolderPermissionRuleInput =
  | TemplatePermissionRuleInput
  | ActionPermissionRuleInput
  | TaskPermissionRuleInput;

/**
 * @public
 */
export type TemplatePermissionRuleInput<
  TParams extends PermissionRuleParams = PermissionRuleParams,
> = PermissionRule<
  TemplateEntityStepV1beta3 | TemplateParametersV1beta3,
  {},
  typeof RESOURCE_TYPE_SCAFFOLDER_TEMPLATE,
  TParams
>;
export function isTemplatePermissionRuleInput(
  permissionRule: ScaffolderPermissionRuleInput,
): permissionRule is TemplatePermissionRuleInput {
  return permissionRule.resourceType === RESOURCE_TYPE_SCAFFOLDER_TEMPLATE;
}

/**
 *
 * @public
 */
export type ActionPermissionRuleInput<
  TParams extends PermissionRuleParams = PermissionRuleParams,
> = PermissionRule<
  TemplateEntityStepV1beta3 | TemplateParametersV1beta3,
  {},
  typeof RESOURCE_TYPE_SCAFFOLDER_ACTION,
  TParams
>;
export function isActionPermissionRuleInput(
  permissionRule: ScaffolderPermissionRuleInput,
): permissionRule is ActionPermissionRuleInput {
  return permissionRule.resourceType === RESOURCE_TYPE_SCAFFOLDER_ACTION;
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
  typeof RESOURCE_TYPE_SCAFFOLDER_TASK,
  TParams
>;
export function isTaskPermissionRuleInput(
  permissionRule: ScaffolderPermissionRuleInput,
): permissionRule is TaskPermissionRuleInput {
  return permissionRule.resourceType === RESOURCE_TYPE_SCAFFOLDER_TASK;
}
