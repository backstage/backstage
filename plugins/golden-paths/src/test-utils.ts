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
  catalogApiRef,
  StarredEntitiesApi,
  starredEntitiesApiRef,
} from '@backstage/plugin-catalog-react';
import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';
import { DefaultStarredEntitiesApi } from '@backstage/plugin-catalog';
// eslint-disable-next-line @backstage/no-undeclared-imports
import { mockApis, TestApiRegistry } from '@backstage/test-utils';
import {
  entityNoRegions,
  entityWithRegions,
  goldenPathsApiRef,
} from '@backstage/plugin-golden-paths-react';

export const entities = [entityNoRegions, entityWithRegions];

const mockCatalogApi = catalogApiMock({
  entities,
});

const mockedListTasks = { listTasks: () => Promise.resolve({ tasks: [] }) };

const starredEntitiesApi: [
  typeof starredEntitiesApiRef,
  Partial<StarredEntitiesApi>,
] = [
  starredEntitiesApiRef,
  new DefaultStarredEntitiesApi({ storageApi: mockApis.storage() }),
];

export const apisWithEntities = TestApiRegistry.from(
  [catalogApiRef, mockCatalogApi],
  [goldenPathsApiRef, mockedListTasks],
  starredEntitiesApi,
);

export const apisWithoutEntities = TestApiRegistry.from(
  [catalogApiRef, catalogApiMock()],
  [goldenPathsApiRef, mockedListTasks],
  starredEntitiesApi,
);
