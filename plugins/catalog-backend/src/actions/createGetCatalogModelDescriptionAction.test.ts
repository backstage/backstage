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
  getKind: () => undefined,
  getRelations: () => undefined,
};

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
  });
});
