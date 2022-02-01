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

import { RESOURCE_TYPE_CATALOG_ENTITY } from '@backstage/plugin-catalog-common';
import { createConditionExports } from '@backstage/plugin-permission-node';
import { permissionRules } from './rules';

const conditionExports = createConditionExports({
  pluginId: 'catalog',
  resourceType: RESOURCE_TYPE_CATALOG_ENTITY,
  rules: permissionRules,
});

/**
 * These conditions are used when creating conditional decisions that are returned
 * by authorization policies.
 * @public
 */
export const catalogConditions = conditionExports.conditions;

/**
 * `createCatalogPolicyDecision` can be used when authoring policies to create
 * conditional decisions.
 *
 * ```
 * // MyAuthorizationPolicy.ts
 * ...
 * import { createCatalogPolicyDecision } from '@backstage/plugin-catalog-backend';
 *
 * class MyAuthorizationPolicy implements PermissionPolicy {
 *   async handle(request, user) {
 *     ...
 *
 *     return createCatalogPolicyDecision({
 *       anyOf: [...insert conditions here...],
 *     });
 *   }
 * }
 * ```
 * @public
 */
export const createCatalogPolicyDecision =
  conditionExports.createPolicyDecision;
