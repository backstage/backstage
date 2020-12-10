/*
 * Copyright 2020 Spotify AB
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

import {
  Entity,
  EntityName,
  getEntityName,
  RELATION_MEMBER_OF,
  RELATION_OWNED_BY,
} from '@backstage/catalog-model';
import { getEntityRelations } from './getEntityRelations';

// TODO: this file is copied from /packages/app/catalog/src/components/isOwnerOf.ts and
//       should be replaced once common relation-functions are introduced.

/**
 * Check if one entity is owned by another. Returns true, if the entity is owned by the
 * owner directly, or if the entity is owned by a group that the owner is a member of.
 */
export function isOwnerOf(owner: Entity, owned: Entity) {
  const possibleOwners: EntityName[] = [
    ...getEntityRelations(owner, RELATION_MEMBER_OF, { kind: 'group' }),
    ...(owner ? [getEntityName(owner)] : []),
  ];

  const owners = getEntityRelations(owned, RELATION_OWNED_BY);

  for (const owner of owners) {
    if (
      possibleOwners.find(
        o =>
          owner.kind.toLowerCase() === o.kind.toLowerCase() &&
          owner.namespace.toLowerCase() === o.namespace.toLowerCase() &&
          owner.name.toLowerCase() === o.name.toLowerCase(),
      ) !== undefined
    ) {
      return true;
    }
  }

  return false;
}
