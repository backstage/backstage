/*
 * Copyright 2023 The Backstage Authors
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
import { useApi } from '@backstage/core-plugin-api';
import { catalogApiRef } from '../../api';
import useAsyncFn from 'react-use/esm/useAsyncFn';
import { Entity } from '@backstage/catalog-model';

type QueryEntitiesResponse = {
  items: Entity[];
  cursor?: string;
};

export function useQueryEntities() {
  const catalogApi = useApi(catalogApiRef);
  return useAsyncFn(
    async (
      request: { text: string } | QueryEntitiesResponse,
      options?: { limit: number },
    ): Promise<QueryEntitiesResponse> => {
      const initialRequest = request as { text: string };
      const cursorRequest = request as QueryEntitiesResponse;
      const limit = options?.limit ?? 20;

      if (cursorRequest.cursor) {
        const response = await catalogApi.queryEntities({
          cursor: cursorRequest.cursor,
          limit,
        });
        return {
          cursor: response.pageInfo.nextCursor,
          items: [...cursorRequest.items, ...response.items],
        };
      }

      const response = await catalogApi.queryEntities({
        fullTextFilter: {
          term: initialRequest.text || '',
          fields: [
            'metadata.name',
            'kind',
            'spec.profile.displayname',
            'metadata.title',
          ],
        },
        filter: { kind: ['User', 'Group'] },
        orderFields: [{ field: 'metadata.name', order: 'asc' }],
        limit,
      });

      return {
        cursor: response.pageInfo.nextCursor,
        items: response.items,
      };
    },
    [],
    { loading: true },
  );
}
