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

import {
  ServiceRef,
  createServiceFactory,
} from '@backstage/backend-plugin-api';
import { InMemoryCatalogClient } from '@backstage/catalog-client/testUtils';
import { Entity } from '@backstage/catalog-model';
import { catalogServiceRef } from '@backstage/plugin-catalog-node/alpha';
// eslint-disable-next-line @backstage/no-undeclared-imports
import { ServiceMock } from '@backstage/backend-test-utils';

/** @internal */
function simpleMock<TService>(
  ref: ServiceRef<TService, any>,
  mockFactory: () => jest.Mocked<TService>,
): (partialImpl?: Partial<TService>) => ServiceMock<TService> {
  return partialImpl => {
    const mock = mockFactory();
    if (partialImpl) {
      for (const [key, impl] of Object.entries(partialImpl)) {
        if (typeof impl === 'function') {
          (mock as any)[key].mockImplementation(impl);
        } else {
          (mock as any)[key] = impl;
        }
      }
    }
    return Object.assign(mock, {
      factory: createServiceFactory({
        service: ref,
        deps: {},
        factory: () => mock,
      }),
    }) as ServiceMock<TService>;
  };
}

/** @public */
export function catalogServiceMock(options?: { entities?: Entity[] }) {
  return new InMemoryCatalogClient(options);
}

/** @public */
export namespace catalogServiceMock {
  export const factory = (options?: { entities?: Entity[] }) =>
    createServiceFactory({
      service: catalogServiceRef,
      deps: {},
      factory: () => new InMemoryCatalogClient(options),
    });
  export const mock = simpleMock(catalogServiceRef, () => ({
    getEntities: jest.fn(),
    getEntitiesByRefs: jest.fn(),
    queryEntities: jest.fn(),
    getEntityAncestors: jest.fn(),
    getEntityByRef: jest.fn(),
    removeEntityByUid: jest.fn(),
    refreshEntity: jest.fn(),
    getEntityFacets: jest.fn(),
    getLocationById: jest.fn(),
    getLocationByRef: jest.fn(),
    addLocation: jest.fn(),
    removeLocationById: jest.fn(),
    getLocationByEntity: jest.fn(),
    validateEntity: jest.fn(),
  }));
}
