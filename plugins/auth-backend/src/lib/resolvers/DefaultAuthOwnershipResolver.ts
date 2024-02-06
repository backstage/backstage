/*
 * Copyright 2024 The Backstage Authors
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
import { AuthOwnershipResolver } from '@backstage/plugin-auth-node';
import {
  Entity,
  RELATION_MEMBER_OF,
  stringifyEntityRef,
} from '@backstage/catalog-model';

/**
 * Uses the default ownership resolution logic to return an array
 * of entity refs that the provided entity claims ownership through.
 *
 * A reference to the entity itself will also be included in the returned array.
 *
 * @public
 */
export class DefaultAuthOwnershipResolver implements AuthOwnershipResolver {
  async getOwnershipEntityRefs(entity: Entity): Promise<string[]> {
    const membershipRefs =
      entity.relations
        ?.filter(
          r =>
            r.type === RELATION_MEMBER_OF && r.targetRef.startsWith('group:'),
        )
        .map(r => r.targetRef) ?? [];

    return Array.from(new Set([stringifyEntityRef(entity), ...membershipRefs]));
  }
}
