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

import { RESOURCE_TYPE_KUBERNETES_RESOURCE } from '@backstage/plugin-kubernetes-common';
import { createConditionExports } from '@backstage/plugin-permission-node';
import { permissionRules } from './rules';

const { conditions, createConditionalDecision } = createConditionExports({
  pluginId: 'kubernetes',
  resourceType: RESOURCE_TYPE_KUBERNETES_RESOURCE,
  rules: permissionRules,
});

/**
 * These conditions are used when creating conditional decisions for kubernetes resources that are returned by authorization policies.
 *
 * @alpha
 */
export const kubernetesConditions = conditions;

/**
 * `createKubernetesConditionalDecision` can be used when authoring policies to
 * create conditional decisions. It requires a permission of type
 * `ResourcePermission<'kubernetes-resource'>` to be passed as the first parameter.
 * It's recommended that you use the provided `isResourcePermission` and
 * `isPermission` helper methods to narrow the type of the permission passed to
 * the handle method as shown below.
 *
 * ```
 * // MyAuthorizationPolicy.ts
 * ...
 * import { createKubernetesPolicyDecision } from '@backstage/kubernetes-backend';
 * import { RESOURCE_TYPE_KUBERNETES_RESOURCE } from '@backstage/kubernetes-common';
 *
 * class MyAuthorizationPolicy implements PermissionPolicy {
 *   async handle(request, user) {
 *     ...
 *
 *     if (isResourcePermission(request.permission, RESOURCE_TYPE_KUBERNETES_RESOURCE)) {
 *       return createKubernetesConditionalDecision(
 *         request.permission,
 *         { anyOf: [...insert conditions here...] }
 *       );
 *     }
 *
 *     ...
 * }
 * ```
 *
 * @alpha
 */
export const createKubernetesConditionalDecision = createConditionalDecision;
