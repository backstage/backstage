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
import { Entity } from '@backstage/catalog-model';
import { useApi } from '@backstage/core';
import { useAsync } from 'react-use';
import { catalogApiRef } from '../api';

export function useRelatedEntities(
  entity: Entity,
  { type, kind }: { type?: string; kind?: string },
): {
  entities: Entity[] | undefined;
  loading: boolean;
  error: Error | undefined;
} {
  const catalogApi = useApi(catalogApiRef);
  const { loading, value: entities, error } = useAsync(async () => {
    const relations =
      entity.relations &&
      entity.relations.filter(
        r =>
          (!type || r.type.toLowerCase() === type.toLowerCase()) &&
          (!kind || r.target.kind.toLowerCase() === kind.toLowerCase()),
      );

    if (!relations) {
      return [];
    }

    // TODO: This code could be more efficient if there was an endpoint in the
    // backend that either returns the relations of entity (filtered by type)
    // or if there is a way to perform a batch request by entity name. However,
    // such an implementation would probably be better placed in the graphql API.
    const results = await Promise.all(
      relations?.map(r => catalogApi.getEntityByName(r.target)),
    );
    // Skip entities that where not found, for example if a relation references
    // an entity that doesn't exist.
    return results.filter(e => e) as Entity[];
  }, [entity, type]);

  return {
    entities,
    loading,
    error,
  };
}
