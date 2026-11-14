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

import { createConditionExports } from '@backstage/plugin-permission-node';
import {
  isCluster,
  isNamespace,
  isResourceType,
  isAction,
  isVerb,
} from './rules';
import { kubernetesProxyPermissionResourceRef } from '@backstage/plugin-kubernetes-node';

const { conditions, createConditionalDecision } = createConditionExports({
  resourceRef: kubernetesProxyPermissionResourceRef,
  rules: { isCluster, isNamespace, isResourceType, isAction, isVerb },
});

/**
 * Conditions for creating conditional decisions for Kubernetes proxy requests.
 *
 * @example
 * ```typescript
 * import { kubernetesConditions, createKubernetesProxyConditionalDecision } from '@backstage/plugin-kubernetes-backend';
 *
 * // In a PermissionPolicy:
 * if (isResourcePermission(request.permission, RESOURCE_TYPE_KUBERNETES_PROXY)) {
 *   return createKubernetesProxyConditionalDecision(
 *     request.permission,
 *     { allOf: [
 *       kubernetesConditions.isAction({ actions: ['read'] }),
 *       kubernetesConditions.isCluster({ clusters: ['production'] }),
 *     ]},
 *   );
 * }
 * ```
 *
 * @public
 */
export const kubernetesConditions = conditions;

/**
 * Creates a conditional decision for Kubernetes proxy requests.
 *
 * Use this in your PermissionPolicy implementation to create attribute-based
 * access control decisions for the Kubernetes proxy endpoint.
 *
 * @public
 */
export const createKubernetesProxyConditionalDecision =
  createConditionalDecision;
