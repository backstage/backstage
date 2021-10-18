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

import {
  parseEntityRef,
  RELATION_MEMBER_OF,
  stringifyEntityRef,
  UserEntity,
} from '@backstage/catalog-model';
import { TokenParams } from '../../identity';
import { BackstageIdentity } from '../../providers/types';

export function getEntityClaims(entity: UserEntity): TokenParams['claims'] {
  const userRef = stringifyEntityRef(entity);

  const membershipRefs =
    entity.relations
      ?.filter(
        r =>
          r.type === RELATION_MEMBER_OF &&
          r.target.kind.toLocaleLowerCase('en-US') === 'group',
      )
      .map(r => stringifyEntityRef(r.target)) ?? [];

  return {
    sub: userRef,
    ent: [userRef, ...membershipRefs],
  };
}

// TODO(authorization-framework): This should return identity.id parsed into an entity name + ent
// claims from the token.
export function getIdentityClaims(identity: BackstageIdentity): string[] {
  return [
    stringifyEntityRef(
      parseEntityRef(identity.id ?? '', {
        defaultKind: 'user',
        defaultNamespace: 'default',
      }),
    ),
  ];
}
