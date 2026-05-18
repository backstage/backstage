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

import { opsFromCatalogModelUpdateKindVersion } from './updateKindVersion';

describe('opsFromCatalogModelUpdateKindVersion', () => {
  it('should produce a single updateKindVersion op', () => {
    const ops = opsFromCatalogModelUpdateKindVersion({
      kind: 'Component',
      name: 'v1alpha1',
      specType: 'service',
      description: 'Updated description',
      schema: {
        jsonSchema: {
          type: 'object',
          properties: {
            spec: {
              type: 'object',
              properties: {
                newField: { type: 'string' },
              },
            },
          },
        },
      },
    });

    expect(ops).toEqual([
      expect.objectContaining({
        op: 'updateKindVersion.v1',
        kind: 'Component',
        name: 'v1alpha1',
        specType: 'service',
        properties: expect.objectContaining({
          description: 'Updated description',
        }),
      }),
    ]);
  });

  it('should expand multiple version names', () => {
    const ops = opsFromCatalogModelUpdateKindVersion({
      kind: 'Component',
      name: ['v1alpha1', 'v1beta1'],
      description: 'Shared update',
    });

    expect(ops).toHaveLength(2);
    expect(ops[0]).toEqual(
      expect.objectContaining({ name: 'v1alpha1', specType: undefined }),
    );
    expect(ops[1]).toEqual(
      expect.objectContaining({ name: 'v1beta1', specType: undefined }),
    );
  });

  it('should expand multiple spec types', () => {
    const ops = opsFromCatalogModelUpdateKindVersion({
      kind: 'Resource',
      name: 'v1alpha1',
      specType: ['database', 'cache'],
      description: 'Updated',
    });

    expect(ops).toHaveLength(2);
    expect(ops[0]).toEqual(expect.objectContaining({ specType: 'database' }));
    expect(ops[1]).toEqual(expect.objectContaining({ specType: 'cache' }));
  });

  it('should work without schema', () => {
    const ops = opsFromCatalogModelUpdateKindVersion({
      kind: 'Component',
      name: 'v1alpha1',
      relationFields: [
        {
          selector: { path: 'spec.owner' },
          relation: 'ownedBy',
        },
      ],
    });

    expect(ops).toHaveLength(1);
    expect(ops[0]).toEqual(
      expect.objectContaining({
        properties: expect.objectContaining({
          relationFields: [expect.objectContaining({ relation: 'ownedBy' })],
          schema: undefined,
        }),
      }),
    );
  });
});
