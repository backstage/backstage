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
  createPermission,
  ResourcePermission,
  BasicPermission,
} from '@backstage/plugin-permission-common';

/**
 * Permission resource type which corresponds to cluster entities.
 */
export const RESOURCE_TYPE_KUBERNETES_RESOURCE = 'kubernetes-resource';

/**
 * Convenience type for kubernetes resource
 * {@link @backstage/plugin-permission-common#ResourcePermission}s.
 */
export type KubernetesResourcePermission = ResourcePermission<
  typeof RESOURCE_TYPE_KUBERNETES_RESOURCE
>;

/** This permission is used to authorize actions that involve one or more
 * kubernetes resources.
 *
 */
export const kubernetesClusterReadPermission: BasicPermission =
  createPermission({
    name: 'kubernetes.clusters',
    attributes: {
      action: 'read',
    },
  });

/**
 * This permission is used to authorize actions that involve reading one or more
 * workload resources from a kubernetes cluster.
 */
export const kubernetesWorkloadResourcesReadPermission = createPermission({
  name: 'kubernetes.workload.read',
  attributes: { action: 'read' },
  resourceType: RESOURCE_TYPE_KUBERNETES_RESOURCE,
});

/**
 * This permission is used to authorize actions that involve reading one or more
 * custom resources from a kubernetes cluster.
 */
export const kubernetesCustomResourcesReadPermission = createPermission({
  name: 'kubernetes.custom.read',
  attributes: { action: 'read' },
  resourceType: RESOURCE_TYPE_KUBERNETES_RESOURCE,
});

/**
 * List of all cluster permissions.
 */
export const kubernetesClusterPermissions = [
  kubernetesClusterReadPermission,
  kubernetesWorkloadResourcesReadPermission,
  kubernetesCustomResourcesReadPermission,
];
