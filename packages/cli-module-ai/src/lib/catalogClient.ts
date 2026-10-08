/*
 * Copyright 2026 The Backstage Authors
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
  CatalogClient,
  type CatalogApi,
  type QueryEntitiesInitialRequest,
} from '@backstage/catalog-client';
import type { Entity } from '@backstage/catalog-model';

const BATCH_SIZE = 100;

/** The catalog methods this module uses, so tests can pass a typed fake. */
export type CatalogReader = Pick<
  CatalogApi,
  'queryEntities' | 'getEntitiesByRefs' | 'getEntityByRef'
>;

/**
 * Creates a {@link @backstage/catalog-client#CatalogClient} that talks
 * directly to the catalog plugin's REST API of the given Backstage instance.
 */
export function createCatalogClient(baseUrl: string): CatalogClient {
  return new CatalogClient({
    discoveryApi: {
      async getBaseUrl(pluginId: string) {
        return new URL(`/api/${pluginId}`, baseUrl).toString();
      },
    },
  });
}

/** Reads every page of a `queryEntities` request. */
export async function queryAllEntities(
  client: CatalogReader,
  request: QueryEntitiesInitialRequest,
  token: string,
): Promise<Entity[]> {
  const items: Entity[] = [];
  let response = await client.queryEntities(request, { token });
  items.push(...response.items);
  while (response.pageInfo.nextCursor) {
    response = await client.queryEntities(
      { cursor: response.pageInfo.nextCursor },
      { token },
    );
    items.push(...response.items);
  }
  return items;
}

/** Fetches entities by ref in batches; missing entities are `undefined`. */
export async function getEntitiesInBatches(
  client: CatalogReader,
  token: string,
  refs: string[],
  fields?: string[],
): Promise<Array<Entity | undefined>> {
  const result: Array<Entity | undefined> = [];
  for (let i = 0; i < refs.length; i += BATCH_SIZE) {
    const { items } = await client.getEntitiesByRefs(
      { entityRefs: refs.slice(i, i + BATCH_SIZE), fields },
      { token },
    );
    result.push(...items);
  }
  return result;
}
