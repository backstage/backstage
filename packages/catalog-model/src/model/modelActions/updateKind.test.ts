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

import { opsFromCatalogModelUpdateKind } from './updateKind';
import { compileCatalogModel } from '../compileCatalogModel';
import { createCatalogModelLayer } from '../createCatalogModelLayer';

describe('opsFromCatalogModelUpdateKind', () => {
  it('allows clearing a kind description without changing its names', () => {
    const layer = createCatalogModelLayer({
      layerId: 'example.com/component',
      builder: model => {
        model.addKind({
          group: 'example.com',
          names: {
            kind: 'Component',
            singular: 'component',
            plural: 'components',
          },
          description: 'Original description',
        });
        model.updateKind({ names: { kind: 'Component' }, description: '' });
      },
    });

    expect(compileCatalogModel([layer]).listKinds()).toEqual([
      {
        names: {
          kind: 'Component',
          singular: 'component',
          plural: 'components',
        },
        description: '',
        versions: [],
      },
    ]);
  });

  it('should produce an updateKind op when names are updated', () => {
    const ops = opsFromCatalogModelUpdateKind({
      names: { kind: 'Component', singular: 'comp' },
    });

    expect(ops).toEqual([
      {
        op: 'updateKind.v1',
        kind: 'Component',
        properties: {
          singular: 'comp',
        },
      },
    ]);
  });

  it('should produce an updateKindVersion op for versions without names changes', () => {
    const ops = opsFromCatalogModelUpdateKind({
      names: { kind: 'Component' },
      versions: [
        {
          name: 'v1alpha1',
          schema: { jsonSchema: { type: 'object' } },
        },
      ],
    });

    expect(ops).toEqual([
      {
        op: 'updateKindVersion.v1',
        kind: 'Component',
        name: 'v1alpha1',
        properties: {
          schema: { jsonSchema: { type: 'object' } },
        },
      },
    ]);
  });
});
