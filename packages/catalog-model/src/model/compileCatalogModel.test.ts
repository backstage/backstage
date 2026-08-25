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

import Ajv from 'ajv';
import { createCatalogModelLayer } from './createCatalogModelLayer';
import { compileCatalogModel } from './compileCatalogModel';
import { defaultCatalogEntityModel } from './defaultCatalogEntityModel';

const layer = createCatalogModelLayer({
  layerId: 'Test',
  builder: model => {
    model.addKind({
      group: 'example.com',
      names: { kind: 'Widget', singular: 'widget', plural: 'widgets' },
      description: 'A test widget kind',
      versions: [
        {
          name: 'v1alpha1',
          schema: {
            jsonSchema: {
              type: 'object',
              required: ['spec'],
              properties: {
                spec: {
                  type: 'object',
                  required: ['size'],
                  properties: {
                    size: { type: 'number' },
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

function compileAndValidate(entity: unknown): boolean {
  const model = compileCatalogModel([layer]);
  const kind = model.getKind({
    kind: 'Widget',
    apiVersion: 'example.com/v1alpha1',
  });
  if (!kind) {
    throw new Error('Kind not found');
  }
  const ajv = new Ajv({ allowUnionTypes: true, allErrors: true });
  const validate = ajv.compile(kind.jsonSchema);
  return validate(entity) as boolean;
}

describe('compileCatalogModel', () => {
  it('should validate a complete entity successfully', () => {
    expect(
      compileAndValidate({
        apiVersion: 'example.com/v1alpha1',
        kind: 'Widget',
        metadata: { name: 'my-widget' },
        spec: { size: 42 },
      }),
    ).toBe(true);
  });

  it('should fail when metadata.name is missing', () => {
    expect(
      compileAndValidate({
        apiVersion: 'example.com/v1alpha1',
        kind: 'Widget',
        metadata: {},
        spec: { size: 42 },
      }),
    ).toBe(false);
  });

  it('should fail when a required spec field is missing', () => {
    expect(
      compileAndValidate({
        apiVersion: 'example.com/v1alpha1',
        kind: 'Widget',
        metadata: { name: 'my-widget' },
        spec: {},
      }),
    ).toBe(false);
  });

  it('should fail when a spec field has the wrong type', () => {
    expect(
      compileAndValidate({
        apiVersion: 'example.com/v1alpha1',
        kind: 'Widget',
        metadata: { name: 'my-widget' },
        spec: { size: 'large' },
      }),
    ).toBe(false);
  });

  it('should fail when kind does not match', () => {
    expect(
      compileAndValidate({
        apiVersion: 'example.com/v1alpha1',
        kind: 'Other',
        metadata: { name: 'my-widget' },
        spec: { size: 42 },
      }),
    ).toBe(false);
  });

  it('should fail when apiVersion does not match', () => {
    expect(
      compileAndValidate({
        apiVersion: 'example.com/v1beta1',
        kind: 'Widget',
        metadata: { name: 'my-widget' },
        spec: { size: 42 },
      }),
    ).toBe(false);
  });

  it('should return undefined for an unknown kind', () => {
    const model = compileCatalogModel([layer]);
    expect(
      model.getKind({ kind: 'Unknown', apiVersion: 'example.com/v1alpha1' }),
    ).toBeUndefined();
  });
});

describe('compileCatalogModel jsonSchema $id', () => {
  // Both versions intentionally reuse the exact same schema object, the way
  // a model source might if it hasn't changed the spec shape between
  // apiVersions.
  const sharedKindSchema = {
    $id: 'SharedGadgetSchema',
    type: 'object',
    required: ['spec'],
    properties: {
      spec: {
        type: 'object',
        required: ['owner'],
        properties: { owner: { type: 'string' } },
      },
    },
  };

  const multiVersionLayer = createCatalogModelLayer({
    layerId: 'MultiVersion',
    builder: model => {
      model.addKind({
        group: 'example.com',
        names: { kind: 'Gadget', singular: 'gadget', plural: 'gadgets' },
        description: 'A test gadget kind with multiple apiVersions',
        versions: [
          { name: 'v1alpha1', schema: { jsonSchema: sharedKindSchema } },
          { name: 'v1beta1', schema: { jsonSchema: sharedKindSchema } },
        ],
      });
    },
  });

  it('gives distinct $ids to different apiVersions of the same kind, even when they share a schema object', () => {
    const model = compileCatalogModel([multiVersionLayer]);
    const v1alpha1 = model.getKind({
      kind: 'Gadget',
      apiVersion: 'example.com/v1alpha1',
    });
    const v1beta1 = model.getKind({
      kind: 'Gadget',
      apiVersion: 'example.com/v1beta1',
    });

    expect(v1alpha1?.jsonSchema.$id).toBeDefined();
    expect(v1beta1?.jsonSchema.$id).toBeDefined();
    expect(v1alpha1?.jsonSchema.$id).not.toEqual(v1beta1?.jsonSchema.$id);
  });

  it('lets a single shared Ajv instance compile both apiVersion schemas without an $id collision', () => {
    const model = compileCatalogModel([multiVersionLayer]);
    const v1alpha1 = model.getKind({
      kind: 'Gadget',
      apiVersion: 'example.com/v1alpha1',
    });
    const v1beta1 = model.getKind({
      kind: 'Gadget',
      apiVersion: 'example.com/v1beta1',
    });

    const ajv = new Ajv({ allowUnionTypes: true, allErrors: true });
    expect(() => ajv.compile(v1alpha1!.jsonSchema)).not.toThrow();
    expect(() => ajv.compile(v1beta1!.jsonSchema)).not.toThrow();
  });

  it('lets a single shared Ajv instance compile multiple versions of a built-in kind', () => {
    const model = compileCatalogModel([defaultCatalogEntityModel]);
    const v1alpha1 = model.getKind({
      kind: 'Component',
      apiVersion: 'backstage.io/v1alpha1',
    });
    const v1beta1 = model.getKind({
      kind: 'Component',
      apiVersion: 'backstage.io/v1beta1',
    });

    const ajv = new Ajv({ allowUnionTypes: true, allErrors: true });
    expect(() => ajv.compile(v1alpha1!.jsonSchema)).not.toThrow();
    expect(() => ajv.compile(v1beta1!.jsonSchema)).not.toThrow();
  });

  it('gives distinct $ids to different specTypes of the same kind/apiVersion', () => {
    const specTypeLayer = createCatalogModelLayer({
      layerId: 'SpecTypes',
      builder: model => {
        model.addKind({
          group: 'example.com',
          names: {
            kind: 'Sprocket',
            singular: 'sprocket',
            plural: 'sprockets',
          },
          description: 'A test sprocket kind with discriminated spec types',
          versions: [
            {
              name: 'v1alpha1',
              specType: 'database',
              schema: { jsonSchema: { type: 'object', properties: {} } },
            },
            {
              name: 'v1alpha1',
              specType: 'bucket',
              schema: { jsonSchema: { type: 'object', properties: {} } },
            },
          ],
        });
      },
    });

    const model = compileCatalogModel([specTypeLayer]);
    const database = model.getKind({
      kind: 'Sprocket',
      apiVersion: 'example.com/v1alpha1',
      spec: { type: 'database' },
    });
    const bucket = model.getKind({
      kind: 'Sprocket',
      apiVersion: 'example.com/v1alpha1',
      spec: { type: 'bucket' },
    });

    expect(database?.jsonSchema.$id).toBeDefined();
    expect(bucket?.jsonSchema.$id).toBeDefined();
    expect(database?.jsonSchema.$id).not.toEqual(bucket?.jsonSchema.$id);
  });
});

describe('compileCatalogModel specType', () => {
  const specTypeLayer = createCatalogModelLayer({
    layerId: 'SpecType',
    builder: model => {
      model.addKind({
        group: 'example.com',
        names: {
          kind: 'Component',
          singular: 'component',
          plural: 'components',
        },
        description: 'A component',
        versions: [
          {
            name: 'v1alpha1',
            schema: {
              jsonSchema: {
                type: 'object',
                required: ['spec'],
                properties: {
                  spec: {
                    type: 'object',
                    required: ['lifecycle'],
                    properties: {
                      lifecycle: { type: 'string' },
                    },
                  },
                },
              },
            },
          },
          {
            name: 'v1alpha1',
            specType: 'service',
            description: 'A service component',
            schema: {
              jsonSchema: {
                type: 'object',
                required: ['spec'],
                properties: {
                  spec: {
                    type: 'object',
                    required: ['lifecycle', 'port'],
                    properties: {
                      lifecycle: { type: 'string' },
                      port: { type: 'number' },
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

  it('should return the default version when no spec type is given', () => {
    const model = compileCatalogModel([specTypeLayer]);
    const kind = model.getKind({
      kind: 'Component',
      apiVersion: 'example.com/v1alpha1',
    });
    expect(kind).toBeDefined();
    // The default version requires lifecycle but not port
    const specSchema = (kind!.jsonSchema as any).properties.spec;
    expect(specSchema.required).toEqual(['lifecycle']);
    expect(specSchema.properties.port).toBeUndefined();
  });

  it('should return the typed version when a matching spec type is given', () => {
    const model = compileCatalogModel([specTypeLayer]);
    const kind = model.getKind({
      kind: 'Component',
      apiVersion: 'example.com/v1alpha1',
      spec: { type: 'service' },
    });
    expect(kind).toBeDefined();
    // The service version requires both lifecycle and port
    const specSchema = (kind!.jsonSchema as any).properties.spec;
    expect(specSchema.required).toEqual(['lifecycle', 'port']);
    expect(specSchema.properties.port).toEqual({ type: 'number' });
  });

  it('should fall back to the default version for an unknown spec type', () => {
    const model = compileCatalogModel([specTypeLayer]);
    const kind = model.getKind({
      kind: 'Component',
      apiVersion: 'example.com/v1alpha1',
      spec: { type: 'unknown-type' },
    });
    expect(kind).toBeDefined();
    // Falls back to the default version
    const specSchema = (kind!.jsonSchema as any).properties.spec;
    expect(specSchema.required).toEqual(['lifecycle']);
    expect(specSchema.properties.port).toBeUndefined();
  });
});

describe('compileCatalogModel integration', () => {
  it('should support the full add/update/remove lifecycle', () => {
    // Step 1: Add one of everything
    const base = createCatalogModelLayer({
      layerId: 'Base',
      builder: model => {
        model.addKind({
          group: 'example.com',
          names: { kind: 'Widget', singular: 'widget', plural: 'widgets' },
          description: 'A widget',
          versions: [
            {
              name: 'v1alpha1',
              relationFields: [
                {
                  selector: { path: 'spec.owner' },
                  relation: 'ownedBy',
                  defaultKind: 'Group',
                  defaultNamespace: 'inherit',
                  allowedKinds: ['Group', 'User'],
                },
              ],
              schema: {
                jsonSchema: {
                  type: 'object',
                  required: ['spec'],
                  properties: {
                    spec: {
                      type: 'object',
                      required: ['size'],
                      properties: {
                        size: { type: 'number' },
                      },
                    },
                  },
                },
              },
            },
          ],
        });

        model.addRelationPair({
          fromKind: 'Widget',
          toKind: ['Group', 'User'],
          description: 'Ownership',
          forward: { type: 'ownedBy', title: 'owned by' },
          reverse: { type: 'ownerOf', title: 'owner of' },
        });

        model.addAnnotation({
          name: 'example.com/docs-url',
          title: 'Docs URL',
          description: 'Link to docs',
          schema: { jsonSchema: { type: 'string', minLength: 1 } },
        });

        model.addLabel({
          name: 'example.com/tier',
          title: 'Tier',
          description: 'Service tier',
          schema: { jsonSchema: { type: 'string', enum: ['gold', 'silver'] } },
        });

        model.addTag({
          name: 'production',
          title: 'Production',
          description: 'Production-ready',
        });
      },
    });

    // Verify base state
    const model1 = compileCatalogModel([base]);

    const kind1 = model1.getKind({
      kind: 'Widget',
      apiVersion: 'example.com/v1alpha1',
    });
    expect(kind1).toEqual({
      description: 'A widget',
      apiVersions: ['example.com/v1alpha1'],
      names: { kind: 'Widget', singular: 'widget', plural: 'widgets' },
      relationFields: [
        {
          path: 'spec.owner',
          relation: 'ownedBy',
          defaultKind: 'Group',
          defaultNamespace: 'inherit',
          allowedKinds: ['Group', 'User'],
        },
      ],
      jsonSchema: {
        $id: 'Widget/example.com%2Fv1alpha1',
        type: 'object',
        required: ['spec', 'apiVersion', 'kind', 'metadata'],
        additionalProperties: false,
        properties: {
          apiVersion: { const: 'example.com/v1alpha1' },
          kind: { const: 'Widget' },
          metadata: {
            type: 'object',
            required: ['name'],
            additionalProperties: true,
            properties: {
              uid: {
                type: 'string',
                description: 'A globally unique ID for the entity.',
                minLength: 1,
              },
              etag: {
                type: 'string',
                description:
                  'An opaque string that changes for each update operation to any part of the entity, including metadata.',
                minLength: 1,
              },
              name: {
                type: 'string',
                description:
                  'The name of the entity. Must be unique within the catalog at any given point in time, for any given namespace + kind pair.',
                minLength: 1,
              },
              namespace: {
                type: 'string',
                description: 'The namespace that the entity belongs to.',
                default: 'default',
                minLength: 1,
              },
              title: {
                type: 'string',
                description:
                  'A display name of the entity, to be presented in user interfaces instead of the name property, when available.',
                minLength: 1,
              },
              description: {
                type: 'string',
                description:
                  'A short (typically relatively few words, on one line) description of the entity.',
              },
              annotations: {
                type: 'object',
                description:
                  'Key/value pairs of non-identifying auxiliary information attached to the entity.',
                additionalProperties: { type: 'string' },
                properties: {
                  'example.com/docs-url': { type: 'string', minLength: 1 },
                },
              },
              labels: {
                type: 'object',
                description:
                  'Key/value pairs of identifying information attached to the entity.',
                additionalProperties: { type: 'string' },
                properties: {
                  'example.com/tier': {
                    type: 'string',
                    enum: ['gold', 'silver'],
                  },
                },
              },
              tags: {
                type: 'array',
                description:
                  'A list of single-valued strings, to for example classify catalog entities in various ways.',
                items: { type: 'string', minLength: 1 },
              },
              links: {
                type: 'array',
                description:
                  'A list of external hyperlinks related to the entity.',
                items: {
                  type: 'object',
                  required: ['url'],
                  properties: {
                    url: { type: 'string', minLength: 1 },
                    title: { type: 'string', minLength: 1 },
                    icon: { type: 'string', minLength: 1 },
                    type: { type: 'string', minLength: 1 },
                  },
                },
              },
            },
          },
          spec: {
            type: 'object',
            required: ['size'],
            properties: {
              size: { type: 'number' },
            },
          },
        },
      },
    });

    expect(model1.getRelations({ kind: 'Widget' })).toEqual([
      {
        fromKind: ['Widget'],
        toKind: ['Group', 'User'],
        description: 'Ownership',
        forward: { type: 'ownedBy', title: 'owned by' },
        reverse: { type: 'ownerOf', title: 'owner of' },
      },
    ]);

    // Step 2: Update everything
    const updates = createCatalogModelLayer({
      layerId: 'Updates',
      builder: model => {
        model.updateKind({
          names: { kind: 'Widget', singular: 'gizmo', plural: 'gizmos' },
          description: 'An updated widget',
          versions: [
            {
              name: 'v1alpha1',
              schema: {
                jsonSchema: {
                  type: 'object',
                  properties: {
                    spec: {
                      type: 'object',
                      properties: {
                        color: { type: 'string' },
                      },
                    },
                  },
                },
              },
            },
          ],
        });

        model.updateAnnotation({
          name: 'example.com/docs-url',
          title: 'Documentation URL',
          description: 'Updated link to docs',
        });

        model.updateLabel({
          name: 'example.com/tier',
          description: 'Updated tier',
        });

        model.updateTag({
          name: 'production',
          description: 'Updated production tag',
        });
      },
    });

    const model2 = compileCatalogModel([base, updates]);

    const kind2 = model2.getKind({
      kind: 'Widget',
      apiVersion: 'example.com/v1alpha1',
    });
    expect(kind2).toEqual({
      description: 'An updated widget',
      apiVersions: ['example.com/v1alpha1'],
      names: { kind: 'Widget', singular: 'gizmo', plural: 'gizmos' },
      relationFields: [
        {
          path: 'spec.owner',
          relation: 'ownedBy',
          defaultKind: 'Group',
          defaultNamespace: 'inherit',
          allowedKinds: ['Group', 'User'],
        },
      ],
      jsonSchema: {
        $id: 'Widget/example.com%2Fv1alpha1',
        type: 'object',
        required: ['spec', 'apiVersion', 'kind', 'metadata'],
        additionalProperties: false,
        properties: {
          apiVersion: { const: 'example.com/v1alpha1' },
          kind: { const: 'Widget' },
          metadata: {
            type: 'object',
            required: ['name'],
            additionalProperties: true,
            properties: {
              uid: {
                type: 'string',
                description: 'A globally unique ID for the entity.',
                minLength: 1,
              },
              etag: {
                type: 'string',
                description:
                  'An opaque string that changes for each update operation to any part of the entity, including metadata.',
                minLength: 1,
              },
              name: {
                type: 'string',
                description:
                  'The name of the entity. Must be unique within the catalog at any given point in time, for any given namespace + kind pair.',
                minLength: 1,
              },
              namespace: {
                type: 'string',
                description: 'The namespace that the entity belongs to.',
                default: 'default',
                minLength: 1,
              },
              title: {
                type: 'string',
                description:
                  'A display name of the entity, to be presented in user interfaces instead of the name property, when available.',
                minLength: 1,
              },
              description: {
                type: 'string',
                description:
                  'A short (typically relatively few words, on one line) description of the entity.',
              },
              annotations: {
                type: 'object',
                description:
                  'Key/value pairs of non-identifying auxiliary information attached to the entity.',
                additionalProperties: { type: 'string' },
                properties: {
                  'example.com/docs-url': { type: 'string', minLength: 1 },
                },
              },
              labels: {
                type: 'object',
                description:
                  'Key/value pairs of identifying information attached to the entity.',
                additionalProperties: { type: 'string' },
                properties: {
                  'example.com/tier': {
                    type: 'string',
                    enum: ['gold', 'silver'],
                  },
                },
              },
              tags: {
                type: 'array',
                description:
                  'A list of single-valued strings, to for example classify catalog entities in various ways.',
                items: { type: 'string', minLength: 1 },
              },
              links: {
                type: 'array',
                description:
                  'A list of external hyperlinks related to the entity.',
                items: {
                  type: 'object',
                  required: ['url'],
                  properties: {
                    url: { type: 'string', minLength: 1 },
                    title: { type: 'string', minLength: 1 },
                    icon: { type: 'string', minLength: 1 },
                    type: { type: 'string', minLength: 1 },
                  },
                },
              },
            },
          },
          spec: {
            type: 'object',
            required: ['size'],
            properties: {
              size: { type: 'number' },
              color: { type: 'string' },
            },
          },
        },
      },
    });

    expect(model2.getRelations({ kind: 'Widget' })).toEqual([
      {
        fromKind: ['Widget'],
        toKind: ['Group', 'User'],
        description: 'Ownership',
        forward: { type: 'ownedBy', title: 'owned by' },
        reverse: { type: 'ownerOf', title: 'owner of' },
      },
    ]);

    // Step 3: Remove things
    const removals = createCatalogModelLayer({
      layerId: 'Removals',
      builder: model => {
        model.removeAnnotation({ name: 'example.com/docs-url' });
        model.removeLabel({ name: 'example.com/tier' });
        model.removeTag({ name: 'production' });
      },
    });

    const model3 = compileCatalogModel([base, updates, removals]);

    const kind3 = model3.getKind({
      kind: 'Widget',
      apiVersion: 'example.com/v1alpha1',
    });
    expect(kind3).toEqual({
      description: 'An updated widget',
      apiVersions: ['example.com/v1alpha1'],
      names: { kind: 'Widget', singular: 'gizmo', plural: 'gizmos' },
      relationFields: [
        {
          path: 'spec.owner',
          relation: 'ownedBy',
          defaultKind: 'Group',
          defaultNamespace: 'inherit',
          allowedKinds: ['Group', 'User'],
        },
      ],
      jsonSchema: {
        $id: 'Widget/example.com%2Fv1alpha1',
        type: 'object',
        required: ['spec', 'apiVersion', 'kind', 'metadata'],
        additionalProperties: false,
        properties: {
          apiVersion: { const: 'example.com/v1alpha1' },
          kind: { const: 'Widget' },
          metadata: {
            type: 'object',
            required: ['name'],
            additionalProperties: true,
            properties: {
              uid: {
                type: 'string',
                description: 'A globally unique ID for the entity.',
                minLength: 1,
              },
              etag: {
                type: 'string',
                description:
                  'An opaque string that changes for each update operation to any part of the entity, including metadata.',
                minLength: 1,
              },
              name: {
                type: 'string',
                description:
                  'The name of the entity. Must be unique within the catalog at any given point in time, for any given namespace + kind pair.',
                minLength: 1,
              },
              namespace: {
                type: 'string',
                description: 'The namespace that the entity belongs to.',
                default: 'default',
                minLength: 1,
              },
              title: {
                type: 'string',
                description:
                  'A display name of the entity, to be presented in user interfaces instead of the name property, when available.',
                minLength: 1,
              },
              description: {
                type: 'string',
                description:
                  'A short (typically relatively few words, on one line) description of the entity.',
              },
              annotations: {
                type: 'object',
                description:
                  'Key/value pairs of non-identifying auxiliary information attached to the entity.',
                additionalProperties: { type: 'string' },
                properties: {},
              },
              labels: {
                type: 'object',
                description:
                  'Key/value pairs of identifying information attached to the entity.',
                additionalProperties: { type: 'string' },
                properties: {},
              },
              tags: {
                type: 'array',
                description:
                  'A list of single-valued strings, to for example classify catalog entities in various ways.',
                items: { type: 'string', minLength: 1 },
              },
              links: {
                type: 'array',
                description:
                  'A list of external hyperlinks related to the entity.',
                items: {
                  type: 'object',
                  required: ['url'],
                  properties: {
                    url: { type: 'string', minLength: 1 },
                    title: { type: 'string', minLength: 1 },
                    icon: { type: 'string', minLength: 1 },
                    type: { type: 'string', minLength: 1 },
                  },
                },
              },
            },
          },
          spec: {
            type: 'object',
            required: ['size'],
            properties: {
              size: { type: 'number' },
              color: { type: 'string' },
            },
          },
        },
      },
    });

    // Step 4: Remove the kind entirely
    const kindRemoval = createCatalogModelLayer({
      layerId: 'KindRemoval',
      builder: model => {
        model.removeKind({ kind: 'Widget' });
      },
    });

    const model4 = compileCatalogModel([base, updates, removals, kindRemoval]);

    expect(
      model4.getKind({
        kind: 'Widget',
        apiVersion: 'example.com/v1alpha1',
      }),
    ).toBeUndefined();
    expect(model4.getRelations({ kind: 'Widget' })).toBeUndefined();
  });
});

describe('compileCatalogModel relation pairs', () => {
  it('preserves exact kind pairs when extending a relation', () => {
    const extension = createCatalogModelLayer({
      layerId: 'example.com/extended-part-of',
      builder: model => {
        model.updateRelationPair({
          fromKind: 'User',
          toKind: 'Location',
          forward: { type: 'partOf' },
          reverse: { type: 'hasPart' },
        });
      },
    });

    const model = compileCatalogModel([defaultCatalogEntityModel, extension]);

    expect(
      model
        .getRelations({ kind: 'Component' })
        ?.find(r => r.forward.type === 'partOf')?.toKind,
    ).toEqual(['Component', 'System']);
    expect(
      model
        .getRelations({ kind: 'User' })
        ?.find(r => r.forward.type === 'partOf')?.toKind,
    ).toEqual(['Location']);
    expect(
      model
        .getRelations({ kind: 'Location' })
        ?.find(r => r.forward.type === 'hasPart')?.toKind,
    ).toEqual(['User']);

    expect(
      model.listRelations().find(r => r.forward.type === 'partOf'),
    ).toEqual(
      expect.objectContaining({
        fromKind: ['Component', 'API', 'Resource', 'System', 'Domain', 'User'],
        toKind: ['Component', 'System', 'Domain', 'Location'],
      }),
    );
  });

  it('preserves relation summary kind order when extending a relation', () => {
    const base = createCatalogModelLayer({
      layerId: 'example.com/base-related-to',
      builder: model => {
        model.addRelationPair({
          fromKind: 'A',
          toKind: 'X',
          description: 'A relation used to verify summary ordering.',
          forward: { type: 'relatedTo', title: 'related to' },
          reverse: { type: 'relatedFrom', title: 'related from' },
        });
      },
    });
    const extension = createCatalogModelLayer({
      layerId: 'example.com/extended-related-to',
      builder: model => {
        model.updateRelationPair({
          fromKind: 'B',
          toKind: 'Y',
          forward: { type: 'relatedTo' },
          reverse: { type: 'relatedFrom' },
        });
        model.updateRelationPair({
          fromKind: 'A',
          toKind: 'Z',
          forward: { type: 'relatedTo' },
          reverse: { type: 'relatedFrom' },
        });
      },
    });

    expect(
      compileCatalogModel([base, extension])
        .listRelations()
        .find(r => r.forward.type === 'relatedTo'),
    ).toEqual(
      expect.objectContaining({
        fromKind: ['A', 'B'],
        toKind: ['X', 'Y', 'Z'],
      }),
    );
  });
});
