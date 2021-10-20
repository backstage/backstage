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
import { Entity, parseEntityRef } from '@backstage/catalog-model';
import { useApi } from '@backstage/core-plugin-api';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import limiterFactory from 'p-limit';
import { Dispatch, useCallback, useRef, useState } from 'react';
import { useAsyncFn } from 'react-use';

// TODO: This is a good use case for a graphql API, once it is available in the
// future.

const limiter = limiterFactory(10);

/**
 * Ensures that a set of requested entities is loaded.
 */
export function useEntityStore(): {
  entities: { [ref: string]: Entity };
  loading: boolean;
  error?: Error;
  requestEntities: Dispatch<string[]>;
} {
  const catalogClient = useApi(catalogApiRef);
  const state = useRef({
    requestedEntities: new Set<string>(),
    outstandingEntities: new Map<string, Promise<Entity | undefined>>(),
    cachedEntities: new Map<string, Entity>(),
  });
  const [entities, setEntities] = useState<{
    [ref: string]: Entity;
  }>({});

  const updateEntities = useCallback(() => {
    const { cachedEntities, requestedEntities } = state.current;
    const filteredEntities: { [ref: string]: Entity } = {};
    requestedEntities.forEach(entityRef => {
      const entity = cachedEntities.get(entityRef);

      if (entity) {
        filteredEntities[entityRef] = entity;
      }
    });
    setEntities(filteredEntities);
  }, [state, setEntities]);

  const [asyncState, fetch] = useAsyncFn(async () => {
    const { requestedEntities, outstandingEntities, cachedEntities } =
      state.current;

    await Promise.all(
      Array.from(requestedEntities).map(entityRef =>
        limiter(async () => {
          if (cachedEntities.has(entityRef)) {
            return;
          }

          if (outstandingEntities.has(entityRef)) {
            await outstandingEntities.get(entityRef);
            return;
          }

          const promise = catalogClient.getEntityByName(
            parseEntityRef(entityRef),
          );

          outstandingEntities.set(entityRef, promise);

          try {
            const entity = await promise;

            if (entity) {
              cachedEntities.set(entityRef, entity);
              updateEntities();
            }
          } finally {
            outstandingEntities.delete(entityRef);
          }
        }),
      ),
    );
  }, [state, updateEntities]);
  const { loading, error } = asyncState;

  const requestEntities = useCallback(
    (entityRefs: string[]) => {
      const n = new Set(entityRefs);
      const { requestedEntities } = state.current;

      if (
        n.size !== requestedEntities.size ||
        Array.from(n).some(e => !requestedEntities.has(e))
      ) {
        state.current.requestedEntities = n;
        fetch();
        updateEntities();
      }
    },
    [state, fetch, updateEntities],
  );

  return {
    entities,
    loading,
    error,
    requestEntities,
  };
}
