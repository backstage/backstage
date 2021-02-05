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
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { useAsyncRetry } from 'react-use';

// TODO: Maybe this hook is interesting for others too?
export function useRelatedEntities(
  entity: Entity,
  type: string,
): {
  entities: (Entity | undefined)[] | undefined;
  loading: boolean;
  error: Error | undefined;
} {
  const catalogApi = useApi(catalogApiRef);
  const { loading, value, error } = useAsyncRetry<
    (Entity | undefined)[]
  >(async () => {
    const relations =
      entity.relations && entity.relations.filter(r => r.type === type);

    if (!relations) {
      return [];
    }

    return await Promise.all(
      relations?.map(r => catalogApi.getEntityByName(r.target)),
    );
  }, [entity, type]);

  return {
    entities: value,
    loading,
    error,
  };
}
