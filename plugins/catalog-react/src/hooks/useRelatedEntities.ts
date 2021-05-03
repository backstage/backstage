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
import { chunk } from 'lodash';
import { useAsync } from 'react-use';
import { catalogApiRef } from '../api';

const BATCH_SIZE = 20;

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

    // Make requests in separate batches to limit query string size
    // (there is a `filter` param for each relation)
    const relationBatches = chunk(relations, BATCH_SIZE);

    const results = await Promise.all(
      relationBatches.map(batch => {
        return catalogApi.getEntities({
          filter: batch.map(({ target }) => {
            return {
              kind: target.kind,
              'metadata.name': target.name,
              'metadata.namespace': target.namespace,
            };
          }),
        });
      }),
    );

    return results.map(r => r.items).flat();
  }, [entity, type]);

  return {
    entities,
    loading,
    error,
  };
}
