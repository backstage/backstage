/*
 * Copyright 2023 The Backstage Authors
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
  createPermission,
  ResourcePermission,
} from '@backstage/plugin-permission-common';

/**
 * The resource type for Kubernetes proxy requests.
 * Used to enable conditional permission policies on proxy operations.
 * @public
 */
export const RESOURCE_TYPE_KUBERNETES_PROXY = 'kubernetes-proxy-request';

/**
 * Convenience type for Kubernetes proxy request
 * {@link @backstage/plugin-permission-common#ResourcePermission}s.
 * @public
 */
export type KubernetesProxyPermission = ResourcePermission<
  typeof RESOURCE_TYPE_KUBERNETES_PROXY
>;

/** This permission is used to check access to the proxy endpoint.
 *
 * @remarks
 * This is a resource permission that supports conditional policies based on
 * request attributes such as cluster, namespace, resource type, action, and verb.
 *
 * @public
 */
export const kubernetesProxyPermission = createPermission({
  name: 'kubernetes.proxy',
  attributes: {},
  resourceType: RESOURCE_TYPE_KUBERNETES_PROXY,
});

/** This permission is used to check access to the /resources and /services/:serviceId endpoints
 * @public
 */
export const kubernetesResourcesReadPermission = createPermission({
  name: 'kubernetes.resources.read',
  attributes: {
    action: 'read',
  },
});

/** This permission is used to check access to the /clusters endpoint
 * @public
 */
export const kubernetesClustersReadPermission = createPermission({
  name: 'kubernetes.clusters.read',
  attributes: {
    action: 'read',
  },
});

/**
 * List of all Kubernetes permissions.
 * @public
 */
export const kubernetesPermissions = [
  kubernetesProxyPermission,
  kubernetesResourcesReadPermission,
  kubernetesClustersReadPermission,
];
