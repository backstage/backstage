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

import { Entity } from '@backstage/catalog-model';
import { catalogServiceMock } from './catalogServiceMock';

const entity1: Entity = {
  apiVersion: 'v1',
  kind: 'CustomKind',
  metadata: {
    namespace: 'default',
    name: 'e1',
    uid: 'u1',
  },
};

const entity2: Entity = {
  apiVersion: 'v1',
  kind: 'CustomKind',
  metadata: {
    namespace: 'default',
    name: 'e2',
    uid: 'u2',
  },
};

const entities = [entity1, entity2];

describe('catalogServiceMock', () => {
  it('exports the expected functionality', async () => {
    const emptyFake = catalogServiceMock();
    const notEmptyFake = catalogServiceMock({ entities });

    await expect(emptyFake.getEntities()).resolves.toEqual({ items: [] });
    await expect(notEmptyFake.getEntities()).resolves.toEqual({
      items: entities,
    });

    const mock = catalogServiceMock.mock();
    expect(mock.getEntities).toHaveBeenCalledTimes(0);
    expect(mock.getEntities()).toBeUndefined();
    mock.getEntities.mockResolvedValue({ items: entities });
    await expect(mock.getEntities()).resolves.toEqual({ items: entities });

    const mock2 = catalogServiceMock.mock({
      getEntities: async () => ({ items: [entity1] }),
    });
    await expect(mock2.getEntities()).resolves.toEqual({ items: [entity1] });
  });
});
