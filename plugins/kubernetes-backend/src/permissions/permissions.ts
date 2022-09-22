import {
    createPermission,
    ResourcePermission,
    BasicPermission,
  } from '@backstage/plugin-permission-common';

/**
 * Permission resource type which corresponds to cluster entities.
 */
export const RESOURCE_TYPE_CLUSTER_ENTITY = 'cluster-entity';

/**
 * Convenience type for cluster entity
 * {@link @backstage/plugin-permission-common#ResourcePermission}s.
 */
 export type ClusterEntityPermission = ResourcePermission<
 typeof RESOURCE_TYPE_CLUSTER_ENTITY
>;

 /** This permission is used to authorize actions that involve reading one or more
 * entities from the clusters endpoint.
 * 
 */

export const clustersReadPermission: BasicPermission = createPermission({
    name: 'kubernetes.clusters',
    attributes: {
        action: 'read',
    }
}) 

/**
 * List of all cluster permissions.
 */
export const clusterPermissions = [
    clustersReadPermission
  ];