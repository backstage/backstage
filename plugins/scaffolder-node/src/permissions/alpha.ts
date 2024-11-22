/*
 * Copyright 2024 The Backstage Authors
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

import { PermissionRuleParams } from '@backstage/plugin-permission-common';
import { PermissionRule } from '@backstage/plugin-permission-node';
import {
  TemplateEntityStepV1beta3,
  TemplateEntityV1beta3,
  TemplateParametersV1beta3,
} from '@backstage/plugin-scaffolder-common';
import {
  RESOURCE_TYPE_SCAFFOLDER_ACTION,
  RESOURCE_TYPE_SCAFFOLDER_TEMPLATE,
  RESOURCE_TYPE_SCAFFOLDER_ENTITY,
} from '@backstage/plugin-scaffolder-common/alpha';

export * from './rules';
export * from './conditionExports';

/**
 * @alpha
 */
export type TemplateEntityPermissionRuleInput<
  TParams extends PermissionRuleParams = PermissionRuleParams,
> = PermissionRule<
  TemplateEntityV1beta3,
  {},
  typeof RESOURCE_TYPE_SCAFFOLDER_ENTITY,
  TParams
>;

/**
 * @alpha
 */
export type TemplatePermissionRuleInput<
  TParams extends PermissionRuleParams = PermissionRuleParams,
> = PermissionRule<
  TemplateEntityStepV1beta3 | TemplateParametersV1beta3,
  {},
  typeof RESOURCE_TYPE_SCAFFOLDER_TEMPLATE,
  TParams
>;

/**
 * @alpha
 */
export type ActionPermissionRuleInput<
  TParams extends PermissionRuleParams = PermissionRuleParams,
> = PermissionRule<
  TemplateEntityStepV1beta3 | TemplateParametersV1beta3,
  {},
  typeof RESOURCE_TYPE_SCAFFOLDER_ACTION,
  TParams
>;

/**
 * @alpha
 */
export type ScaffolderPermissionRule<
  TParams extends PermissionRuleParams = PermissionRuleParams,
> =
  | TemplateEntityPermissionRuleInput<TParams>
  | TemplatePermissionRuleInput<TParams>
  | ActionPermissionRuleInput<TParams>;

/**
 * @alpha
 */
export function isTemplateEntityPermissionRuleInput(
  permissionRule: ScaffolderPermissionRule,
): permissionRule is TemplateEntityPermissionRuleInput {
  return permissionRule.resourceType === RESOURCE_TYPE_SCAFFOLDER_ENTITY;
}

/**
 * @alpha
 */
export function isTemplatePermissionRuleInput(
  permissionRule: ScaffolderPermissionRule,
): permissionRule is TemplatePermissionRuleInput {
  return permissionRule.resourceType === RESOURCE_TYPE_SCAFFOLDER_TEMPLATE;
}

/**
 * @alpha
 */
export function isActionPermissionRuleInput(
  permissionRule: ScaffolderPermissionRule,
): permissionRule is ActionPermissionRuleInput {
  return permissionRule.resourceType === RESOURCE_TYPE_SCAFFOLDER_ACTION;
}
