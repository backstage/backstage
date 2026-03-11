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
  CatalogModel,
  CatalogModelKind,
  CatalogModelRelation,
  CatalogModelSchemaObjectType,
} from '@backstage/catalog-model/alpha';
import { CatalogProcessorResult } from '@backstage/plugin-catalog-node';
import { ModelProcessor } from './ModelProcessor';

const ownerRelationSchema = {
  type: 'relation',
  relation: 'ownedBy',
  defaultKind: 'Group',
  defaultNamespace: 'inherit',
} as const;

const dependsOnRelationSchema = {
  type: 'relation',
  relation: 'dependsOn',
  defaultKind: 'Component',
  defaultNamespace: 'default',
} as const;

const componentSpec = {
  type: 'object',
  properties: {
    type: { type: 'string' },
    lifecycle: { type: 'string' },
    owner: ownerRelationSchema,
    dependsOn: {
      type: 'array',
      items: dependsOnRelationSchema,
    },
  },
} as const satisfies CatalogModelSchemaObjectType;

const componentKind = {
  apiVersions: ['backstage.io/v1alpha1'],
  names: { kind: 'Component', singular: 'component', plural: 'components' },
  spec: componentSpec,
  jsonSchema: {},
  TInput: null as any,
  TOutput: null as any,
} as const satisfies CatalogModelKind;

const ownedByRelation = {
  fromKind: ['Component'],
  toKind: ['Group', 'User'],
  comment: 'Ownership',
  forward: { type: 'ownedBy', singular: 'owner', plural: 'owners' },
  reverse: { type: 'ownerOf', singular: 'owns', plural: 'owns' },
} as const satisfies CatalogModelRelation;

const dependsOnRelation = {
  fromKind: ['Component'],
  toKind: ['Component', 'Resource'],
  comment: 'Dependency',
  forward: {
    type: 'dependsOn',
    singular: 'dependency',
    plural: 'dependencies',
  },
  reverse: {
    type: 'dependencyOf',
    singular: 'dependant',
    plural: 'dependants',
  },
} as const satisfies CatalogModelRelation;

function createModel(overrides?: {
  getKind?: CatalogModel['getKind'];
  getRelations?: CatalogModel['getRelations'];
}): CatalogModel {
  return {
    getKind: overrides?.getKind ?? (() => componentKind),
    getRelations:
      overrides?.getRelations ?? (() => [ownedByRelation, dependsOnRelation]),
  };
}

function createEntity(spec?: Entity['spec']): Entity {
  return {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Component',
    metadata: { name: 'my-component', namespace: 'default' },
    spec: spec ?? {
      type: 'service',
      lifecycle: 'production',
      owner: 'group:default/my-team',
    },
  };
}

const location = { type: 'url', target: 'https://example.com' };

