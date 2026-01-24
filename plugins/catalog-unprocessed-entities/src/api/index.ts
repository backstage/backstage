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
import { createApiRef } from '@backstage/core-plugin-api';
import {
  CatalogUnprocessedEntitiesApiResponse as CommonCatalogUnprocessedEntitiesApiResponse,
  CatalogUnprocessedEntitiesApi as CommonCatalogUnprocessedEntitiesApi,
  CatalogUnprocessedEntitiesClient as CommonCatalogUnprocessedEntitiesClient,
} from '@backstage/plugin-catalog-unprocessed-entities-common';

/**
 * {@link @backstage/core-plugin-api#ApiRef} for the {@link CatalogUnprocessedEntitiesApi}
 *
 * @public
 */
export const catalogUnprocessedEntitiesApiRef =
  createApiRef<CatalogUnprocessedEntitiesApi>({
    id: 'plugin.catalog-unprocessed-entities.service',
  });

/**
 * Response expected by the {@link CatalogUnprocessedEntitiesApi}
 *
 * @public
 * @deprecated Use the type imported from `@backstage/plugin-catalog-unprocessed-entities-common` instead.
 */
export type CatalogUnprocessedEntitiesApiResponse =
  CommonCatalogUnprocessedEntitiesApiResponse;

/**
 * Interface for the CatalogUnprocessedEntitiesApi.
 *
 * @public
 * @deprecated Use the type imported from `@backstage/plugin-catalog-unprocessed-entities-common` instead.
 */
export interface CatalogUnprocessedEntitiesApi
  extends CommonCatalogUnprocessedEntitiesApi {}

/**
 * Default API implementation for the Catalog Unprocessed Entities plugin
 *
 * @public
 * @deprecated Use the client imported from `@backstage/plugin-catalog-unprocessed-entities-common` instead.
 */
export class CatalogUnprocessedEntitiesClient extends CommonCatalogUnprocessedEntitiesClient {}
