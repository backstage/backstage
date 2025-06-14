/*
 * Copyright 2025 The Backstage Authors
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
  DEFAULT_NAMESPACE,
  Entity,
  getCompoundEntityRef,
} from '@backstage/catalog-model';
import { entityRouteParams } from './routes';

const entity: Entity = {
  apiVersion: '1',
  kind: 'Component',
  metadata: {
    name: 'Test-Component',
  },
};

const expectedEntityRouteParams = {
  kind: 'component',
  name: 'Test-Component',
  namespace: DEFAULT_NAMESPACE,
};

const namespacedEntity = {
  apiVersion: '1',
  kind: 'Component',
  metadata: {
    name: 'Test-Namespaced-Component',
    namespace: 'Test-Namespace',
  },
};

const expectedNamespacedEntityRouteParams = {
  kind: 'component',
  name: 'Test-Namespaced-Component',
  namespace: 'test-namespace',
};

describe('entityRouteParams', () => {
  it.each([
    ['Entity', entity, expectedEntityRouteParams],
    ['ComponentRef', getCompoundEntityRef(entity), expectedEntityRouteParams],
    ['string', 'component:Test-Component', expectedEntityRouteParams],
    [
      'namespaced Entity',
      namespacedEntity,
      expectedNamespacedEntityRouteParams,
    ],
    [
      'namespaced ComponentRef',
      getCompoundEntityRef(namespacedEntity),
      expectedNamespacedEntityRouteParams,
    ],
    [
      'namespaced string',
      'component:Test-Namespace/Test-Namespaced-Component',
      expectedNamespacedEntityRouteParams,
    ],
  ])(
    'should return correct route params for %s',
    (_type, entityOrRef, expectedRouteParams) => {
      const actualRouteParams = entityRouteParams(entityOrRef);
      expect(actualRouteParams).toEqual(expectedRouteParams);
    },
  );

  it('should not encode route params by default', () => {
    const actualRouteParams = entityRouteParams(
      'Custom Entity:Test Namespace/Test Component',
    );
    expect(actualRouteParams).toEqual({
      kind: 'custom entity',
      name: 'Test Component',
      namespace: 'test namespace',
    });
  });

  it('should encode route params', () => {
    const actualRouteParams = entityRouteParams(
      'Custom Entity:Test Namespace/Test Component',
      { encodeParams: true },
    );
    expect(actualRouteParams).toEqual({
      kind: 'custom%20entity',
      name: 'Test%20Component',
      namespace: 'test%20namespace',
    });
  });
});
