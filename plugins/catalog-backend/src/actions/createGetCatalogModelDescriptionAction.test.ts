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

import { actionsRegistryServiceMock } from '@backstage/backend-test-utils/alpha';
import { CatalogModel } from '@backstage/catalog-model/alpha';
import { createGetCatalogModelDescriptionAction } from './createGetCatalogModelDescriptionAction';
import { ModelHolder } from '../model/ModelHolder';

const model: CatalogModel = {
  listKinds: () => [
    {
      description: 'A software component',
      names: { kind: 'Component', singular: 'component', plural: 'components' },
      versions: [
        { apiVersion: 'backstage.io/v1alpha1' },
        { apiVersion: 'backstage.io/v1alpha1', specType: 'service' },
        { apiVersion: 'backstage.io/v1beta1' },
      ],
    },
  ],
  listRelations: () => [
    {
      fromKind: ['Component'],
      toKind: ['Group', 'User'],
      description: 'Ownership relation',
      forward: { type: 'ownedBy', title: 'owned by' },
      reverse: { type: 'ownerOf', title: 'owner of' },
    },
  ],
  getMetadata: () => ({
    annotations: [
      {
        name: 'backstage.io/managed-by-location',
        title: 'Managed By Location',
        description: 'The location that manages this entity.',
      },
    ],
    labels: [
      {
        name: 'backstage.io/orphan',
        description: 'Indicates that this entity is an orphan.',
      },
    ],
    tags: [
      {
        name: 'java',
        title: 'Java',
        description: 'Relates to the Java programming language.',
      },
    ],
  }),
  getKind: ({ kind }) =>
    kind === 'Component'
      ? {
          description: 'A software component',
          apiVersions: ['backstage.io/v1alpha1', 'backstage.io/v1beta1'],
          names: {
            kind: 'Component',
            singular: 'component',
            plural: 'components',
          },
          relationFields: [
            {
              path: 'spec.owner',
              relation: 'ownedBy',
              defaultKind: 'Group',
              allowedKinds: ['Group', 'User'],
            },
          ],
          // The flat shape that compiled models produce: composition keywords
          // are not allowed on the root or on its direct properties
          jsonSchema: {
            type: 'object',
            properties: {
              apiVersion: { type: 'string' },
              kind: { type: 'string' },
              metadata: {
                type: 'object',
                properties: { name: { type: 'string' } },
              },
              spec: {
                type: 'object',
                required: ['owner', 'lifecycle'],
                properties: {
                  owner: {
                    type: 'string',
                    description: 'The owner of the component.',
                  },
                  lifecycle: {
                    type: 'string',
                    enum: ['production', 'experimental'],
                  },
                  tags: { type: 'array', items: { type: 'string' } },
                  ids: {
                    type: 'array',
                    items: { type: ['string', 'number'] },
                  },
                  links: { $ref: '#/definitions/Links' },
                  nested: {
                    type: 'object',
                    properties: { deep: { type: 'number' } },
                  },
                },
              },
            },
          },
        }
      : undefined,
  getRelations: () => undefined,
};

type TestVersion = { apiVersion: string; specType?: string };

// Builds a model where the spec fields of each kind are decided by a callback,
// so that tests can control which versions render identical or distinct fields
function createModelWithKinds(
  kinds: Array<{ kind: string; versions: TestVersion[] }>,
  specFieldsFor: (version: TestVersion) => string[],
): CatalogModel {
  return {
    listKinds: () =>
      kinds.map(({ kind, versions }) => ({
        description: `The ${kind} kind`,
        names: {
          kind,
          singular: kind.toLowerCase(),
          plural: `${kind.toLowerCase()}s`,
        },
        versions,
      })),
    listRelations: () => [],
    getMetadata: () => ({ annotations: [], labels: [], tags: [] }),
    getKind: ({ kind, apiVersion, spec }) => {
      const found = kinds.find(k => k.kind === kind);
      if (!found) {
        return undefined;
      }
      const specFields = specFieldsFor({
        apiVersion,
        specType: typeof spec?.type === 'string' ? spec.type : undefined,
      });
      return {
        description: `The ${kind} kind`,
        apiVersions: [apiVersion],
        names: {
          kind,
          singular: kind.toLowerCase(),
          plural: `${kind.toLowerCase()}s`,
        },
        relationFields: [],
        jsonSchema: {
          properties: {
            spec: {
              type: 'object',
              properties: Object.fromEntries(
                specFields.map(name => [name, { type: 'string' }]),
              ),
            },
          },
        },
      };
    },
    getRelations: () => undefined,
  };
}

