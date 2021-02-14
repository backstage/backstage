/*
 * Copyright 2021 Spotify AB
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
  UserEntity,
  serializeEntityRef,
  RELATION_MEMBER_OF,
} from '@backstage/catalog-model';
import { TokenParams } from '../../identity';

export function getEntityClaims(entity: UserEntity): TokenParams['claims'] {
  const userRef = serializeEntityRef(entity);
  if (typeof userRef !== 'string') {
    throw new Error(
      `Failed to serialize user entity ref, ${JSON.stringify(userRef)}`,
    );
  }

  const membershipRefs =
    entity.relations
      ?.filter(r => r.type === RELATION_MEMBER_OF)
      .map(r => {
        const ref = serializeEntityRef(r.target);
        if (typeof ref !== 'string') {
          throw new Error(
            `Failed to serialize relation entity ref, ${JSON.stringify(ref)}`,
          );
        }
        return ref;
      }) ?? [];

  return {
    sub: userRef,
    ent: [userRef, ...membershipRefs],
  };
}
