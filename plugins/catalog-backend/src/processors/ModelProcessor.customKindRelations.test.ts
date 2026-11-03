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
import {
  aiResourceEntityModel,
  compileCatalogModel,
  createCatalogModelLayer,
  defaultCatalogEntityModel,
} from '@backstage/catalog-model/alpha';
import { ModelHolder } from '../model/ModelHolder';
import { BuiltinKindsEntityProcessor } from './BuiltinKindsEntityProcessor';
import { ModelProcessor } from './ModelProcessor';

const relationFixtures = [
  {
    kind: 'Component',
    field: 'dependsOn',
    forward: 'dependsOn',
    reverse: 'dependencyOf',
  },
  {
    kind: 'Component',
    field: 'dependencyOf',
    forward: 'dependencyOf',
    reverse: 'dependsOn',
  },
  {
    kind: 'Resource',
    field: 'dependsOn',
    forward: 'dependsOn',
    reverse: 'dependencyOf',
  },
  {
    kind: 'Resource',
    field: 'dependencyOf',
    forward: 'dependencyOf',
    reverse: 'dependsOn',
  },
] as const;

const customRelationsLayer = createCatalogModelLayer({
  layerId: 'test/custom-kind-relations',
  builder: model => {
    for (const [forward, reverse] of [
      ['dependsOn', 'dependencyOf'],
      ['dependencyOf', 'dependsOn'],
    ]) {
      model.addRelationPair({
        fromKind: ['Component', 'Resource'],
        toKind: 'Technology',
        description: 'A relation between catalog entities and a technology.',
        forward: { type: forward, title: forward },
        reverse: { type: reverse, title: reverse },
      });
    }
  },
});

function createProcessor(includeCustomRelations: boolean): ModelProcessor {
  return new ModelProcessor(
    ModelHolder.modelPassthroughForTest(
      compileCatalogModel([
        aiResourceEntityModel,
        defaultCatalogEntityModel,
        ...(includeCustomRelations ? [customRelationsLayer] : []),
      ]),
    ),
  );
}

async function processRelations(
  processor: ModelProcessor | BuiltinKindsEntityProcessor,
  entity: Entity,
) {
  const emit = jest.fn();
  await processor.postProcessEntity(
    entity,
    { type: 'url', target: 'https://example.com/catalog-info.yaml' },
    emit,
  );
  return emit.mock.calls.map(([result]) => result.relation);
}

function createEntity(
  kind: string,
  field: string,
  target = 'technology:custom',
): Entity {
  return {
    apiVersion: 'backstage.io/v1alpha1',
    kind,
    metadata: { name: 'source' },
    spec: { [field]: [target] },
  };
}

describe('ModelProcessor custom-kind relations', () => {
  it.each(relationFixtures)(
    'emits only the declared forward relation for $kind spec.$field when no custom relation pair exists',
    async ({ kind, field, forward }) => {
      const relations = await processRelations(
        createProcessor(false),
        createEntity(kind, field),
      );

      expect(relations).toEqual([
        {
          source: { kind, namespace: 'default', name: 'source' },
          type: forward,
          target: { kind: 'technology', namespace: 'default', name: 'custom' },
        },
      ]);
    },
  );

  it.each(relationFixtures)(
    'emits the declared forward and reverse relations for $kind spec.$field with an unrelated model source',
    async ({ kind, field, forward, reverse }) => {
      const relations = await processRelations(
        createProcessor(true),
        createEntity(kind, field),
      );
      const source = { kind, namespace: 'default', name: 'source' };
      const target = {
        kind: 'technology',
        namespace: 'default',
        name: 'custom',
      };

      expect(relations).toEqual([
        { source, type: forward, target },
        { source: target, type: reverse, target: source },
      ]);
    },
  );

  it.each(relationFixtures)(
    'preserves legacy custom-kind relations without a model source for $kind spec.$field',
    async ({ kind, field, forward, reverse }) => {
      const relations = await processRelations(
        new BuiltinKindsEntityProcessor(),
        createEntity(kind, field),
      );
      const source = { kind, namespace: 'default', name: 'source' };
      const target = {
        kind: 'technology',
        namespace: 'default',
        name: 'custom',
      };

      expect(relations).toEqual([
        { source, type: forward, target },
        { source: target, type: reverse, target: source },
      ]);
    },
  );

  it.each([
    { kind: 'Component', target: 'resource:database' },
    { kind: 'Resource', target: 'component:service' },
  ])(
    'preserves built-in relations from $kind with an unrelated model source',
    async ({ kind, target }) => {
      const relations = await processRelations(
        createProcessor(false),
        createEntity(kind, 'dependsOn', target),
      );
      const source = { kind, namespace: 'default', name: 'source' };
      const [targetKind, targetName] = target.split(':');
      const targetRef = {
        kind: targetKind,
        namespace: 'default',
        name: targetName,
      };

      expect(relations).toEqual([
        { source, type: 'dependsOn', target: targetRef },
        { source: targetRef, type: 'dependencyOf', target: source },
      ]);
    },
  );

  it('emits each edge once when both dependency fields reference the same kind', async () => {
    const relations = await processRelations(createProcessor(true), {
      ...createEntity('Component', 'dependsOn'),
      spec: {
        dependsOn: ['technology:custom'],
        dependencyOf: ['technology:custom'],
      },
    });

    expect(relations).toHaveLength(4);
    expect(
      new Set(relations.map(relation => JSON.stringify(relation))).size,
    ).toBe(relations.length);
  });

  it('does not allow a relation pair to bypass allowedKinds', async () => {
    const ownerRelationLayer = createCatalogModelLayer({
      layerId: 'test/custom-kind-owner-relation',
      builder: model => {
        model.addRelationPair({
          fromKind: 'Component',
          toKind: 'Technology',
          description: 'Ownership of a technology.',
          forward: { type: 'ownedBy', title: 'owned by' },
          reverse: { type: 'ownerOf', title: 'owner of' },
        });
      },
    });
    const processor = new ModelProcessor(
      ModelHolder.modelPassthroughForTest(
        compileCatalogModel([
          aiResourceEntityModel,
          defaultCatalogEntityModel,
          ownerRelationLayer,
        ]),
      ),
    );
    const relations = await processRelations(processor, {
      ...createEntity('Component', 'owner'),
      spec: { owner: 'technology:custom' },
    });

    expect(relations).toEqual([]);
  });
});
