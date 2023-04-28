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

import {
  RESOURCE_TYPE_SCAFFOLDER_TEMPLATE,
  RESOURCE_TYPE_SCAFFOLDER_ACTION,
} from '@backstage/plugin-scaffolder-common/alpha';
import { createConditionExports } from '@backstage/plugin-permission-node';
import { scaffolderTemplateRules, scaffolderActionRules } from './rules';

const templateConditionExports = createConditionExports({
  pluginId: 'scaffolder',
  resourceType: RESOURCE_TYPE_SCAFFOLDER_TEMPLATE,
  rules: scaffolderTemplateRules,
});

const actionsConditionExports = createConditionExports({
  pluginId: 'scaffolder',
  resourceType: RESOURCE_TYPE_SCAFFOLDER_ACTION,
  rules: scaffolderActionRules,
});

/**
 * `createScaffolderTemplateConditionalDecision` can be used when authoring policies to
 * create conditional decisions. It requires a permission of type
 * `ResourcePermission<'scaffolder-template'>` to be passed as the first parameter.
 * It's recommended that you use the provided `isResourcePermission` and
 * `isPermission` helper methods to narrow the type of the permission passed to
 * the handle method as shown below.
 *
 * ```
 * // MyAuthorizationPolicy.ts
 * ...
 * import { createScaffolderPolicyDecision } from '@backstage/plugin-scaffolder-backend';
 * import { RESOURCE_TYPE_SCAFFOLDER_TEMPLATE } from '@backstage/plugin-scaffolder-common';
 *
 * class MyAuthorizationPolicy implements PermissionPolicy {
 *   async handle(request, user) {
 *    ...
 *
 *    if (isResourcePermission(request.permission, RESOURCE_TYPE_SCAFFOLDER_TEMPLATE)) {
 *      return createScaffolderConditionalDecision(
 *        request.permission,
 *        { anyOf: [...insert conditions here...] }
 *      );
 *    }
 *
 *    ...
 * }
 *
 * ```
 *
 * @alpha
 */
export const createScaffolderTemplateConditionalDecision =
  templateConditionExports.createConditionalDecision;

/**
 * These conditions are used when creating conditional decisions for scaffolder
 * templates that are returned by authorization policies.
 *
 * @alpha
 */
export const scaffolderTemplateConditions = templateConditionExports.conditions;

/**
 * @alpha
 */
export const createScaffolderActionConditionalDecision =
  actionsConditionExports.createConditionalDecision;

/**
 *
 * These conditions are used when creating conditional decisions for scaffolder
 * actions that are returned by authorization policies.
 *
 * @alpha
 */
export const scaffolderActionConditions = actionsConditionExports.conditions;
