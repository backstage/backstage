/*
 * Copyright 2022 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { RESOURCE_TYPE_KUBERNETES_RESOURCE } from '@backstage/plugin-kubernetes-common';
import { createKubernetesPermissionRule } from './util';
import { z } from 'zod';
import { ObjectToFetch } from '../../types/types';
import { PermissionCriteria } from '@backstage/plugin-permission-common';
import { DEFAULT_OBJECTS } from '../../service/KubernetesFanOutHandler';

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
    kind: z.string().describe('Kind to match'),
  }),
  apply: (resource, { kind }) => kind === resource.type,
  toQuery({ kind }): PermissionCriteria<ObjectToFetch> {
    var defaultObject = DEFAULT_OBJECTS.find(
      ({ objectType }) => objectType === kind,
    );
    if (defaultObject === undefined) {
      throw new Error(`Invalid Kind '${kind}'`);
    }
    return defaultObject;
  },
});
