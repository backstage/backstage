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

import { createPermission } from '@backstage/plugin-permission-common';

/**
 * Permission resource type which corresponds to kubernetes resources
 */
export const KUBERNETES_RESOURCES_RESOURCE_TYPE = 'kubernetes-entity';

/** This permission is used to check access to the proxy endpoint
 * @public
 */
export const kubernetesProxyPermission = createPermission({
  name: 'kubernetes.proxy',
  attributes: {},
});

/** This permission is used to check access to the /resources and /services/:serviceId endpoints
 * @public
 */
export const kubernetesResourcesReadPermission = createPermission({
  name: 'kubernetes.resources.read',
  attributes: { action: 'read' },
  resourceType: KUBERNETES_RESOURCES_RESOURCE_TYPE,
});

/** This permission is used to check access to the /clusters endpoint
 * @public
 */
export const kubernetesClustersReadPermission = createPermission({
  name: 'kubernetes.clusters.read',
  attributes: { action: 'read' },
});

/**
 * List of the kubernetes proxy permissions
 * @public
 */
export const kubernetesProxyPermissions = [kubernetesProxyPermission];

/**
 * List of the kubernetes resources permissions
 * @public
 */
export const kubernetesResourcesPermissions = [
  kubernetesResourcesReadPermission,
];

/**
 * List of the kubernetes cluster permissions
 * @public
 */
export const kubernetesClustersPermissions = [kubernetesClustersReadPermission];

/**
 * List of all kubernetes permissions.
 * @public
 */
export const kubernetesPermissions = [
  ...kubernetesProxyPermissions,
  ...kubernetesResourcesPermissions,
  ...kubernetesClustersPermissions,
];
