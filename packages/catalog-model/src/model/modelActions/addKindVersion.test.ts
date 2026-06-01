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

import { compileCatalogModel } from '../compileCatalogModel';
import { createCatalogModelLayer } from '../createCatalogModelLayer';
import { opsFromCatalogModelAddKindVersion } from './addKindVersion';

describe('opsFromCatalogModelAddKindVersion', () => {
  it('produces declareKindVersion ops for a single version', () => {
    const ops = opsFromCatalogModelAddKindVersion({
      kind: 'API',
      versions: [
        {
          name: 'v1alpha2',
          description: 'A new version',
          relationFields: [
            {
              selector: { path: 'spec.owner' },
              relation: 'ownedBy',
              defaultKind: 'Group',
              defaultNamespace: 'inherit',
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
        op: 'declareKindVersion.v1',
        kind: 'API',
        name: 'v1alpha2',
        specType: undefined,
        properties: {
          description: 'A new version',
          relationFields: [
            {
              selector: { path: 'spec.owner' },
              relation: 'ownedBy',
              defaultKind: 'Group',
              defaultNamespace: 'inherit',
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

  it('produces separate ops for each specType', () => {
    const ops = opsFromCatalogModelAddKindVersion({
      kind: 'API',
      versions: [
        {
          name: 'v1alpha2',
          schema: {
            jsonSchema: {
              type: 'object',
              properties: {
                spec: {
                  type: 'object',
                  properties: { definition: { type: 'string' } },
                },
              },
            },
          },
        },
        {
          name: 'v1alpha2',
          specType: 'mcp-server',
          description: 'An MCP server',
          schema: {
            jsonSchema: {
              type: 'object',
              properties: {
                spec: {
                  type: 'object',
                  properties: { remotes: { type: 'array' } },
                },
              },
            },
          },
        },
      ],
    });

    expect(ops).toHaveLength(2);
    expect(ops[0]).toMatchObject({
      op: 'declareKindVersion.v1',
      name: 'v1alpha2',
      specType: undefined,
    });
    expect(ops[1]).toMatchObject({
      op: 'declareKindVersion.v1',
      name: 'v1alpha2',
      specType: 'mcp-server',
    });
  });

  it('does not produce a declareKind op', () => {
    const ops = opsFromCatalogModelAddKindVersion({
      kind: 'API',
      versions: [
        {
          name: 'v1alpha2',
          schema: {
            jsonSchema: {
              type: 'object',
              properties: {
                spec: { type: 'object' },
              },
            },
          },
        },
      ],
    });

    expect(ops.every(op => op.op === 'declareKindVersion.v1')).toBe(true);
  });

  it('rejects an invalid JSON schema', () => {
    expect(() =>
      opsFromCatalogModelAddKindVersion({
        kind: 'API',
        versions: [
          {
            name: 'v1alpha2',
            schema: {
              jsonSchema: {
                type: 'object',
                properties: {
                  spec: { type: 'not-a-real-type' as any },
                },
              },
            },
          },
        ],
      }),
    ).toThrow(/Invalid JSON schema/);
  });

  it('rejects a schema that violates semantic rules', () => {
    expect(() =>
      opsFromCatalogModelAddKindVersion({
        kind: 'API',
        versions: [
          {
            name: 'v1alpha2',
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

describe('addKindVersion integration with compileCatalogModel', () => {
  it('adds a new specType to an existing kind via a separate layer', () => {
    const baseLayer = createCatalogModelLayer({
      layerId: 'test/base-api',
      builder: model => {
        model.addKind({
          group: 'backstage.io',
          names: { kind: 'API', singular: 'api', plural: 'apis' },
          description: 'An API',
          versions: [
            {
              name: 'v1alpha1',
              schema: {
                jsonSchema: {
                  type: 'object',
                  properties: {
                    spec: {
                      type: 'object',
                      required: ['definition'],
                      properties: {
                        definition: { type: 'string' },
                      },
                    },
                  },
                },
              },
            },
          ],
        });
      },
    });

    const extensionLayer = createCatalogModelLayer({
      layerId: 'test/api-mcp-extension',
      builder: model => {
        model.addKindVersion({
          kind: 'API',
          versions: [
            {
              name: 'v1alpha1',
              specType: 'mcp-server',
              description: 'An MCP server API',
              schema: {
                jsonSchema: {
                  type: 'object',
                  properties: {
                    spec: {
                      type: 'object',
                      required: ['remotes'],
                      properties: {
                        remotes: { type: 'array', minItems: 1 },
                      },
                    },
                  },
                },
              },
            },
          ],
        });
      },
    });

    const model = compileCatalogModel([baseLayer, extensionLayer]);

    const defaultKind = model.getKind({
      kind: 'API',
      apiVersion: 'backstage.io/v1alpha1',
      spec: { type: 'openapi' },
    });
    const mcpKind = model.getKind({
      kind: 'API',
      apiVersion: 'backstage.io/v1alpha1',
      spec: { type: 'mcp-server' },
    });

    expect(defaultKind).toBeDefined();
    expect(mcpKind).toBeDefined();

    const defaultRequired = (defaultKind!.jsonSchema.properties as any).spec
      .required as string[];
    const mcpRequired = (mcpKind!.jsonSchema.properties as any).spec
      .required as string[];

    expect(defaultRequired).toContain('definition');
    expect(mcpRequired).toContain('remotes');
    expect(mcpRequired).not.toContain('definition');
    expect(mcpKind!.description).toBe('An MCP server API');
  });
});
