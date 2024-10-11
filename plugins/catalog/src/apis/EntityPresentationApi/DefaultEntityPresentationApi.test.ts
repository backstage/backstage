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

import { Entity } from '@backstage/catalog-model';
import {
  EntityRefPresentation,
  EntityRefPresentationSnapshot,
} from '@backstage/plugin-catalog-react';
import { DefaultEntityPresentationApi } from './DefaultEntityPresentationApi';
import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';

describe('DefaultEntityPresentationApi', () => {
  it('works in local mode', async () => {
    const api = DefaultEntityPresentationApi.createLocal();

    let presentation = api.forEntity('component:default/test');
    expect(presentation).toEqual({
      snapshot: {
        entityRef: 'component:default/test',
        entity: undefined,
        primaryTitle: 'test',
        secondaryTitle: 'component:default/test',
        Icon: expect.anything(),
      },
      update$: undefined,
      promise: expect.any(Promise),
    });
    await expect(presentation.promise).resolves.toEqual(presentation.snapshot);

    presentation = api.forEntity('component:default/test', {
      defaultKind: 'Other',
    });
    expect(presentation).toEqual({
      snapshot: {
        entityRef: 'component:default/test',
        entity: undefined,
        primaryTitle: 'component:test',
        secondaryTitle: 'component:default/test',
        Icon: expect.anything(),
      },
      update$: undefined,
      promise: expect.any(Promise),
    });
    await expect(presentation.promise).resolves.toEqual(presentation.snapshot);

    presentation = api.forEntity('component:default/test', {
      defaultNamespace: 'other',
    });
    expect(presentation).toEqual({
      snapshot: {
        entityRef: 'component:default/test',
        entity: undefined,
        primaryTitle: 'default/test',
        secondaryTitle: 'component:default/test',
        Icon: expect.anything(),
      },
      update$: undefined,
      promise: expect.any(Promise),
    });
    await expect(presentation.promise).resolves.toEqual(presentation.snapshot);

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

    presentation = api.forEntity(entity);
    expect(presentation).toEqual({
      snapshot: {
        entityRef: 'component:default/test',
        primaryTitle: 'test',
        secondaryTitle: 'component:default/test | service',
        Icon: expect.anything(),
      },
      update$: undefined,
      promise: expect.any(Promise),
    });
    await expect(presentation.promise).resolves.toEqual(presentation.snapshot);
  });

  it('works in catalog mode', async () => {
    const catalogApi = catalogApiMock.mock();
    const api = DefaultEntityPresentationApi.create({ catalogApi });

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
    let presentation = api.forEntity('component:default/test');
    let expected: EntityRefPresentationSnapshot = {
      entityRef: 'component:default/test',
      primaryTitle: 'test',
      secondaryTitle: 'component:default/test | service',
      Icon: expect.anything(),
    };
    await expect(consumePresentation(presentation)).resolves.toEqual([
      // first the dummy snapshot
      {
        entityRef: 'component:default/test',
        primaryTitle: 'test',
        secondaryTitle: 'component:default/test',
        Icon: expect.anything(),
      },
      expected,
    ]);
    await expect(presentation.promise).resolves.toEqual(expected);

    // use cached entity, immediately return full presentation
    presentation = api.forEntity('component:default/test');
    expected = {
      entityRef: 'component:default/test',
      primaryTitle: 'test',
      secondaryTitle: 'component:default/test | service',
      Icon: expect.anything(),
    };
    expect(presentation.snapshot).toEqual(expected);
    await expect(consumePresentation(presentation)).resolves.toEqual([
      expected,
    ]);
    await expect(presentation.promise).resolves.toEqual(presentation.snapshot);

    expect(catalogApi.getEntitiesByRefs).toHaveBeenCalledTimes(1);
    expect(catalogApi.getEntitiesByRefs).toHaveBeenCalledWith(
      expect.objectContaining({
        entityRefs: ['component:default/test'],
        fields: [
          'kind',
          'metadata.name',
          'metadata.namespace',
          'metadata.title',
          'metadata.description',
          'spec.profile.displayName',
          'spec.type',
        ],
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
