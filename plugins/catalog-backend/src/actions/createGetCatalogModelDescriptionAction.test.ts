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
import { JsonObject } from '@backstage/types';
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
        title: 'Orphan',
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
          jsonSchema: {
            allOf: [
              {
                $ref: 'Entity',
                properties: { hiddenFromBase: { type: 'string' } },
              },
              {
                properties: {
                  apiVersion: { type: 'string' },
                  kind: { type: 'string' },
                  metadata: {
                    type: 'object',
                    properties: { name: { type: 'string' } },
                  },
                  spec: {
                    type: 'object',
                    required: ['owner'],
                    allOf: [{ required: ['lifecycle'] }],
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
            ],
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

async function describeModel(
  testModel: CatalogModel,
  query?: JsonObject,
): Promise<string> {
  const mockActionsRegistry = actionsRegistryServiceMock();
  createGetCatalogModelDescriptionAction({
    modelHolder: ModelHolder.modelPassthroughForTest(testModel),
    actionsRegistry: mockActionsRegistry,
  });
  const result = await mockActionsRegistry.invoke({
    id: 'test:get-catalog-model-description',
    input: query ? { query } : {},
  });
  return (result as any).output.description as string;
}

describe('createGetCatalogModelDescriptionAction', () => {
  it('should return a markdown description of the catalog model', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();

    createGetCatalogModelDescriptionAction({
      modelHolder: ModelHolder.modelPassthroughForTest(model),
      actionsRegistry: mockActionsRegistry,
    });

    const result = await mockActionsRegistry.invoke({
      id: 'test:get-catalog-model-description',
      input: {},
    });

    const description = (result as any).output.description as string;

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
    const mockActionsRegistry = actionsRegistryServiceMock();

    createGetCatalogModelDescriptionAction({
      modelHolder: undefined,
      actionsRegistry: mockActionsRegistry,
    });

    const result = await mockActionsRegistry.invoke({
      id: 'test:get-catalog-model-description',
      input: {},
    });

    const description = (result as any).output.description as string;

    expect(description).toContain('# Catalog Model');
    expect(description).toContain('## Entity Kinds');
    expect(description).toContain('### Entity Kind "Component"');
    expect(description).toContain('"spec.lifecycle"');
    expect(description).toContain('"spec.owner"');
  });

  it('should describe kind fields and relation fields', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();

    createGetCatalogModelDescriptionAction({
      modelHolder: ModelHolder.modelPassthroughForTest(model),
      actionsRegistry: mockActionsRegistry,
    });

    const result = await mockActionsRegistry.invoke({
      id: 'test:get-catalog-model-description',
      input: {},
    });

    const description = (result as any).output.description as string;

    // Versions with identical fields are grouped
    expect(description.match(/#### Fields/g)).toHaveLength(2);
    expect(description).toContain(
      '#### Fields (backstage.io/v1alpha1, backstage.io/v1beta1)',
    );
    expect(description).toContain(
      '* "spec.owner" (string, required): The owner of the component.',
    );
    expect(description).toContain('* "spec.tags" (array of string)');
    expect(description).toContain('* "spec.ids" (array of string | number)');
    expect(description).toContain(
      '* "spec.links" (reference to "#/definitions/Links")',
    );
    // Required in a different allOf entry than the one declaring the property
    expect(description).toContain(
      '* "spec.lifecycle" (string, required, one of "production", "experimental")',
    );
    expect(description).toContain('* "spec.nested.deep" (number)');
    expect(description).toContain(
      '* "spec.owner" → relation "ownedBy" (default kind: Group; allowed kinds: Group, User)',
    );

    // Base fields are not repeated for every kind
    expect(description).not.toContain('"metadata.name" (');
    expect(description).not.toContain('"apiVersion" (');
    expect(description).not.toContain('hiddenFromBase');
  });

  it('should merge every declaration of a field', async () => {
    const description = await describeModel(
      createModelWithSpecSchema([{ apiVersion: 'example.com/v1' }], () => ({
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
              mode: { enum: ['fast', 'slow'] },
              team: { description: 'The owning team.' },
            },
          },
        ],
        anyOf: [
          { properties: { variant: { type: 'string', enum: ['a'] } } },
          { properties: { variant: { type: 'string', enum: ['b'] } } },
        ],
        properties: {
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

    expect(description).toContain('* "spec.owner" (string, required)');
    expect(description).toContain(
      '* "spec.team" (required, reference to "#/definitions/Team"): The owning team.',
    );
    expect(description).toContain(
      '* "spec.mode" (string, one of "fast", "slow"): The mode.',
    );
    // Alternatives widen the allowed values
    expect(description).toContain('* "spec.variant" (string, one of "a", "b")');
    // Properties of array items are addressed through the array path
    expect(description).toContain('* "spec.endpoints" (array of object)');
    expect(description).toContain('* "spec.endpoints.url" (string, required)');
    expect(description).toContain('* "spec.endpoints.port" (number)');
    expect(description).toContain(
      '* "spec.refs" (array of reference to "#/definitions/Ref")',
    );
    // Every field is described once
    expect(description.match(/"spec.mode"/g)).toHaveLength(1);
    expect(description.match(/"spec.team"/g)).toHaveLength(1);
    expect(description.match(/"spec.variant"/g)).toHaveLength(1);
  });

  it('should not group versions that differ only in a stacked constraint', async () => {
    const description = await describeModel(
      createModelWithSpecSchema(
        [{ apiVersion: 'example.com/v1' }, { apiVersion: 'example.com/v2' }],
        ({ apiVersion }) => ({
          type: 'object',
          allOf: [
            { properties: { mode: { type: 'string' } } },
            {
              properties: {
                mode: {
                  enum:
                    apiVersion === 'example.com/v1'
                      ? ['fast']
                      : ['fast', 'slow'],
                },
              },
            },
          ],
        }),
      ),
    );

    expect(description.match(/#### Fields/g)).toHaveLength(2);
    expect(description).toContain('* "spec.mode" (string, one of "fast")');
    expect(description).toContain(
      '* "spec.mode" (string, one of "fast", "slow")',
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

  it('should grow linearly with the number of kinds', async () => {
    const describeKinds = (count: number) =>
      describeModel(
        createModelWithKinds(
          Array.from({ length: count }, (_, i) => ({
            kind: `Custom${i}`,
            versions: [
              { apiVersion: 'example.com/v1' },
              { apiVersion: 'example.com/v2' },
              { apiVersion: 'example.com/v3' },
            ],
          })),
          () => ['name', 'owner', 'lifecycle'],
        ),
      );

    const small = await describeKinds(10);
    const large = await describeKinds(50);

    // Identical versions are grouped, so every kind renders exactly one field
    // block no matter how many versions it has
    expect(small.match(/#### Fields/g)).toHaveLength(10);
    expect(large.match(/#### Fields/g)).toHaveLength(50);

    // The fixed preamble does not scale with the number of kinds, so with
    // linear growth 5x the kinds must produce strictly less than 5x the text
    expect(large.length).toBeGreaterThan(small.length);
    expect(large.length).toBeLessThan(small.length * 5);
  });

  it('should narrow the described items with a query', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();

    createGetCatalogModelDescriptionAction({
      modelHolder: ModelHolder.modelPassthroughForTest(model),
      actionsRegistry: mockActionsRegistry,
    });

    const describeWith = async (query: JsonObject) => {
      const result = await mockActionsRegistry.invoke({
        id: 'test:get-catalog-model-description',
        input: { query },
      });
      return (result as any).output.description as string;
    };

    const kind = await describeWith({ type: 'kind', name: 'Component' });
    expect(kind).toContain('### Entity Kind "Component"');
    expect(kind).toContain('## Entity Metadata field');
    expect(kind).not.toContain('## Entity Relations');
    expect(kind).not.toContain('### Annotation');

    const either = await describeWith({
      $any: [
        { type: 'kind', name: 'Component' },
        { type: 'relation', fromKind: { $contains: 'Component' } },
      ],
    });
    expect(either).toContain('### Entity Kind "Component"');
    expect(either).toContain('### Relation "ownedBy"');

    const relation = await describeWith({ type: 'relation', name: 'ownedBy' });
    expect(relation).toContain('### Relation "ownedBy"');
    expect(relation).toContain('## Entity Metadata field');
    expect(relation).not.toContain('## Entity Kinds');

    // Querying by kind returns everything about that kind
    const byKind = await describeWith({ kind: 'Component' });
    expect(byKind).toContain('### Entity Kind "Component"');
    expect(byKind).toContain('Singular in text: "component"');
    expect(byKind).toContain('* "spec.owner" (string, required)');
    expect(byKind).toContain('* "spec.lifecycle"');
    expect(byKind).toContain('* "spec.owner" → relation "ownedBy"');

    const annotation = await describeWith({
      type: 'annotation',
      name: { $hasPrefix: 'backstage.io/' },
    });
    expect(annotation).toContain(
      '### Annotation "backstage.io/managed-by-location"',
    );
    expect(annotation).not.toContain('## Entity Kinds');
    expect(annotation).not.toContain('### Tag');

    // Field lookups only render the matching fields, without the metadata list
    const field = await describeWith({
      type: 'field',
      kind: 'Component',
      path: 'spec.owner',
    });
    expect(field).toContain('### Entity Kind "Component"');
    expect(field).toContain('* "spec.owner" (string, required)');
    expect(field).toContain('* "spec.owner" → relation "ownedBy"');
    expect(field).not.toContain('spec.lifecycle');
    expect(field).not.toContain('Singular in text');
    expect(field).not.toContain('## Entity Metadata field');

    const relationFields = await describeWith({
      type: 'field',
      relation: { $exists: true },
    });
    expect(relationFields).toContain('→ relation "ownedBy"');
    expect(relationFields).not.toContain('spec.lifecycle');

    // The metadata list is kept when metadata items match too
    const fieldAndTag = await describeWith({
      $any: [
        { type: 'field', path: 'spec.owner' },
        { type: 'tag', name: 'java' },
      ],
    });
    expect(fieldAndTag).toContain('## Entity Metadata field');
    expect(fieldAndTag).toContain('### Tag "java"');

    const none = await describeWith({ type: 'kind', name: 'Nope' });
    expect(none).toContain('No items in the catalog model matched');
    expect(none).toContain('## Entity Metadata field');
    expect(none).not.toContain('## Entity Kinds');
  });

  it('should match a field by any of the relations it generates', async () => {
    const description = (query: JsonObject) =>
      describeModel(
        {
          ...model,
          getKind: input => {
            const kind = model.getKind(input);
            return (
              kind && {
                ...kind,
                relationFields: [
                  ...kind.relationFields,
                  { path: 'spec.owner', relation: 'managedBy' },
                ],
              }
            );
          },
        },
        query,
      );

    for (const relation of ['ownedBy', 'managedBy']) {
      const result = await description({ type: 'field', relation });
      expect(result).toContain('* "spec.owner" (string, required)');
      expect(result).toContain('* "spec.owner" → relation "ownedBy"');
      expect(result).toContain('* "spec.owner" → relation "managedBy"');
      expect(result).not.toContain('spec.lifecycle');
    }
    await expect(
      description({ type: 'field', relation: 'partOf' }),
    ).resolves.toContain('No items in the catalog model matched');
  });

  it('should include the metadata list unless only fields match', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    createGetCatalogModelDescriptionAction({
      modelHolder: ModelHolder.modelPassthroughForTest(
        createModelWithKinds(
          [
            { kind: 'Component', versions: [{ apiVersion: 'v1' }] },
            { kind: 'Resource', versions: [{ apiVersion: 'v1' }] },
          ],
          () => ['owner', 'lifecycle'],
        ),
      ),
      actionsRegistry: mockActionsRegistry,
    });
    const describeWith = async (query: JsonObject) => {
      const result = await mockActionsRegistry.invoke({
        id: 'test:get-catalog-model-description',
        input: { query },
      });
      return (result as any).output.description as string;
    };

    // A kind match keeps the metadata list, even when fields of other kinds
    // match too
    const kindAndField = await describeWith({
      $any: [
        { type: 'kind', name: 'Component' },
        { type: 'field', kind: 'Resource', path: 'spec.owner' },
      ],
    });
    expect(kindAndField).toContain('## Entity Metadata field');
    expect(kindAndField).toContain('Singular in text: "component"');
    expect(kindAndField).toContain('### Entity Kind "Resource"');
    expect(kindAndField).not.toContain('Singular in text: "resource"');
    expect(kindAndField.match(/"spec\.lifecycle"/g)).toHaveLength(1);

    const fieldOnly = await describeWith({
      type: 'field',
      kind: 'Resource',
      path: 'spec.owner',
    });
    expect(fieldOnly).not.toContain('## Entity Metadata field');
    expect(fieldOnly).toContain('* "spec.owner" (string)');
  });

  it('should be able to query every documented key', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    createGetCatalogModelDescriptionAction({
      modelHolder: ModelHolder.modelPassthroughForTest(model),
      actionsRegistry: mockActionsRegistry,
    });

    const { actions } = await mockActionsRegistry.list();
    const inputSchema = actions[0].schema.input as any;
    const queryDescription = inputSchema.properties.query.description as string;

    // Parses lines like `- kind: { type: "kind", name: kind name, ... }`
    const documented = queryDescription
      .split('\n')
      .map(line => line.match(/^- [^{]+: \{ (.*) \}$/))
      .filter((match): match is RegExpMatchArray => Boolean(match))
      .map(match => {
        const parts = match[1].split(', ');
        const keys = parts.map(part => part.split(':')[0]);
        // The first part documents the type, e.g. `type: "annotation" | "label"`
        const types = [...parts[0].matchAll(/"(\w+)"/g)].map(m => m[1]);
        return { types, keys };
      });
    expect(documented.flatMap(d => d.types).sort()).toEqual([
      'annotation',
      'field',
      'kind',
      'label',
      'relation',
      'tag',
    ]);

    const describeWith = async (query: JsonObject) => {
      const result = await mockActionsRegistry.invoke({
        id: 'test:get-catalog-model-description',
        input: { query },
      });
      return (result as any).output.description as string;
    };
    const noMatch = 'No items in the catalog model matched';

    for (const { types, keys } of documented) {
      for (const type of types) {
        for (const key of keys) {
          await expect(
            describeWith({ type, [key]: { $exists: true } }),
          ).resolves.not.toContain(noMatch);
        }
        await expect(
          describeWith({ type, undocumented: { $exists: true } }),
        ).resolves.toContain(noMatch);
      }
    }
  });
});
