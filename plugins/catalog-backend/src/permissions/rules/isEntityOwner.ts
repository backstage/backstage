/*
 * Copyright 2021 The Backstage Authors
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

import { RELATION_OWNED_BY } from '@backstage/catalog-model';
import { createPermissionRule } from '@backstage/plugin-permission-node';
import { z } from 'zod';
import { catalogEntityPermissionResourceRef } from '@backstage/plugin-catalog-node/alpha';

/**
 * A catalog {@link @backstage/plugin-permission-node#PermissionRule} which
 * filters for entities with a specified owner.
 *
 * @alpha
 */
export const isEntityOwner = createPermissionRule({
  name: 'IS_ENTITY_OWNER',
  description: 'Allow entities owned by a specified claim',
  resourceRef: catalogEntityPermissionResourceRef,
  paramsSchema: z.object({
    claims: z
      .array(z.string())
      .describe(
        `List of claims to match at least one on within ${RELATION_OWNED_BY}`,
      ),
  }),
  apply: (resource, { claims }) => {
    if (!resource.relations) {
      return false;
    }

    return resource.relations
      .filter(relation => relation.type === RELATION_OWNED_BY)
      .some(relation => claims.includes(relation.targetRef));
  },
  toQuery: ({ claims }) => ({
    key: 'relations.ownedBy',
    values: claims,
  }),
});
