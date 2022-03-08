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
  Entity,
  RELATION_OWNED_BY,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import { identityApiRef, useApi } from '@backstage/core-plugin-api';
import { useMemo } from 'react';
import useAsync from 'react-use/lib/useAsync';
import { getEntityRelations } from '../utils/getEntityRelations';

/**
 * Returns a function that checks whether the currently signed-in user is an
 * owner of a given entity. When the hook is initially mounted, the loading
 * flag will be true and the results returned from the function will always be
 * false.
 *
 * @public
 *
 * @returns a function that checks if the signed in user owns an entity
 */
export function useEntityOwnership(): {
  loading: boolean;
  isOwnedEntity: (entity: Entity) => boolean;
} {
  const identityApi = useApi(identityApiRef);

  // Trigger load only on mount
  const { loading, value: refs } = useAsync(async () => {
    const { ownershipEntityRefs } = await identityApi.getBackstageIdentity();
    return ownershipEntityRefs;
  }, []);

  const isOwnedEntity = useMemo(() => {
    const myOwnerRefs = new Set(refs ?? []);
    return (entity: Entity) => {
      const entityOwnerRefs = getEntityRelations(entity, RELATION_OWNED_BY).map(
        stringifyEntityRef,
      );
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
