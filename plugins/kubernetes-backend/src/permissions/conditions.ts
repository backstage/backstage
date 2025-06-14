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
import { createConditionExports } from '@backstage/plugin-permission-node';
import { permissionRules } from './rules';

import { KUBERNETES_RESOURCES_RESOURCE_TYPE } from '@backstage/plugin-kubernetes-common';

const resourceConditionExports = createConditionExports({
  pluginId: 'kubernetes',
  resourceType: KUBERNETES_RESOURCES_RESOURCE_TYPE,
  rules: permissionRules,
});

/**
 * `createKubernetesConditionalDecision` can be used when authoring policies to
 * create conditional decisions. It requires a permission of type
 * `ResourcePermission<'kubernetes-entity'>` to be passed as the first parameter.
 * It's recommended that you use the provided `isResourcePermission` and
 * `isPermission` helper methods to narrow the type of the permission passed to
 * the handle method as shown below.
 *
 * ```
 * // MyAuthorizationPolicy.ts
 * ...
 * import { createKubernetesConditionalDecision } from '@backstage/plugin-kubernetes-backend';
 * import { KUBERNETES_RESOURCES_RESOURCE_TYPE } from '@backstage/plugin-kubernetes-common';
 *
 * class MyAuthorizationPolicy implements PermissionPolicy {
 *   async handle(request, user) {
 *    ...
 *
 *    if (isResourcePermission(request.permission, KUBERNETES_RESOURCES_RESOURCE_TYPE)) {
 *      return createKubernetesConditionalDecision(
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
export const createKubernetesConditionalDecision =
  resourceConditionExports.createConditionalDecision;

/**
 * The conditions are used when creating conditional decisions for kubernetes
 * enabled catalog-entities that are returned by authorization policies.
 *
 * @alha
 */
export const kubernetesCondition = resourceConditionExports.conditions;
