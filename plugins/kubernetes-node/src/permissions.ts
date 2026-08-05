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

import { RESOURCE_TYPE_KUBERNETES_PROXY } from '@backstage/plugin-kubernetes-common';
import { createPermissionResourceRef } from '@backstage/plugin-permission-node';
import { KubernetesProxyRequest } from './types/permissions';

/**
 * Filter type for Kubernetes proxy permission queries.
 * Since the proxy evaluates all conditions in-memory (no backing datastore),
 * this type serves as a placeholder for the query system.
 *
 * @public
 */
export type KubernetesProxyFilter = {
  /** The property key to match on */
  key: string;
  /** The values to match */
  values?: string[];
};

/**
 * Permission resource ref for Kubernetes proxy requests.
 * Used by the permission integration to evaluate conditions against
 * parsed proxy request attributes.
 *
 * @public
 */
export const kubernetesProxyPermissionResourceRef = createPermissionResourceRef<
  KubernetesProxyRequest,
  KubernetesProxyFilter
>().with({
  pluginId: 'kubernetes',
  resourceType: RESOURCE_TYPE_KUBERNETES_PROXY,
});
