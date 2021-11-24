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
  getEntityName,
  RELATION_MEMBER_OF,
  RELATION_OWNED_BY,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import { getEntityRelations } from './getEntityRelations';

/**
 * Get the related entity references.
 */
export function isOwnerOf(owner: Entity, owned: Entity) {
  const possibleOwners = new Set(
    [
      ...getEntityRelations(owner, RELATION_MEMBER_OF, { kind: 'group' }),
      ...(owner ? [getEntityName(owner)] : []),
    ].map(stringifyEntityRef),
  );

  const owners = getEntityRelations(owned, RELATION_OWNED_BY).map(
    stringifyEntityRef,
  );

  for (const ownerItem of owners) {
    if (possibleOwners.has(ownerItem)) {
      return true;
    }
  }

  return false;
}
