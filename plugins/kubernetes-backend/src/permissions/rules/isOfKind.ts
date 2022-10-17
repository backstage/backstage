import { Entity, RELATION_OWNED_BY } from '@backstage/catalog-model';
import { RESOURCE_TYPE_KUBERNETES_RESOURCE } from '@backstage/plugin-kubernetes-common';
import { createKubernetesPermissionRule } from './util';

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

// export const isEntityKind = createCatalogPermissionRule({
//     name: 'IS_ENTITY_KIND',
//     description: 'Allow entities with the specified kind',
//     resourceType: RESOURCE_TYPE_CATALOG_ENTITY,
//     apply(resource: Entity, kinds: string[]) {
//       const resourceKind = resource.kind.toLocaleLowerCase('en-US');
//       return kinds.some(kind => kind.toLocaleLowerCase('en-US') === resourceKind);
//     },
//     toQuery(kinds: string[]): EntitiesSearchFilter {
//       return {
//         key: 'kind',
//         values: kinds.map(kind => kind.toLocaleLowerCase('en-US')),
//       };
//     },
// });
  
//entity type used by the catalog, should i created a kubernetesResource type to be used by the kubernetes plugin?

//wuld that type need to match the general structure of the returned json object

export const isOfKind = createKubernetesPermissionRule({
    name: 'IS_OF_KIND',
    description: 'Allow kubernetes resources defined by the policy',
    resourceType: RESOURCE_TYPE_KUBERNETES_RESOURCE,
    apply: (resource: Entity, claims: string[]) => {
      if (!resource.relations) {
        return false;
      }
  
      return resource.relations
        .filter(relation => relation.type === RELATION_OWNED_BY)
        .some(relation => claims.includes(relation.targetRef));
    },
    toQuery: (claims: string[]) => ({
      key: 'relations.ownedBy',
      values: claims,
    }),
  });
