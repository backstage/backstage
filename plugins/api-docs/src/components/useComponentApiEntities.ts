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

import { useAsyncRetry } from 'react-use';
import { errorApiRef, useApi } from '@backstage/core';
import { ApiEntity, ComponentEntity } from '@backstage/catalog-model';
import { catalogApiRef } from '@backstage/plugin-catalog';
import { useComponentApiNames } from './useComponentApiNames';

export function useComponentApiEntities({
  entity,
}: {
  entity: ComponentEntity;
}): {
  loading: boolean;
  apiEntities?: Map<String, ApiEntity>;
  error?: Error;
  retry: () => void;
} {
  const catalogApi = useApi(catalogApiRef);
  const errorApi = useApi(errorApiRef);

  const apiNames = useComponentApiNames(entity);

  const { loading, value: apiEntities, retry, error } = useAsyncRetry<
    Map<string, ApiEntity>
  >(async () => {
    const resultMap = new Map<string, ApiEntity>();

    await Promise.all(
      apiNames.map(async name => {
        try {
          const api = (await catalogApi.getEntityByName({
            kind: 'API',
            name,
          })) as ApiEntity | undefined;

          if (api) {
            resultMap.set(api.metadata.name, api);
          }
        } catch (e) {
          errorApi.post(e);
        }
      }),
    );

    return resultMap;
  }, [catalogApi, entity]);

  return {
    apiEntities,
    loading,
    error,
    retry,
  };
}
