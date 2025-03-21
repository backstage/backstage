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

import {
  createApiFactory,
  discoveryApiRef,
  fetchApiRef,
  storageApiRef,
} from '@backstage/core-plugin-api';
import { CatalogClient } from '@backstage/catalog-client';
import { ApiBlueprint } from '@backstage/frontend-plugin-api';
import {
  catalogApiRef,
  entityPresentationApiRef,
  starredEntitiesApiRef,
} from '@backstage/plugin-catalog-react';
import {
  DefaultEntityPresentationApi,
  DefaultStarredEntitiesApi,
} from '../apis';

export const catalogApi = ApiBlueprint.make({
  params: {
    factory: createApiFactory({
      api: catalogApiRef,
      deps: {
        discoveryApi: discoveryApiRef,
        fetchApi: fetchApiRef,
      },
      factory: ({ discoveryApi, fetchApi }) =>
        new CatalogClient({ discoveryApi, fetchApi }),
    }),
  },
});

export const catalogStarredEntitiesApi = ApiBlueprint.make({
  name: 'starred-entities',
  params: {
    factory: createApiFactory({
      api: starredEntitiesApiRef,
      deps: { storageApi: storageApiRef },
      factory: ({ storageApi }) =>
        new DefaultStarredEntitiesApi({ storageApi }),
    }),
  },
});

export const entityPresentationApi = ApiBlueprint.make({
  name: 'entity-presentation',
  params: {
    factory: createApiFactory({
      api: entityPresentationApiRef,
      deps: { catalogApiImp: catalogApiRef },
      factory: ({ catalogApiImp }) =>
        DefaultEntityPresentationApi.create({ catalogApi: catalogApiImp }),
    }),
  },
});

export default [catalogApi, catalogStarredEntitiesApi, entityPresentationApi];
