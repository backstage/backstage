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

import { CatalogApi } from '@backstage/catalog-client';
import { Entity } from '@backstage/catalog-model';
import {
  EntityRefPresentation,
  EntityRefPresentationSnapshot,
} from '@backstage/plugin-catalog-react';
import { DefaultEntityPresentationApi } from './DefaultEntityPresentationApi';

describe('DefaultEntityPresentationApi', () => {
  it('works in local mode', () => {
    const api = DefaultEntityPresentationApi.createLocal();

    expect(api.forEntity('component:default/test')).toEqual({
      snapshot: {
        entityRef: 'component:default/test',
        entity: undefined,
        primaryTitle: 'test',
        secondaryTitle: 'component:default/test',
        Icon: expect.anything(),
      },
      update$: undefined,
    });

    expect(
      api.forEntity('component:default/test', { defaultKind: 'Other' }),
    ).toEqual({
      snapshot: {
        entityRef: 'component:default/test',
        entity: undefined,
        primaryTitle: 'component:test',
        secondaryTitle: 'component:default/test',
        Icon: expect.anything(),
      },
      update$: undefined,
    });

    expect(
      api.forEntity('component:default/test', {
        defaultNamespace: 'other',
      }),
    ).toEqual({
      snapshot: {
        entityRef: 'component:default/test',
        entity: undefined,
        primaryTitle: 'default/test',
        secondaryTitle: 'component:default/test',
        Icon: expect.anything(),
      },
      update$: undefined,
    });

    const entity: Entity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Component',
      metadata: {
        name: 'test',
        namespace: 'default',
      },
      spec: {
        type: 'service',
      },
    };

    expect(api.forEntity(entity)).toEqual({
      snapshot: {
        entityRef: 'component:default/test',
        entity: entity,
        primaryTitle: 'test',
        secondaryTitle: 'component:default/test | service',
        Icon: expect.anything(),
      },
      update$: undefined,
    });
  });

  it('works in catalog mode', async () => {
    const catalogApi = {
      getEntitiesByRefs: jest.fn(),
    };
    const api = DefaultEntityPresentationApi.create({
      catalogApi: catalogApi as Partial<CatalogApi> as any,
    });

    catalogApi.getEntitiesByRefs.mockResolvedValueOnce({
      items: [
        {
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'Component',
          metadata: {
            name: 'test',
            namespace: 'default',
            etag: 'something',
          },
          spec: {
            type: 'service',
          },
        },
      ],
    });

    // return simple presentation, call catalog, return full presentation
    await expect(
      consumePresentation(api.forEntity('component:default/test')),
    ).resolves.toEqual([
      {
        entityRef: 'component:default/test',
        entity: undefined,
        primaryTitle: 'test',
        secondaryTitle: 'component:default/test',
        Icon: expect.anything(),
      },
      {
        entityRef: 'component:default/test',
        entity: {
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'Component',
          metadata: {
            etag: 'something',
            name: 'test',
            namespace: 'default',
          },
          spec: {
            type: 'service',
          },
        },
        primaryTitle: 'test',
        secondaryTitle: 'component:default/test | service',
        Icon: expect.anything(),
      },
    ]);

    // use cached entity, immediately return full presentation
    await expect(
      consumePresentation(api.forEntity('component:default/test')),
    ).resolves.toEqual([
      {
        entityRef: 'component:default/test',
        entity: {
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'Component',
          metadata: {
            etag: 'something',
            name: 'test',
            namespace: 'default',
          },
          spec: {
            type: 'service',
          },
        },
        primaryTitle: 'test',
        secondaryTitle: 'component:default/test | service',
        Icon: expect.anything(),
      },
    ]);

    expect(catalogApi.getEntitiesByRefs).toHaveBeenCalledTimes(1);
    expect(catalogApi.getEntitiesByRefs).toHaveBeenCalledWith(
      expect.objectContaining({
        entityRefs: ['component:default/test'],
      }),
    );
  });
});

async function consumePresentation(
  presentation: EntityRefPresentation,
): Promise<EntityRefPresentationSnapshot[]> {
  const result: EntityRefPresentationSnapshot[] = [];
  const { snapshot, update$ } = presentation;

  result.push(snapshot);

  if (update$) {
    await new Promise<void>(resolve => {
      const sub = update$.subscribe({
        next: newSnapshot => {
          result.push(newSnapshot);
        },
        complete: () => {
          sub.unsubscribe();
          resolve();
        },
      });
    });
  }

  return result;
}