describe('ModelProcessor', () => {
  describe('preProcessEntity', () => {
    it('returns the entity unchanged when the kind is not found', async () => {
      const processor = new ModelProcessor(
        createModel({ getKind: () => undefined }),
      );
      const entity = createEntity();
      const result = await processor.preProcessEntity(entity);
      expect(result).toBe(entity);
    });

    it('returns the entity unchanged when relations are not found', async () => {
      const processor = new ModelProcessor(
        createModel({ getRelations: () => undefined }),
      );
      const entity = createEntity();
      const result = await processor.preProcessEntity(entity);
      expect(result).toBe(entity);
    });

    it('does not modify array relation fields during pre-processing', async () => {
      const processor = new ModelProcessor(createModel());
      const entity = createEntity({
        type: 'service',
        lifecycle: 'production',
        owner: 'group:default/my-team',
        dependsOn: ['component:c', 'component:a', 'component:b'],
      });

      const result = await processor.preProcessEntity(entity);

      // Individual string values are collected, not the array, so no sorting occurs
      expect((result.spec as any).dependsOn).toEqual([
        'component:c',
        'component:a',
        'component:b',
      ]);
    });

    it('does not sort scalar relation fields', async () => {
      const processor = new ModelProcessor(createModel());
      const entity = createEntity({
        type: 'service',
        lifecycle: 'production',
        owner: 'group:default/my-team',
      });

      const result = await processor.preProcessEntity(entity);

      expect((result.spec as any).owner).toBe('group:default/my-team');
    });

    it('handles entities with no spec gracefully', async () => {
      const processor = new ModelProcessor(createModel());
      const entity = createEntity();
      delete (entity as any).spec;

      const result = await processor.preProcessEntity(entity);

      expect(result).toBe(entity);
    });

    it('handles entities with fields not in the schema gracefully', async () => {
      const processor = new ModelProcessor(createModel());
      const entity = createEntity({
        type: 'service',
        lifecycle: 'production',
        owner: 'group:default/my-team',
        unknownField: 'some-value',
      });

      const result = await processor.preProcessEntity(entity);

      expect((result.spec as any).unknownField).toBe('some-value');
    });
  });

  describe('postProcessEntity', () => {
    it('returns the entity unchanged when the kind is not found', async () => {
      const processor = new ModelProcessor(
        createModel({ getKind: () => undefined }),
      );
      const emit = jest.fn();
      const entity = createEntity();

      const result = await processor.postProcessEntity(entity, location, emit);

      expect(result).toBe(entity);
      expect(emit).not.toHaveBeenCalled();
    });

    it('returns the entity unchanged when relations are not found', async () => {
      const processor = new ModelProcessor(
        createModel({ getRelations: () => undefined }),
      );
      const emit = jest.fn();
      const entity = createEntity();

      const result = await processor.postProcessEntity(entity, location, emit);

      expect(result).toBe(entity);
      expect(emit).not.toHaveBeenCalled();
    });

    it('emits forward and reverse relations for a scalar relation field', async () => {
      const processor = new ModelProcessor(createModel());
      const emit = jest.fn();
      const entity = createEntity({
        type: 'service',
        lifecycle: 'production',
        owner: 'my-team',
      });

      await processor.postProcessEntity(entity, location, emit);

      expect(emit).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'relation',
          relation: {
            source: {
              kind: 'Component',
              namespace: 'default',
              name: 'my-component',
            },
            type: 'ownedBy',
            target: { kind: 'Group', namespace: 'default', name: 'my-team' },
          },
        }),
      );
      expect(emit).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'relation',
          relation: {
            source: { kind: 'Group', namespace: 'default', name: 'my-team' },
            type: 'ownerOf',
            target: {
              kind: 'Component',
              namespace: 'default',
              name: 'my-component',
            },
          },
        }),
      );
    });

    it('emits forward and reverse relations for each element in an array relation field', async () => {
      const processor = new ModelProcessor(createModel());
      const emit = jest.fn();
      const entity = createEntity({
        type: 'service',
        lifecycle: 'production',
        owner: 'my-team',
        dependsOn: [
          'component:default/service-a',
          'component:default/service-b',
        ],
      });

      await processor.postProcessEntity(entity, location, emit);

      // Forward dependsOn for service-a
      expect(emit).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'relation',
          relation: {
            source: {
              kind: 'Component',
              namespace: 'default',
              name: 'my-component',
            },
            type: 'dependsOn',
            target: {
              kind: 'component',
              namespace: 'default',
              name: 'service-a',
            },
          },
        }),
      );
      // Reverse dependencyOf for service-a
      expect(emit).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'relation',
          relation: {
            source: {
              kind: 'component',
              namespace: 'default',
              name: 'service-a',
            },
            type: 'dependencyOf',
            target: {
              kind: 'Component',
              namespace: 'default',
              name: 'my-component',
            },
          },
        }),
      );
      // Forward dependsOn for service-b
      expect(emit).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'relation',
          relation: {
            source: {
              kind: 'Component',
              namespace: 'default',
              name: 'my-component',
            },
            type: 'dependsOn',
            target: {
              kind: 'component',
              namespace: 'default',
              name: 'service-b',
            },
          },
        }),
      );
    });

    it('does not emit reverse relation when target kind does not match', async () => {
      const processor = new ModelProcessor(createModel());
      const emit = jest.fn();
      const entity = createEntity({
        type: 'service',
        lifecycle: 'production',
        owner: 'api:default/some-api',
      });

      await processor.postProcessEntity(entity, location, emit);

      // Forward relation is still emitted
      expect(emit).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'relation',
          relation: expect.objectContaining({ type: 'ownedBy' }),
        }),
      );
      // But no reverse since "api" is not in ownedByRelation.toKind
      const reverseEmits = emit.mock.calls.filter(
        ([r]: [CatalogProcessorResult]) =>
          r.type === 'relation' && (r as any).relation.type === 'ownerOf',
      );
      expect(reverseEmits).toHaveLength(0);
    });

    it('uses defaultNamespace inherit to pick the entity namespace', async () => {
      const processor = new ModelProcessor(createModel());
      const emit = jest.fn();
      const entity = createEntity({
        type: 'service',
        lifecycle: 'production',
        owner: 'my-team',
      });
      entity.metadata.namespace = 'custom-ns';

      await processor.postProcessEntity(entity, location, emit);

      expect(emit).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'relation',
          relation: expect.objectContaining({
            type: 'ownedBy',
            target: { kind: 'Group', namespace: 'custom-ns', name: 'my-team' },
          }),
        }),
      );
    });

    it('uses default namespace when defaultNamespace is not inherit', async () => {
      const processor = new ModelProcessor(createModel());
      const emit = jest.fn();
      const entity = createEntity({
        type: 'service',
        lifecycle: 'production',
        owner: 'my-team',
        dependsOn: ['service-a'],
      });
      entity.metadata.namespace = 'custom-ns';

      await processor.postProcessEntity(entity, location, emit);

      expect(emit).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'relation',
          relation: expect.objectContaining({
            type: 'dependsOn',
            target: {
              kind: 'Component',
              namespace: 'default',
              name: 'service-a',
            },
          }),
        }),
      );
    });

    it('handles entities with no spec gracefully', async () => {
      const processor = new ModelProcessor(createModel());
      const emit = jest.fn();
      const entity = createEntity();
      delete (entity as any).spec;

      await processor.postProcessEntity(entity, location, emit);

      expect(emit).not.toHaveBeenCalled();
    });

    it('handles nested object schemas with relation fields', async () => {
      const nestedSpec: CatalogModelSchemaObjectType = {
        type: 'object',
        properties: {
          nested: {
            type: 'object',
            properties: {
              maintainer: {
                type: 'relation' as const,
                relation: 'ownedBy',
                defaultKind: 'User',
                defaultNamespace: 'default' as const,
              },
            },
          },
        },
      };
      const nestedKind: CatalogModelKind = {
        ...componentKind,
        spec: nestedSpec,
      };
      const processor = new ModelProcessor(
        createModel({ getKind: () => nestedKind }),
      );
      const emit = jest.fn();
      const entity = createEntity({
        nested: { maintainer: 'jane' },
      });

      await processor.postProcessEntity(entity, location, emit);

      expect(emit).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'relation',
          relation: expect.objectContaining({
            type: 'ownedBy',
            target: { kind: 'User', namespace: 'default', name: 'jane' },
          }),
        }),
      );
    });
  });
});
