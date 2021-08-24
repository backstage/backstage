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

import { CatalogApi } from '@backstage/catalog-client';
import {
  Entity,
  EntityName,
  parseEntityRef,
  RELATION_MEMBER_OF,
  RELATION_OWNED_BY,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import {
  IdentityApi,
  identityApiRef,
  useApi,
} from '@backstage/core-plugin-api';
import jwtDecoder from 'jwt-decode';
import { useMemo } from 'react';
import { useAsync } from 'react-use';
import { catalogApiRef } from '../api';
import { getEntityRelations } from '../utils/getEntityRelations';

// Takes a user ID from the identity, which can be on basically any form, and
// returns an entity ref. E.g. if the input is "foo", it returns
// "user:default/foo" to make sure it's a full ref.
function extendUserId(id: string): string {
  try {
    const ref = parseEntityRef(id, {
      defaultKind: 'User',
      defaultNamespace: 'default',
    });
    return stringifyEntityRef(ref);
  } catch {
    return id;
  }
}

// Takes the relevant parts of the Backstage identity, and translates them into
// a list of entity refs on string form that represent the user's ownership
// connections.
export async function loadIdentityOwnerRefs(
  identityApi: IdentityApi,
): Promise<string[]> {
  const id = identityApi.getUserId();
  const token = await identityApi.getIdToken();
  const result: string[] = [];

  if (id) {
    result.push(extendUserId(id));
  }

  if (token) {
    try {
      const decoded = jwtDecoder(token) as any;
      if (decoded?.ent) {
        [decoded.ent]
          .flat()
          .filter(x => typeof x === 'string')
          .map(x => x.toLocaleLowerCase('en-US'))
          .forEach(x => result.push(x));
      }
    } catch {
      // ignore
    }
  }

  return result;
}

// Takes the relevant parts of the User entity corresponding to the Backstage
// identity, and translates them into a list of entity refs on string form that
// represent the user's ownership connections.
export async function loadCatalogOwnerRefs(
  catalogApi: CatalogApi,
  identityOwnerRefs: string[],
): Promise<string[]> {
  const result = new Array<string>();

  const primaryUserRef = identityOwnerRefs.find(ref => ref.startsWith('user:'));
  if (primaryUserRef) {
    const entity = await catalogApi.getEntityByName(
      parseEntityRef(primaryUserRef),
    );
    if (entity) {
      const memberOf = getEntityRelations(entity, RELATION_MEMBER_OF, {
        kind: 'Group',
      });
      for (const group of memberOf) {
        result.push(stringifyEntityRef(group));
      }
    }
  }

  return result;
}

/**
 * Returns a function that checks whether the currently signed-in user is an
 * owner of a given entity. When the hook is initially mounted, the loading
 * flag will be true and the results returned from the function will always be
 * false.
 */
export function useEntityOwnership(): {
  loading: boolean;
  isOwnedEntity: (entity: Entity | EntityName) => boolean;
} {
  const identityApi = useApi(identityApiRef);
  const catalogApi = useApi(catalogApiRef);

  // Trigger load only on mount
  const { loading, value: refs } = useAsync(async () => {
    const identityRefs = await loadIdentityOwnerRefs(identityApi);
    const catalogRefs = await loadCatalogOwnerRefs(catalogApi, identityRefs);
    return new Set([...identityRefs, ...catalogRefs]);
  }, []);

  const isOwnedEntity = useMemo(() => {
    const myOwnerRefs = new Set(refs ?? []);
    return (entity: Entity | EntityName) => {
      const entityOwnerRefs = (
        'metadata' in entity
          ? getEntityRelations(entity, RELATION_OWNED_BY)
          : [entity]
      ).map(stringifyEntityRef);
      for (const ref of entityOwnerRefs) {
        if (myOwnerRefs.has(ref)) {
          return true;
        }
      }
      return false;
    };
  }, [refs]);

  return useMemo(() => ({ loading, isOwnedEntity }), [loading, isOwnedEntity]);
}