// Builds a model with a single Widget kind whose spec schema is decided by a
// callback for each version
function createModelWithSpecSchema(
  versions: TestVersion[],
  specSchemaFor: (version: TestVersion) => Record<string, any>,
): CatalogModel {
  const names = { kind: 'Widget', singular: 'widget', plural: 'widgets' };
  return {
    listKinds: () => [{ description: 'The Widget kind', names, versions }],
    listRelations: () => [],
    getMetadata: () => ({ annotations: [], labels: [], tags: [] }),
    getKind: ({ apiVersion, spec }) => ({
      description: 'The Widget kind',
      apiVersions: [apiVersion],
      names,
      relationFields: [],
      jsonSchema: {
        properties: {
          spec: specSchemaFor({
            apiVersion,
            specType: typeof spec?.type === 'string' ? spec.type : undefined,
          }),
        },
      },
    }),
    getRelations: () => undefined,
  };
}

async function describeModel(testModel?: CatalogModel): Promise<string> {
  const mockActionsRegistry = actionsRegistryServiceMock();
  createGetCatalogModelDescriptionAction({
    modelHolder: testModel
      ? ModelHolder.modelPassthroughForTest(testModel)
      : undefined,
    actionsRegistry: mockActionsRegistry,
  });
  const result = await mockActionsRegistry.invoke({
    id: 'test:get-catalog-model-description',
    input: {},
  });
  return (result as any).output.description as string;
}

