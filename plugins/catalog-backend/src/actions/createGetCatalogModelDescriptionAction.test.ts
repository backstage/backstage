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
        type: 'object',
        required: ['apiVersion', 'kind', 'metadata', 'spec'],
        properties: {
          apiVersion: { const: apiVersion },
          kind: { const: 'Widget' },
          metadata: { type: 'object' },
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

// Extracts and parses the fenced json blocks of a description
function jsonBlocks(description: string): any[] {
  return [...description.matchAll(/```json\n([\s\S]*?)\n```/g)].map(m =>
    JSON.parse(m[1]),
  );
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

  it('should include the JSON schema and relation fields of each kind', async () => {
    const description = await describeModel(model);

    // v1alpha1 and v1beta1 share a schema and are grouped, the spec type is separate
    expect(description.match(/#### JSON Schema/g)).toHaveLength(2);
    expect(description).toContain(
      '#### JSON Schema (backstage.io/v1alpha1, backstage.io/v1beta1)',
    );
    expect(description).toContain(
      '#### JSON Schema (backstage.io/v1alpha1; spec.type: "service")',
    );

    const [schema] = jsonBlocks(description);
    expect(schema.properties.spec.properties.owner).toEqual({
      type: 'string',
      description: 'The owner of the component.',
    });
    expect(schema.properties.spec.properties.lifecycle.enum).toEqual([
      'production',
      'experimental',
    ]);
    expect(schema.properties.spec.required).toEqual(['owner', 'lifecycle']);

    // Base fields are described separately and not repeated for every kind
    expect(schema.properties).not.toHaveProperty('apiVersion');
    expect(schema.properties).not.toHaveProperty('kind');
    expect(schema.properties).not.toHaveProperty('metadata');

    // Relations are not part of the schema, so they are listed next to it
    expect(description).toContain(
      '* "spec.owner": relation "ownedBy" [default kind: Group; allowed kinds: Group, User]',
    );
  });

  it('should include the merged schemas of the default model', async () => {
    const description = await describeModel();

    const component = jsonBlocks(
      description.slice(description.indexOf('### Entity Kind "Component"')),
    )[0];
    expect(component.properties.spec.properties.owner).toMatchObject({
      type: 'string',
      description: 'An entity reference to the owner of the component.',
    });
    expect(component.properties.spec.required).toEqual(
      expect.arrayContaining(['owner', 'lifecycle']),
    );
    expect(component.properties).not.toHaveProperty('metadata');
    expect(description).toContain(
      '* "spec.owner": relation "ownedBy" [default kind: Group; allowed kinds: Group, User]',
    );
    expect(description).toContain(
      '* "spec.dependencyOf": relation "dependencyOf"',
    );
  });

  it('should only group versions with identical schemas', async () => {
    const description = await describeModel(
      createModelWithSpecSchema(
        [
          { apiVersion: 'example.com/v1' },
          { apiVersion: 'example.com/v2' },
          { apiVersion: 'example.com/v3' },
          { apiVersion: 'example.com/v1', specType: 'a' },
          { apiVersion: 'example.com/v2', specType: 'a' },
        ],
        ({ apiVersion, specType }) => ({
          type: 'object',
          properties: {
            mode: {
              type: 'string',
              enum:
                apiVersion === 'example.com/v3' ? ['fast', 'slow'] : ['fast'],
            },
            ...(specType ? { [`extra_${specType}`]: { type: 'string' } } : {}),
          },
        }),
      ),
    );

    expect(description).toContain(
      '#### JSON Schema (example.com/v1, example.com/v2)',
    );
    expect(description).toContain('#### JSON Schema (example.com/v3)');
    expect(description).toContain(
      '#### JSON Schema (example.com/v1, example.com/v2; spec.type: "a")',
    );
    expect(description.match(/#### JSON Schema/g)).toHaveLength(3);

    const [v12, v3, typed] = jsonBlocks(description);
    expect(v12.properties.spec.properties.mode.enum).toEqual(['fast']);
    expect(v3.properties.spec.properties.mode.enum).toEqual(['fast', 'slow']);
    expect(typed.properties.spec.properties.extra_a).toEqual({
      type: 'string',
    });
  });

  it('should keep every property of nested schemas without summarizing', async () => {
    const spec = {
      type: 'object',
      properties: {
        deep: {
          type: 'object',
          properties: {
            a: {
              type: 'object',
              properties: {
                b: {
                  type: 'object',
                  properties: { c: { type: 'string', minLength: 1 } },
                },
              },
            },
          },
        },
        choice: { anyOf: [{ type: 'string' }, { type: 'number' }] },
      },
    };
    const description = await describeModel(
      createModelWithSpecSchema([{ apiVersion: 'example.com/v1' }], () => spec),
    );

    expect(jsonBlocks(description)[0].properties.spec).toEqual(spec);
  });
});
