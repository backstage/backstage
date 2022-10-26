// import { Entity, RELATION_OWNED_BY } from '@backstage/catalog-model';
import { RESOURCE_TYPE_KUBERNETES_RESOURCE } from '@backstage/plugin-kubernetes-common';
import { createKubernetesPermissionRule } from './util';
import { KubernetesObjectTypes } from '../..';
import { z } from 'zod';
import { KubernetesObjectSearchFilter } from '../../../../kubernetes-common/src/types';
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
  

export const isOfKind = createKubernetesPermissionRule({
    name: 'IS_OF_KIND',
    description: 'Allow kubernetes resources with the specified kind',
    resourceType: RESOURCE_TYPE_KUBERNETES_RESOURCE,
    paramsSchema: z.object({
      kinds: z
        .array(z.string())
        .describe('List of kinds to match at least one of'),
    }),
    apply: (resource, { kinds }) => {
      const resourceKind = resource.toLocaleLowerCase('en-US');
      return kinds.some(kind => kind.toLocaleLowerCase('en-US') === resourceKind);
    },
    toQuery({ kinds }): KubernetesObjectSearchFilter {
      return {
        key: 'kind',
        values: kinds.map(kind => kind.toLocaleLowerCase('en-US')),
      };
    },
});