describe('createGetCatalogModelDescriptionAction', () => {
  it('should return a markdown description of the catalog model', async () => {
    const description = await describeModel(model);

    expect(description).toContain('# Catalog Model');
    expect(description).toContain('## Entity Kinds');
    expect(description).toContain('## Entity Relations');
    expect(description).toContain('## Entity Metadata field');

    // Kind details
    expect(description).toContain('### Entity Kind "Component"');
    expect(description).toContain('A software component');
    expect(description).toContain('apiVersion: "backstage.io/v1alpha1"');
    expect(description).toContain('spec.type: "service"');
    expect(description).toContain('Singular in text: "component"');
    expect(description).toContain('Plural in text: "components"');

    // Relation details
    expect(description).toContain('### Relation "ownedBy": owned by');
    expect(description).toContain('Ownership relation');
    expect(description).toContain('Reverse type: "ownerOf": owner of');

    // Annotation details
    expect(description).toContain(
      '### Annotation "backstage.io/managed-by-location": Managed By Location',
    );
    expect(description).toContain('The location that manages this entity.');

    // Label details
    expect(description).toContain('### Label "backstage.io/orphan"');
    expect(description).toContain('Indicates that this entity is an orphan.');

    // Tag details
    expect(description).toContain('### Tag "java": Java');
    expect(description).toContain('Relates to the Java programming language.');
  });

  it('should fall back to the default model when no model holder is provided', async () => {
    const description = await describeModel();

    expect(description).toContain('# Catalog Model');
    expect(description).toContain('## Entity Kinds');
    expect(description).toContain('### Entity Kind "Component"');
    // Full field lines, since the preamble mentions some field paths too
    expect(description).toContain(
      '* "spec.lifecycle" (string, required): The lifecycle state of the component.',
    );
    expect(description).toContain(
      '* "spec.owner" (string, required, relation "ownedBy" [default kind: Group; allowed kinds: Group, User]): An entity reference to the owner of the component.',
    );
    // A relation without a declared field still gets its own line
    expect(description).toContain(
      '* "spec.dependencyOf" (relation "dependencyOf")',
    );
  });

  it('should describe kind fields and relation fields', async () => {
    const description = await describeModel(model);

    // Versions with identical fields are grouped
    expect(description.match(/#### Fields/g)).toHaveLength(2);
    expect(description).toContain(
      '#### Fields (backstage.io/v1alpha1, backstage.io/v1beta1)',
    );
    // The relation is described on the line of the field that generates it
    expect(description).toContain(
      '* "spec.owner" (string, required, relation "ownedBy" [default kind: Group; allowed kinds: Group, User]): The owner of the component.',
    );
    expect(description).not.toContain('"spec.owner" →');
    expect(description).toContain('* "spec.tags" (array of string)');
    expect(description).toContain('* "spec.ids" (array of string | number)');
    expect(description).toContain(
      '* "spec.links" (reference to "#/definitions/Links")',
    );
    expect(description).toContain(
      '* "spec.lifecycle" (string, required, one of "production", "experimental")',
    );
    expect(description).toContain('* "spec.nested.deep" (number)');

    // Base fields are not repeated for every kind
    expect(description).not.toContain('"metadata.name" (');
    expect(description).not.toContain('"apiVersion" (');
  });

  it('should flag fields whose details are not fully listed', async () => {
    const description = await describeModel(
      createModelWithSpecSchema([{ apiVersion: 'example.com/v1' }], () => ({
        type: 'object',
        properties: {
          // Fields beyond the maximum depth are not listed
          a: {
            type: 'object',
            properties: {
              b: {
                type: 'object',
                properties: { c: { type: 'string' } },
              },
            },
          },
          // Fields of arrays of arrays are not listed
          matrix: {
            type: 'array',
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: { cell: { type: 'string' } },
              },
            },
          },
          contact: {
            type: 'object',
            dependentRequired: { email: ['name'] },
            properties: { email: { type: 'string' } },
          },
          // Boolean schemas allow anything or nothing
          anything: true,
          nothing: false,
          narrowed: { allOf: [{ type: 'string' }, false] },
        },
      })),
    );

    expect(description).toContain(
      '* "spec.a.b" (object, has nested fields not listed here)',
    );
    expect(description).not.toContain('"spec.a.b.c"');
    expect(description).toContain(
      '* "spec.matrix" (array of array of object, has nested fields not listed here)',
    );
    expect(description).not.toContain('"spec.matrix.cell"');
    expect(description).toContain(
      '* "spec.contact" (object, has conditional constraints not listed here)',
    );
    expect(description).toContain('* "spec.contact.email" (string)');
    expect(description).toContain('* "spec.anything" (any value)');
    expect(description).toContain('* "spec.nothing" (not allowed)');
    expect(description).toContain(
      '* "spec.narrowed" (string, no allowed values)',
    );
  });

  it('should describe tuples, boolean items and extra keys', async () => {
    const description = await describeModel(
      createModelWithSpecSchema([{ apiVersion: 'example.com/v1' }], () => ({
        type: 'object',
        properties: {
          // Draft 7 tuple, with object items whose fields are not listed
          pair: {
            type: 'array',
            items: [
              { type: 'string' },
              { type: 'object', properties: { x: { type: 'number' } } },
            ],
            additionalItems: false,
          },
          // Draft 2020-12 tuple, where items applies after the tuple
          point: {
            type: 'array',
            prefixItems: [{ type: 'number' }, true],
            items: { type: 'string' },
          },
          none: { type: 'array', items: false },
          any: { type: 'array', items: true },
          labels: {
            type: 'object',
            additionalProperties: { type: 'string' },
          },
          closed: {
            allOf: [
              { type: 'object', additionalProperties: true },
              { additionalProperties: false },
            ],
          },
          patterned: {
            type: 'object',
            patternProperties: { '^x-': { type: 'string' } },
          },
          // then/else without an if still constrain the field in some drafts
          dangling: { type: 'string', then: { minLength: 1 } },
        },
      })),
    );

    expect(description).toContain(
      '* "spec.pair" (tuple of [string, object] with no further items, has nested fields not listed here)',
    );
    expect(description).not.toContain('"spec.pair.x"');
    expect(description).toContain(
      '* "spec.point" (tuple of [number, any value] followed by string)',
    );
    expect(description).toContain('* "spec.none" (empty array)');
    expect(description).toContain('* "spec.any" (array)');
    expect(description).toContain(
      '* "spec.labels" (object, other keys: string)',
    );
    expect(description).toContain('* "spec.closed" (object, no other keys)');
    expect(description).toContain(
      '* "spec.patterned" (object, has pattern-matched keys not listed here)',
    );
    expect(description).toContain(
      '* "spec.dangling" (string, has conditional constraints not listed here)',
    );
  });

  it('should fold every allOf declaration of a field', async () => {
    const description = await describeModel(
      createModelWithSpecSchema([{ apiVersion: 'example.com/v1' }], () => ({
        type: 'object',
        properties: {
          cfg: {
            type: 'object',
            allOf: [
              // Required in a sibling of the entry that declares the properties
              { required: ['owner', 'team'] },
              {
                properties: {
                  owner: { type: 'string' },
                  team: { $ref: '#/definitions/Team' },
                  mode: { type: 'string', description: 'The mode.' },
                },
              },
              {
                properties: {
                  // Stacked on the declaration above, narrowing it to an enum
                  mode: { enum: ['fast', 'slow', 'off'] },
                  team: { description: 'The owning team.' },
                },
              },
              { properties: { mode: { enum: ['fast', 'slow'] } } },
            ],
          },
          // Composition on the property itself
          level: { allOf: [{ type: 'string' }, { enum: ['low', 'high'] }] },
          endpoints: {
            type: 'array',
            items: {
              type: 'object',
              required: ['url'],
              properties: {
                url: { type: 'string' },
                port: { type: 'number' },
              },
            },
          },
          refs: { type: 'array', items: { $ref: '#/definitions/Ref' } },
        },
      })),
    );

    expect(description).toContain('* "spec.cfg" (object)');
    expect(description).toContain('* "spec.cfg.owner" (string, required)');
    expect(description).toContain(
      '* "spec.cfg.team" (reference to "#/definitions/Team", required): The owning team.',
    );
    // Allowed values are intersected across every declaration
    expect(description).toContain(
      '* "spec.cfg.mode" (string, one of "fast", "slow"): The mode.',
    );
    expect(description).toContain(
      '* "spec.level" (string, one of "low", "high")',
    );
    // Properties of array items are addressed through the array path
    expect(description).toContain('* "spec.endpoints" (array of object)');
    expect(description).toContain('* "spec.endpoints.url" (string, required)');
    expect(description).toContain('* "spec.endpoints.port" (number)');
    expect(description).toContain(
      '* "spec.refs" (array of reference to "#/definitions/Ref")',
    );
    // Every field is described once
    expect(description.match(/"spec.cfg.mode"/g)).toHaveLength(1);
    expect(description.match(/"spec.cfg.team"/g)).toHaveLength(1);
  });

  it('should combine conflicting allOf declarations without dropping any', async () => {
    const description = await describeModel(
      createModelWithSpecSchema([{ apiVersion: 'example.com/v1' }], () => ({
        type: 'object',
        properties: {
          // Every referenced definition applies
          target: {
            allOf: [{ $ref: '#/definitions/A' }, { $ref: '#/definitions/B' }],
          },
          typedRef: {
            allOf: [{ type: 'object' }, { $ref: '#/definitions/A' }],
          },
          // const and enum narrow each other, in one schema or across several
          pinned: { allOf: [{ enum: ['a', 'b'] }, { const: 'a' }] },
          pinnedInline: { enum: ['a', 'b'], const: 'b' },
          impossible: { allOf: [{ enum: ['a'] }, { const: 'b' }] },
          // Types that do not overlap, and integer as a subset of number
          broken: { allOf: [{ type: 'string' }, { type: 'number' }] },
          count: { allOf: [{ type: 'number' }, { type: 'integer' }] },
          notes: {
            type: 'string',
            description: 'Free text.\n\nSpans several lines.',
          },
        },
      })),
    );

    expect(description).toContain(
      '* "spec.target" (reference to "#/definitions/A" and reference to "#/definitions/B")',
    );
    expect(description).toContain(
      '* "spec.typedRef" (object, reference to "#/definitions/A")',
    );
    expect(description).toContain('* "spec.pinned" (unknown, const "a")');
    expect(description).toContain('* "spec.pinnedInline" (unknown, const "b")');
    expect(description).toContain(
      '* "spec.impossible" (unknown, no allowed values)',
    );
    expect(description).toContain('* "spec.broken" (no valid type)');
    expect(description).toContain('* "spec.count" (integer)');
    expect(description).toContain(
      '* "spec.notes" (string): Free text. Spans several lines.',
    );
  });

  it('should combine allOf entries independently of their order', async () => {
    const first = {
      type: ['string', 'number'],
      description: 'First.',
      enum: ['c', 'a', 'b'],
      minLength: 1,
      maxLength: 10,
      format: 'email',
      default: 'a',
    };
    const second = {
      type: ['number', 'string'],
      description: 'Second.',
      enum: ['b', 'a'],
      minLength: 3,
      maxLength: 5,
      format: 'idn-email',
      default: 'b',
    };
    const describeIn = (entries: object[]) =>
      describeModel(
        createModelWithSpecSchema([{ apiVersion: 'example.com/v1' }], () => ({
          type: 'object',
          properties: {
            value: { allOf: entries },
            obj: {
              type: 'object',
              allOf: entries.map((_, i) => ({
                properties:
                  i === 0
                    ? { b: { type: 'string' }, shared: { description: 'B.' } }
                    : { a: { type: 'string' }, shared: { description: 'A.' } },
              })),
            },
            list: {
              type: 'array',
              allOf: entries.map((_, i) =>
                i === 0
                  ? { items: [{ type: 'string' }], additionalItems: false }
                  : { items: { type: 'string', enum: ['x', 'y'] } },
              ),
            },
            target: {
              allOf: entries.map((_, i) => ({
                $ref: i === 0 ? '#/definitions/B' : '#/definitions/A',
              })),
            },
          },
        })),
      );

    const forward = await describeIn([first, second]);
    const backward = await describeIn([second, first]);

    expect(backward).toBe(forward);
    expect(forward).toContain(
      '* "spec.value" (number | string, one of "a", "b"): First. Second.',
    );
    expect(forward).toContain('* "spec.obj.shared" (unknown): A. B.');
    expect(forward.indexOf('"spec.obj.a"')).toBeLessThan(
      forward.indexOf('"spec.obj.b"'),
    );
    expect(forward).toContain(
      '* "spec.list" (tuple of [string [one of "x", "y"]] with no further items)',
    );
    expect(forward).toContain(
      '* "spec.target" (reference to "#/definitions/A" and reference to "#/definitions/B")',
    );
  });

  it('should mark fields with alternative schemas instead of expanding them', async () => {
    const description = await describeModel(
      createModelWithSpecSchema([{ apiVersion: 'example.com/v1' }], () => ({
        type: 'object',
        properties: {
          options: {
            type: 'object',
            properties: { mode: { type: 'string' } },
            anyOf: [
              { properties: { mode: { enum: ['fast'] } } },
              { properties: { label: { type: 'string' } } },
            ],
          },
        },
      })),
    );

    expect(description).toContain(
      '* "spec.options" (object, has conditional constraints not listed here)',
    );
    // Only the unconditional declaration is described
    expect(description).toContain('* "spec.options.mode" (string)');
    expect(description).not.toContain('"spec.options.label"');
    expect(description).not.toContain('one of "fast"');
  });

  it('should not group versions that differ only in a stacked constraint', async () => {
    const description = await describeModel(
      createModelWithSpecSchema(
        [{ apiVersion: 'example.com/v1' }, { apiVersion: 'example.com/v2' }],
        ({ apiVersion }) => ({
          type: 'object',
          properties: {
            mode: {
              allOf: [
                { type: 'string' },
                {
                  enum:
                    apiVersion === 'example.com/v1'
                      ? ['fast']
                      : ['fast', 'slow'],
                },
              ],
            },
          },
        }),
      ),
    );

    expect(description.match(/#### Fields/g)).toHaveLength(2);
    expect(description).toContain('* "spec.mode" (string, one of "fast")');
    expect(description).toContain(
      '* "spec.mode" (string, one of "fast", "slow")',
    );
  });

  it('should not group versions that differ only in allowed item values', async () => {
    const description = await describeModel(
      createModelWithSpecSchema(
        [{ apiVersion: 'example.com/v1' }, { apiVersion: 'example.com/v2' }],
        ({ apiVersion }) => ({
          type: 'object',
          properties: {
            modes: {
              type: 'array',
              items: {
                type: 'string',
                enum:
                  apiVersion === 'example.com/v1' ? ['fast'] : ['fast', 'slow'],
              },
            },
            pinned: { type: 'array', items: { const: 'x' } },
          },
        }),
      ),
    );

    expect(description.match(/#### Fields/g)).toHaveLength(2);
    expect(description).toContain(
      '* "spec.modes" (array of string [one of "fast"])',
    );
    expect(description).toContain(
      '* "spec.modes" (array of string [one of "fast", "slow"])',
    );
    expect(description).toContain(
      '* "spec.pinned" (array of unknown [const "x"])',
    );
  });

  it('should compare allowed values regardless of object key order', async () => {
    const description = await describeModel(
      createModelWithSpecSchema([{ apiVersion: 'example.com/v1' }], () => ({
        type: 'object',
        properties: {
          target: {
            allOf: [
              {
                enum: [
                  { host: 'a', port: 1 },
                  { host: 'b', port: 2 },
                ],
              },
              { enum: [{ port: 1, host: 'a' }] },
            ],
          },
          fixed: {
            allOf: [
              { const: { host: 'a', port: 1 } },
              { const: { port: 1, host: 'a' } },
            ],
          },
        },
      })),
    );

    expect(description).toContain(
      '* "spec.target" (unknown, one of {"host":"a","port":1})',
    );
    expect(description).toContain(
      '* "spec.fixed" (unknown, const {"host":"a","port":1})',
    );
  });

  it('should emit one field block per distinct schema and group identical ones', async () => {
    const description = await describeModel(
      createModelWithKinds(
        [
          {
            kind: 'Widget',
            versions: [
              { apiVersion: 'example.com/v1' },
              { apiVersion: 'example.com/v2' },
              { apiVersion: 'example.com/v3' },
              { apiVersion: 'example.com/v1', specType: 'a' },
              { apiVersion: 'example.com/v2', specType: 'a' },
              { apiVersion: 'example.com/v1', specType: 'b' },
            ],
          },
        ],
        ({ apiVersion, specType }) => [
          'common',
          ...(specType ? [`extra_${specType}`] : []),
          ...(apiVersion === 'example.com/v3' ? ['addedInV3'] : []),
        ],
      ),
    );

    // v1+v2 without spec type are identical and grouped, v3 differs, and each
    // spec type gets its own block (grouped across the versions it shares)
    expect(description.match(/#### Fields/g)).toHaveLength(4);
    expect(description).toContain(
      '#### Fields (example.com/v1, example.com/v2)',
    );
    expect(description).toContain('#### Fields (example.com/v3)');
    expect(description).toContain(
      '#### Fields (example.com/v1, example.com/v2; spec.type: "a")',
    );
    expect(description).toContain(
      '#### Fields (example.com/v1; spec.type: "b")',
    );
    expect(description.match(/"spec.addedInV3"/g)).toHaveLength(1);
    expect(description.match(/"spec.extra_a"/g)).toHaveLength(1);
    expect(description.match(/"spec.extra_b"/g)).toHaveLength(1);
    expect(description.match(/"spec.common"/g)).toHaveLength(4);
  });

  it('should grow by a fixed amount per kind', async () => {
    const describeKinds = (count: number) =>
      describeModel(
        createModelWithKinds(
          Array.from({ length: count }, (_, i) => ({
            // Equal-length names, so that every kind renders the same size
            kind: `Custom${String(i).padStart(3, '0')}`,
            versions: [
              { apiVersion: 'example.com/v1' },
              { apiVersion: 'example.com/v2' },
              { apiVersion: 'example.com/v3' },
            ],
          })),
          () => ['name', 'owner', 'lifecycle'],
        ),
      );

    const [small, medium, large] = await Promise.all(
      [10, 30, 50].map(describeKinds),
    );

    // Identical versions are grouped, so every kind renders exactly one field
    // block no matter how many versions it has
    expect(small.match(/#### Fields/g)).toHaveLength(10);
    expect(large.match(/#### Fields/g)).toHaveLength(50);

    // Every additional kind adds the same amount of text
    const perKind = (medium.length - small.length) / 20;
    expect(perKind).toBeGreaterThan(0);
    expect(large.length - medium.length).toBe(perKind * 20);
  });
});
