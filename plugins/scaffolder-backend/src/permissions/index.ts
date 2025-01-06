import {
  RESOURCE_TYPE_SCAFFOLDER_ACTION,
  RESOURCE_TYPE_SCAFFOLDER_TEMPLATE,
} from '@backstage/plugin-scaffolder-common/alpha';
import {
  ActionPermissionRuleInput,
  ScaffolderPermissionRuleInput,
  TemplatePermissionRuleInput,
} from '@backstage/plugin-scaffolder-node/alpha';

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
export {
  createScaffolderTemplateConditionalDecision,
  scaffolderTemplateConditions,
  createScaffolderActionConditionalDecision,
  scaffolderActionConditions,
} from './conditionExports';

export * from './rules';

/**
 * @internal
 */
export function isTemplatePermissionRuleInput(
  permissionRule: ScaffolderPermissionRuleInput,
): permissionRule is TemplatePermissionRuleInput {
  return permissionRule.resourceType === RESOURCE_TYPE_SCAFFOLDER_TEMPLATE;
}

/**
 * @internal
 */
export function isActionPermissionRuleInput(
  permissionRule: ScaffolderPermissionRuleInput,
): permissionRule is ActionPermissionRuleInput {
  return permissionRule.resourceType === RESOURCE_TYPE_SCAFFOLDER_ACTION;
}
