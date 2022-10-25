import { Entity, RELATION_OWNED_BY } from '@backstage/catalog-model';
import { RESOURCE_TYPE_KUBERNETES_RESOURCE } from '@backstage/plugin-kubernetes-common';
import { createKubernetesPermissionRule } from './util';

/**
 * A Resource {@link @backstage/plugin-permission-node#PermissionRule} which
 * filters for resources with a specified owner.
 *
 * @alpha
 */
// export const isEntityOwner = createKubernetesPermissionRule({
//   name: 'IS_ENTITY_OWNER',
//   description: 'Allow entities owned by the current user',
//   resourceType: RESOURCE_TYPE_KUBERNETES_RESOURCE,
//   apply: (resource: Entity, claims: string[]) => {
//     if (!resource.relations) {
//       return false;
//     }

//     return resource.relations
//       .filter(relation => relation.type === RELATION_OWNED_BY)
//       .some(relation => claims.includes(relation.targetRef));
//   },
//   toQuery: (claims: string[]) => ({
//     key: 'relations.ownedBy',
//     values: claims,
//   }),
// });
