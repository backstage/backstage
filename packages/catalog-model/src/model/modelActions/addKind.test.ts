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

import { opsFromCatalogModelKind } from './addKind';

describe('opsFromCatalogModelKind', () => {
  it('should produce ops for a complete kind with a single version', () => {
    const ops = opsFromCatalogModelKind({
      group: 'backstage.io',
      names: {
        kind: 'Component',
        singular: 'component',
        plural: 'components',
      },
      description: 'A software component',
      versions: [
        {
          name: 'v1alpha1',
          specType: 'service',
          description: 'A backend service',
          relationFields: [
            {
              selector: { path: 'spec.owner' },
              relation: 'ownedBy',
              defaultKind: 'Group',
              defaultNamespace: 'inherit',
              allowedKinds: ['User', 'Group'],
            },
          ],
          schema: {
            jsonSchema: {
              type: 'object',
              properties: {
                spec: {
                  type: 'object',
                  properties: {
                    owner: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      ],
    });

    expect(ops).toEqual([
      {
        op: 'declareKind.v1',
        kind: 'Component',
        group: 'backstage.io',
        properties: {
          singular: 'component',
          plural: 'components',
          description: 'A software component',
        },
      },
      {
        op: 'declareKindVersion.v1',
        kind: 'Component',
        name: 'v1alpha1',
        specType: 'service',
        properties: {
          description: 'A backend service',
          relationFields: [
            {
              selector: { path: 'spec.owner' },
              relation: 'ownedBy',
              defaultKind: 'Group',
              defaultNamespace: 'inherit',
              allowedKinds: ['User', 'Group'],
            },
          ],
          schema: {
            jsonSchema: {
              type: 'object',
              properties: {
                spec: {
                  type: 'object',
                  properties: {
                    owner: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
    ]);
  });

  it('should reject a jsonSchema that is invalid in the JSON Schema sense', () => {
    expect(() =>
      opsFromCatalogModelKind({
        group: 'backstage.io',
        names: { kind: 'Bad', singular: 'bad', plural: 'bads' },
        description: 'Bad kind',
        versions: [
          {
            name: 'v1alpha1',
            schema: {
              jsonSchema: {
                type: 'object',
                properties: {
                  spec: {
                    type: 'not-a-real-type' as any,
                  },
                },
              },
            },
          },
        ],
      }),
    ).toThrow(/Invalid JSON schema/);
  });

  it('should reject a jsonSchema that violates semantic rules', () => {
    expect(() =>
      opsFromCatalogModelKind({
        group: 'backstage.io',
        names: { kind: 'Bad', singular: 'bad', plural: 'bads' },
        description: 'Bad kind',
        versions: [
          {
            name: 'v1alpha1',
            schema: {
              jsonSchema: {
                type: 'object',
                allOf: [{ properties: { spec: { type: 'object' } } }],
                properties: {
                  spec: { type: 'object' },
                },
              } as any,
            },
          },
        ],
      }),
    ).toThrow(/allOf/);
  });
});
