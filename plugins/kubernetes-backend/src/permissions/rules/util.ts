import { KubernetesObjectTypes } from '@backstage/plugin-kubernetes-backend';
import { RESOURCE_TYPE_KUBERNETES_RESOURCE } from '@backstage/plugin-kubernetes-common';
import {
  makeCreatePermissionRule,
  PermissionRule,
} from '@backstage/plugin-permission-node';
/**
 * Convenience type for {@link @backstage/plugin-permission-node#PermissionRule}
 * instances with the correct resource type and resource to work with
 * the catalog.
 *
 * @alpha
 */

//TODO: (rubenv-dev) switch KubernetesObjectTypes type requirement to something wider like ObjectToFetch to be used on the custom resources endpoint. 
export type KubernetesPermissionRule<TParams extends unknown[] = unknown[]> =
  PermissionRule<KubernetesObjectTypes, unknown,'kubernetes-resource', TParams>;

/**
 * Helper function for creating correctly-typed
 * {@link @backstage/plugin-permission-node#PermissionRule}s for the
 * kubernetes-backend.
 *
 * @alpha
 */
export const createKubernetesPermissionRule = makeCreatePermissionRule<
  KubernetesObjectTypes,
  unknown,
  typeof RESOURCE_TYPE_KUBERNETES_RESOURCE
>();
