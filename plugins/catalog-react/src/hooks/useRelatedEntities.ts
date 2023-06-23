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

import { Entity, parseEntityRef } from '@backstage/catalog-model';
import { useApi } from '@backstage/core-plugin-api';
import useAsync from 'react-use/lib/useAsync';
import { catalogApiRef } from '../api';

/**
 * Fetches all entities that appear in the entity's relations, optionally
 * filtered by relation type and kind.
 *
 * @public
 */
export function useRelatedEntities(
  entity: Entity,
  relationFilter: { type?: string; kind?: string },
): {
  entities: Entity[] | undefined;
  loading: boolean;
  error: Error | undefined;
} {
  const filterByTypeLower = relationFilter?.type?.toLocaleLowerCase('en-US');
  const filterByKindLower = relationFilter?.kind?.toLocaleLowerCase('en-US');
  const catalogApi = useApi(catalogApiRef);

  const {
    loading,
    value: entities,
    error,
  } = useAsync(async () => {
    const relations = entity.relations?.filter(
      r =>
        (!filterByTypeLower ||
          r.type.toLocaleLowerCase('en-US') === filterByTypeLower) &&
        (!filterByKindLower ||
          parseEntityRef(r.targetRef).kind === filterByKindLower),
    );

    if (!relations?.length) {
      return [];
    }

    const { items } = await catalogApi.getEntitiesByRefs({
      entityRefs: relations.map(r => r.targetRef),
    });

    return items.filter((x): x is Entity => Boolean(x));
  }, [entity, filterByTypeLower, filterByKindLower]);

  return {
    entities,
    loading,
    error,
  };
}
