import { Entity } from '@backstage/catalog-model';
import { RESOURCE_TYPE_KUBERNETES_RESOURCE } from '@backstage/plugin-kubernetes-common';
import {
  makeCreatePermissionRule,
  PermissionRule,
} from '@backstage/plugin-permission-node';
import { EntitiesSearchFilter } from '/Users/rvallejohome/Workspace/backstage-oss/backstage-work/plugins/catalog-backend/src/catalog/types';
// import { EntitiesSearchFilter } from '../../../plugins/catalog-backend/src/catalog/types';
/**
 * Convenience type for {@link @backstage/plugin-permission-node#PermissionRule}
 * instances with the correct resource type and resource to work with
 * the catalog.
 *
 * @alpha
 */
export type KubernetesPermissionRule<TParams extends unknown[] = unknown[]> =
  PermissionRule<Entity, EntitiesSearchFilter,'kubernetes-resource', TParams>;

/**
 * Helper function for creating correctly-typed
 * {@link @backstage/plugin-permission-node#PermissionRule}s for the
 * kubernetes-backend.
 *
 * @alpha
 */
export const createKubernetesPermissionRule = makeCreatePermissionRule<
  Entity,
  EntitiesSearchFilter,
  typeof RESOURCE_TYPE_KUBERNETES_RESOURCE
>();
