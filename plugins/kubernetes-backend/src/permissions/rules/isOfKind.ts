// import { Entity, RELATION_OWNED_BY } from '@backstage/catalog-model';
import { RESOURCE_TYPE_KUBERNETES_RESOURCE } from '@backstage/plugin-kubernetes-common';
import { createKubernetesPermissionRule } from './util';
import { KubernetesObjectTypes } from '../..';
/**
 * A Resource {@link @backstage/plugin-permission-node#PermissionRule} which
 * filters for resources by a given kind type.
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
  
//TODO: (rubenv-dev) Determine whether or not KubernetesObjectTypes should be the only types users can provide as paramaters in a permission policy. We probably need to switch to ObjectToFetch type as a resource in this permission rule and then adjust workload endpoint accordingly.

export const isOfKind = createKubernetesPermissionRule({
    name: 'IS_OF_KIND',
    description: 'Allow kubernetes resources with the specified kind',
    resourceType: RESOURCE_TYPE_KUBERNETES_RESOURCE,
    apply: (resource: KubernetesObjectTypes, kinds: string[]) => {
      const resourceKind = resource.toLocaleLowerCase('en-US');
      return kinds.some(kind => kind.toLocaleLowerCase('en-US') === resourceKind);
    },
    toQuery(kinds: string[]) {
      return {
        key: 'kind',
        values: kinds.map(kind => kind.toLocaleLowerCase('en-US')),
      };
    },
});
