import { RESOURCE_TYPE_KUBERNETES_RESOURCE } from '@backstage/plugin-kubernetes-common';
import { createConditionExports } from '@backstage/plugin-permission-node';
import { permissionRules } from './rules';

const { conditions, createConditionalDecision } = createConditionExports({
    pluginId: 'kubernetes',
    resourceType: RESOURCE_TYPE_KUBERNETES_RESOURCE,
    rules: permissionRules,
  });

/**
 * These conditions are used when creating conditional decisions for kubernetes resources that are returned by authorization policies.
 *
 * @alpha
*/
export const kubernetesConditions = conditions;

/**
 * `createKubernetesConditionalDecision` can be used when authoring policies to
 * create conditional decisions. It requires a permission of type
 * `ResourcePermission<'kubernetes-resource'>` to be passed as the first parameter.
 * It's recommended that you use the provided `isResourcePermission` and
 * `isPermission` helper methods to narrow the type of the permission passed to
 * the handle method as shown below.
 *
 * ```
 * // MyAuthorizationPolicy.ts
 * ...
 * import { createKubernetesPolicyDecision } from '@backstage/kubernetes-backend';
 * import { RESOURCE_TYPE_KUBERNETES_RESOURCE } from '@backstage/kubernetes-common';
 *
 * class MyAuthorizationPolicy implements PermissionPolicy {
 *   async handle(request, user) {
 *     ...
 *
 *     if (isResourcePermission(request.permission, RESOURCE_TYPE_KUBERNETES_RESOURCE)) {
 *       return createKubernetesConditionalDecision(
 *         request.permission,
 *         { anyOf: [...insert conditions here...] }
 *       );
 *     }
 *
 *     ...
 * }
 * ```
 *
 * @alpha
 */
export const createKubernetesConditionalDecision = createConditionalDecision;