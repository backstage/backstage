import { isOfKind } from './isOfKind';

/**
 * These permission rules can be used to conditionally filter Kubernetes resources
 * or describe a user's access to the resources.
 *
 * @alpha
 */
export const permissionRules = {
    isOfKind,
};

export type { KubernetesPermissionRule } from './util';
export { createKubernetesPermissionRule } from './util';