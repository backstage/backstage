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

import { Entity } from '@backstage/catalog-model';
import { ReferenceTemplateLoader } from './ReferenceTemplateLoader';

const tpl = (name: string): Entity =>
  ({
    apiVersion: 'scaffolder.backstage.io/v1beta3',
    kind: 'Template',
    metadata: { name, namespace: 'default' },
    spec: { owner: 'group:default/x', type: 'service', steps: [] },
  } as Entity);

describe('ReferenceTemplateLoader', () => {
  it('returns the resolved Template entities in order', async () => {
    const catalog = {
      getEntityByRef: jest
        .fn()
        .mockResolvedValueOnce(tpl('a'))
        .mockResolvedValueOnce(tpl('b')),
    };
    const loader = new ReferenceTemplateLoader(catalog as any, 5);

    const result = await loader.load([
      'template:default/a',
      'template:default/b',
    ]);

    expect(result.map(e => e.metadata.name)).toEqual(['a', 'b']);
  });

  it('throws when an entity ref is not found', async () => {
    const catalog = { getEntityByRef: jest.fn().mockResolvedValue(undefined) };
    const loader = new ReferenceTemplateLoader(catalog as any, 5);

    await expect(loader.load(['template:default/missing'])).rejects.toThrow(
      /not found in the catalog/,
    );
  });

  it('throws when an entity is not a Template', async () => {
    const wrong: Entity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Component',
      metadata: { name: 'a' },
    } as Entity;
    const catalog = { getEntityByRef: jest.fn().mockResolvedValue(wrong) };
    const loader = new ReferenceTemplateLoader(catalog as any, 5);

    await expect(loader.load(['component:default/a'])).rejects.toThrow(
      /is a Component, not a Template/,
    );
  });

  it('rejects more refs than the limit allows', async () => {
    const catalog = { getEntityByRef: jest.fn() };
    const loader = new ReferenceTemplateLoader(catalog as any, 2);

    await expect(
      loader.load([
        'template:default/a',
        'template:default/b',
        'template:default/c',
      ]),
    ).rejects.toThrow(/At most 2 reference templates are allowed/);
    expect(catalog.getEntityByRef).not.toHaveBeenCalled();
  });

  it('forwards the caller token to the catalog when provided', async () => {
    const catalog = { getEntityByRef: jest.fn().mockResolvedValue(tpl('a')) };
    const loader = new ReferenceTemplateLoader(catalog as any, 5);

    await loader.load(['template:default/a'], {
      credentials: { token: 't0k' },
    });

    expect(catalog.getEntityByRef).toHaveBeenCalledWith('template:default/a', {
      token: 't0k',
    });
  });
});
