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

import { RESOURCE_TYPE_SCAFFOLDER_TEMPLATE } from '@backstage/plugin-scaffolder-common';
import { createConditionExports } from '@backstage/plugin-permission-node';
import { scaffolderRules } from './rules';
import {
  AllOfCriteria,
  ConditionalPolicyDecision,
  PermissionCondition,
  PermissionRuleParams,
  ResourcePermission,
} from '@backstage/plugin-permission-common';

const { conditions: scaffolderConditions, createConditionalDecision } =
  createConditionExports({
    pluginId: 'scaffolder',
    resourceType: RESOURCE_TYPE_SCAFFOLDER_TEMPLATE,
    rules: scaffolderRules,
  });

export { scaffolderConditions };

export function createScaffolderConditionalDecision(
  permission: ResourcePermission<typeof RESOURCE_TYPE_SCAFFOLDER_TEMPLATE>,
  conditions: AllOfCriteria<
    PermissionCondition<
      typeof RESOURCE_TYPE_SCAFFOLDER_TEMPLATE,
      PermissionRuleParams
    >
  >['allOf'],
): ConditionalPolicyDecision {
  return createConditionalDecision(permission, { allOf: conditions });
}
