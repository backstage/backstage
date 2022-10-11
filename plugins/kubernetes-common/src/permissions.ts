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
export const kubernetesClusterReadPermission: BasicPermission = createPermission({
    name: 'kubernetes.clusters',
    attributes: {
        action: 'read',
    }
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
    kubernetesCustomResourcesReadPermission
];