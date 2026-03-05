/*
 * Copyright 2020 The Backstage Authors
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
  getCompoundEntityRef,
  RELATION_MEMBER_OF,
  RELATION_OWNED_BY,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import { getEntityRelations } from './getEntityRelations';

/**
 * Returns true if the `owner` argument is a direct owner on the `entity` argument.
 *
 * @alpha
 * @remarks
 *
 * Note that this ownership is not the same as using the claims in the auth-resolver, it only will take into account ownership as expressed by direct entity relations.
 * It doesn't know anything about the additional groups that a user might belong to which the claims contain.
 */
export function isOwnerOf(owner: Entity, entity: Entity) {
  const possibleOwners = new Set(
    [
      ...getEntityRelations(owner, RELATION_MEMBER_OF, { kind: 'group' }),
      ...(owner ? [getCompoundEntityRef(owner)] : []),
    ].map(stringifyEntityRef),
  );

  const owners = getEntityRelations(entity, RELATION_OWNED_BY).map(
    stringifyEntityRef,
  );

  for (const ownerItem of owners) {
    if (possibleOwners.has(ownerItem)) {
      return true;
    }
  }

  return false;
}
