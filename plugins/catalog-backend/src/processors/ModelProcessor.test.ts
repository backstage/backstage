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
} from '@backstage/catalog-model/alpha';
import { ModelProcessor } from './ModelProcessor';
import { ModelHolder } from '../model/ModelHolder';

const componentKind: CatalogModelKind = {
  description: 'A software component',
  apiVersions: ['backstage.io/v1alpha1'],
  names: { kind: 'Component', singular: 'component', plural: 'components' },
  relationFields: [
    {
      path: 'spec.owner',
      relation: 'ownedBy',
      defaultKind: 'Group',
      defaultNamespace: 'inherit',
      allowedKinds: ['Group', 'User'],
    },
    {
      path: 'spec.dependsOn',
      relation: 'dependsOn',
      defaultKind: 'Component',
      defaultNamespace: 'default',
      allowedKinds: ['Component', 'Resource'],
    },
  ],
  jsonSchema: {
    type: 'object',
    required: ['spec'],
    properties: {
      spec: {
        type: 'object',
        required: ['type', 'lifecycle', 'owner'],
        properties: {
          type: { type: 'string', minLength: 1 },
          lifecycle: { type: 'string', minLength: 1 },
          owner: { type: 'string', minLength: 1 },
        },
      },
    },
  },
};

const ownedByRelation: CatalogModelRelation = {
  fromKind: ['Component'],
  toKind: ['Group', 'User'],
  description: 'Ownership',
  forward: { type: 'ownedBy', title: 'owned by' },
  reverse: { type: 'ownerOf', title: 'owner of' },
};

const dependsOnRelation: CatalogModelRelation = {
  fromKind: ['Component'],
  toKind: ['Component', 'Resource'],
  description: 'Dependency',
  forward: { type: 'dependsOn', title: 'depends on' },
  reverse: { type: 'dependencyOf', title: 'dependency of' },
};

function createModel(overrides?: {
  getKind?: CatalogModel['getKind'];
  getRelations?: CatalogModel['getRelations'];
}): ModelHolder {
  return ModelHolder.modelPassthroughForTest({
    listKinds: () => [
      {
        description: componentKind.description,
        names: componentKind.names,
        versions: componentKind.apiVersions.map(apiVersion => ({ apiVersion })),
      },
    ],
    listRelations: () => [ownedByRelation, dependsOnRelation],
    getMetadata: () => ({ annotations: [], labels: [], tags: [] }),
    getKind: overrides?.getKind ?? (() => componentKind),
    getRelations:
      overrides?.getRelations ?? (() => [ownedByRelation, dependsOnRelation]),
  });
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

    it('sorts array relation fields in-place', async () => {
      const processor = new ModelProcessor(createModel());
      const entity = createEntity({
        type: 'service',
        lifecycle: 'production',
        owner: 'group:default/my-team',
        dependsOn: ['component:c', 'component:a', 'component:b'],
      });

      const result = await processor.preProcessEntity(entity);

      expect((result.spec as any).dependsOn).toEqual([
        'component:a',
        'component:b',
        'component:c',
      ]);
    });

    it('does not modify scalar relation fields', async () => {
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
  });

  describe('validateEntityKind', () => {
    it('returns false when the kind is not found', async () => {
      const processor = new ModelProcessor(
        createModel({ getKind: () => undefined }),
      );
      const entity = createEntity();

      expect(await processor.validateEntityKind(entity)).toBe(false);
    });

    it('returns true when the entity is valid', async () => {
      const processor = new ModelProcessor(createModel());
      const entity = createEntity();

      expect(await processor.validateEntityKind(entity)).toBe(true);
    });

    it('throws when the entity fails schema validation', async () => {
      const processor = new ModelProcessor(createModel());
      const entity = createEntity({
        type: 'service',
        lifecycle: 'production',
        // missing required "owner"
      });

      await expect(processor.validateEntityKind(entity)).rejects.toThrow(
        /Validation of Component entity failed/,
      );
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

    it('emits only forward relations when relation declarations are not found', async () => {
      const processor = new ModelProcessor(
        createModel({ getRelations: () => undefined }),
      );
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
          relation: expect.objectContaining({ type: 'ownedBy' }),
        }),
      );
      const reverseEmits = emit.mock.calls.filter(
        ([r]: [any]) => r.type === 'relation' && r.relation.type === 'ownerOf',
      );
      expect(reverseEmits).toHaveLength(0);
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

    it('skips both forward and reverse when target kind is not in allowedKinds', async () => {
      const processor = new ModelProcessor(createModel());
      const emit = jest.fn();
      const entity = createEntity({
        type: 'service',
        lifecycle: 'production',
        owner: 'api:default/some-api',
      });

      await processor.postProcessEntity(entity, location, emit);

      const ownedByEmits = emit.mock.calls.filter(
        ([r]: [any]) => r.type === 'relation' && r.relation.type === 'ownedBy',
      );
      expect(ownedByEmits).toHaveLength(0);
      const ownerOfEmits = emit.mock.calls.filter(
        ([r]: [any]) => r.type === 'relation' && r.relation.type === 'ownerOf',
      );
      expect(ownerOfEmits).toHaveLength(0);
    });

    it('allows any target kind when allowedKinds is not set', async () => {
      const noAllowedKindsKind: CatalogModelKind = {
        ...componentKind,
        relationFields: [
          {
            path: 'spec.owner',
            relation: 'ownedBy',
            defaultKind: 'Group',
            defaultNamespace: 'inherit',
          },
        ],
      };
      const processor = new ModelProcessor(
        createModel({ getKind: () => noAllowedKindsKind }),
      );
      const emit = jest.fn();
      const entity = createEntity({
        type: 'service',
        lifecycle: 'production',
        owner: 'api:default/some-api',
      });

      await processor.postProcessEntity(entity, location, emit);

      expect(emit).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'relation',
          relation: expect.objectContaining({ type: 'ownedBy' }),
        }),
      );
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

    it('handles nested relation fields via dot paths', async () => {
      const nestedKind: CatalogModelKind = {
        ...componentKind,
        relationFields: [
          {
            path: 'spec.nested.maintainer',
            relation: 'ownedBy',
            defaultKind: 'User',
            defaultNamespace: 'default',
          },
        ],
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
