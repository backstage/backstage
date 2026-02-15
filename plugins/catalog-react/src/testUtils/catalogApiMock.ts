/*
 * Copyright 2024 The Backstage Authors
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

import { ApiFactory, createApiFactory } from '@backstage/frontend-plugin-api';
import { InMemoryCatalogClient } from '@backstage/catalog-client/testUtils';
import { Entity } from '@backstage/catalog-model';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { CatalogApi } from '@backstage/catalog-client';
import {
  createApiMock,
  attachMockApiFactory,
  type MockWithApiFactory,
} from '@backstage/frontend-test-utils';

/**
 * Creates a fake catalog client that handles entities in memory storage. Note
 * that this client may be severely limited in functionality, and advanced
 * functions may not be available at all.
 *
 * @public
 */
export function catalogApiMock(options?: {
  entities?: Entity[];
}): MockWithApiFactory<CatalogApi> {
  const instance = new InMemoryCatalogClient(options);
  return attachMockApiFactory(catalogApiRef, instance);
}

/**
 * A collection of mock functionality for the catalog service.
 *
 * @public
 */
export namespace catalogApiMock {
  /**
   * Creates a fake catalog client that handles entities in memory storage. Note
   * that this client may be severely limited in functionality, and advanced
   * functions may not be available at all.
   */
  export const factory = (options?: {
    entities?: Entity[];
  }): ApiFactory<CatalogApi, CatalogApi, {}> =>
    createApiFactory({
      api: catalogApiRef,
      deps: {},
      factory: () => new InMemoryCatalogClient(options),
    });
  /**
   * Creates a catalog client whose methods are mock functions, possibly with
   * some of them overloaded by the caller.
   */
  export const mock = createApiMock(catalogApiRef, () => ({
    getEntities: jest.fn(),
    getEntitiesByRefs: jest.fn(),
    queryEntities: jest.fn(),
    getEntityAncestors: jest.fn(),
    getEntityByRef: jest.fn(),
    removeEntityByUid: jest.fn(),
    refreshEntity: jest.fn(),
    getEntityFacets: jest.fn(),
    getLocations: jest.fn(),
    queryLocations: jest.fn(),
    streamLocations: jest.fn(),
    getLocationById: jest.fn(),
    getLocationByRef: jest.fn(),
    addLocation: jest.fn(),
    removeLocationById: jest.fn(),
    getLocationByEntity: jest.fn(),
    validateEntity: jest.fn(),
    analyzeLocation: jest.fn(),
    streamEntities: jest.fn(),
    streamEntityPages: jest.fn(),
  }));
}
