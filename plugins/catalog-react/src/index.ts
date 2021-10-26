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

/**
 * A frontend library that helps other Backstage plugins interact with the catalog
 *
 * @packageDocumentation
 */

export type { CatalogApi } from '@backstage/catalog-client';
export { CATALOG_FILTER_EXISTS } from '@backstage/catalog-client';
export { catalogApiRef } from './api';
export * from './apis';
export * from './components';
export * from './hooks';
export * from './filters';
export {
  catalogRouteRef,
  entityRoute,
  entityRouteParams,
  entityRouteRef,
  rootRoute,
} from './routes';
export * from './testUtils';
export * from './types';
export * from './utils';
