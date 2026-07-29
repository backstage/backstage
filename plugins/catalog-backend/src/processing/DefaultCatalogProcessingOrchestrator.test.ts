/*
 * Copyright 2021 The Backstage Authors
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

import {
  ANNOTATION_LOCATION,
  ANNOTATION_ORIGIN_LOCATION,
  Entity,
  EntityPolicies,
  EntityPolicy,
  LocationEntity,
} from '@backstage/catalog-model';
import { ScmIntegrations } from '@backstage/integration';
import {
  CatalogProcessor,
  CatalogProcessorCache,
  CatalogProcessorEmit,
  CatalogProcessorParser,
  LocationSpec,
  processingResult,
} from '@backstage/plugin-catalog-node';
import { CatalogRulesEnforcer } from '../ingestion/CatalogRules';
import { DefaultCatalogProcessingOrchestrator } from './DefaultCatalogProcessingOrchestrator';
import { defaultEntityDataParser } from '../util/parse';
import { ConfigReader } from '@backstage/config';
import { InputError } from '@backstage/errors';
import { mockServices } from '@backstage/backend-test-utils';

class FooBarProcessor implements CatalogProcessor {
  getProcessorName = () => 'foo-bar';

  async validateEntityKind(entity: Entity) {
    return entity.kind.toLocaleLowerCase('en-US') === 'foobar';
  }

  async postProcessEntity(
    entity: Entity,
    _location: LocationSpec,
    emit: CatalogProcessorEmit,
    cache: CatalogProcessorCache,
  ) {
    if (await cache.get('emit')) {
      emit(
        processingResult.entity(
          { type: 'url', target: './new-place' },
          {
            apiVersion: 'my-api/v1',
            kind: 'FooBar',
            metadata: {
              name: 'my-new-foo-bar',
            },
          },
        ),
      );
      emit(
        processingResult.relation({
          type: 'my-type',
          source: { kind: 'foobar', name: 'my-source', namespace: 'default' },
          target: { kind: 'foobar', name: 'my-target', namespace: 'default' },
        }),
      );
    }
    return entity;
  }
}

describe('DefaultCatalogProcessingOrchestrator', () => {
  describe('basic processing', () => {
    const entity = {
      apiVersion: 'my-api/v1',
      kind: 'FooBar',
      metadata: {
        name: 'my-foo-bar',
        annotations: {
          [ANNOTATION_LOCATION]: 'url:./here',
          [ANNOTATION_ORIGIN_LOCATION]: 'url:./there',
        },
      },
    };

    const orchestrator = new DefaultCatalogProcessingOrchestrator({
      processors: [new FooBarProcessor()],
      integrations: ScmIntegrations.fromConfig(new ConfigReader({})),
      logger: mockServices.logger.mock(),
      parser: defaultEntityDataParser,
      policy: EntityPolicies.allOf([]),
      rulesEnforcer: { isAllowed: () => true },
    });

    it('runs a minimal processing', async () => {
      await expect(orchestrator.process({ entity })).resolves.toEqual({
        ok: true,
        completedEntity: entity,
        deferredEntities: [],
        refreshKeys: [],
        errors: [],
        relations: [],
        state: {
          cache: {},
        },
      });
    });

    it('emits some things', async () => {
      await expect(
        orchestrator.process({
          entity,
          state: { cache: { 'foo-bar': { emit: true } } },
        }),
      ).resolves.toEqual({
        ok: true,
        completedEntity: entity,
        refreshKeys: [],
        deferredEntities: [
          {
            locationKey: 'url:./new-place',
            entity: {
              apiVersion: 'my-api/v1',
              kind: 'FooBar',
              metadata: {
                name: 'my-new-foo-bar',
                annotations: {
                  [ANNOTATION_LOCATION]: 'url:./new-place',
                  [ANNOTATION_ORIGIN_LOCATION]: 'url:./there',
                },
              },
            },
          },
        ],
        errors: [],
        relations: [
          {
            type: 'my-type',
            source: { kind: 'foobar', name: 'my-source', namespace: 'default' },
            target: { kind: 'foobar', name: 'my-target', namespace: 'default' },
          },
        ],
        state: {
          cache: { 'foo-bar': { emit: true } },
        },
      });
    });

    it('accepts any state input', async () => {
      await expect(
        orchestrator.process({ entity, state: null as any }),
      ).resolves.toMatchObject({
        ok: true,
      });
      await expect(
        orchestrator.process({ entity, state: [] as any }),
      ).resolves.toMatchObject({
        ok: true,
      });
      await expect(
        orchestrator.process({ entity, state: Symbol() as any }),
      ).resolves.toMatchObject({
        ok: true,
      });
      await expect(
        orchestrator.process({ entity, state: undefined }),
      ).resolves.toMatchObject({
        ok: true,
      });
      await expect(
        orchestrator.process({ entity, state: 3 as any }),
      ).resolves.toMatchObject({
        ok: true,
      });
      await expect(
        orchestrator.process({ entity, state: '}{' as any }),
      ).resolves.toMatchObject({
        ok: true,
      });
      await expect(
        orchestrator.process({ entity, state: { cache: null } }),
      ).resolves.toMatchObject({
        ok: true,
      });
    });

    it('runs all processor validations', async () => {
      const validate = jest.fn(async () => true);
      const processor1: CatalogProcessor = {
        getProcessorName: () => 'processor1',
        validateEntityKind: validate,
      };
      const processor2: CatalogProcessor = {
        getProcessorName: () => 'processor2',
        validateEntityKind: validate,
      };

      const legacy = new DefaultCatalogProcessingOrchestrator({
        processors: [
          processor1 as CatalogProcessor,
          processor2 as CatalogProcessor,
        ],
        integrations: ScmIntegrations.fromConfig(new ConfigReader({})),
        logger: mockServices.logger.mock(),
        parser: defaultEntityDataParser,
        policy: EntityPolicies.allOf([]),
        rulesEnforcer: { isAllowed: () => true },
      });

      const modern = new DefaultCatalogProcessingOrchestrator({
        processors: [
          processor1 as CatalogProcessor,
          processor2 as CatalogProcessor,
        ],
        integrations: ScmIntegrations.fromConfig(new ConfigReader({})),
        logger: mockServices.logger.mock(),
        parser: defaultEntityDataParser,
        policy: EntityPolicies.allOf([]),
        rulesEnforcer: { isAllowed: () => true },
      });

      await expect(legacy.process({ entity })).resolves.toMatchObject({
        ok: true,
      });
      expect(validate).toHaveBeenCalledTimes(2);

      validate.mockClear();

      await expect(modern.process({ entity })).resolves.toMatchObject({
        ok: true,
      });
      expect(validate).toHaveBeenCalledTimes(2);
    });
  });

  describe('rules', () => {
    const entity: LocationEntity = {
      apiVersion: 'backstage.io/v1beta1',
      kind: 'Location',
      metadata: {
        name: 'l',
        annotations: {
          [ANNOTATION_ORIGIN_LOCATION]: 'url:https://example.com/origin.yaml',
          [ANNOTATION_LOCATION]: 'url:https://example.com/origin.yaml',
        },
      },
      spec: {
        type: 'url',
        target: 'http://example.com/entity.yaml',
      },
    };

    const child: Entity = {
      apiVersion: '1',
      kind: 'Component',
      metadata: {
        name: 'Test2',
        namespace: 'test1',
      },
    };

    it('enforces catalog rules', async () => {
      const integrations = ScmIntegrations.fromConfig(new ConfigReader({}));
      const processor: jest.Mocked<CatalogProcessor> = {
        getProcessorName: jest.fn(),
        validateEntityKind: jest.fn(async () => true),
        readLocation: jest.fn(async (_l, _o, emit) => {
          emit(processingResult.entity({ type: 't', target: 't' }, child));
          return true;
        }),
      };
      const parser: CatalogProcessorParser = jest.fn();
      const rulesEnforcer: jest.Mocked<CatalogRulesEnforcer> = {
        isAllowed: jest.fn(),
      };

      const orchestrator = new DefaultCatalogProcessingOrchestrator({
        processors: [processor],
        integrations,
        logger: mockServices.logger.mock(),
        parser,
        policy: EntityPolicies.allOf([]),
        rulesEnforcer,
      });

      rulesEnforcer.isAllowed.mockReturnValueOnce(true);
      await expect(
        orchestrator.process({ entity, state: {} }),
      ).resolves.toEqual(expect.objectContaining({ ok: true }));

      rulesEnforcer.isAllowed.mockReturnValueOnce(false);
      await expect(
        orchestrator.process({ entity, state: {} }),
      ).resolves.toEqual(expect.objectContaining({ ok: false }));
    });

    it('includes entity ref within error', async () => {
      const integrations = ScmIntegrations.fromConfig(new ConfigReader({}));
      const processor: jest.Mocked<CatalogProcessor> = {
        getProcessorName: jest.fn(),
        validateEntityKind: jest.fn(async () => true),
        readLocation: jest.fn(async (_l, _o, emit) => {
          emit(processingResult.entity({ type: 't', target: 't' }, child));
          return true;
        }),
      };
      const parser: CatalogProcessorParser = jest.fn();
      const rulesEnforcer: jest.Mocked<CatalogRulesEnforcer> = {
        isAllowed: jest.fn(),
      };

      class FailingEntityPolicy implements EntityPolicy {
        async enforce(_entity: Entity): Promise<Entity> {
          // eslint-disable-next-line no-throw-literal
          throw 'boom';
        }
      }
      const orchestrator = new DefaultCatalogProcessingOrchestrator({
        processors: [processor],
        integrations,
        logger: mockServices.logger.mock(),
        parser,
        policy: EntityPolicies.allOf([new FailingEntityPolicy()]),
        rulesEnforcer,
      });

      await expect(
        orchestrator.process({ entity, state: {} }),
      ).resolves.toEqual(
        expect.objectContaining({
          ok: false,
          errors: [
            new InputError(
              'Policy check failed for location:default/l; caused by Error: boom',
            ),
          ],
        }),
      );
    });
  });

  describe('location target partial failure', () => {
    const child1: Entity = {
      apiVersion: '1',
      kind: 'Component',
      metadata: { name: 'child1', namespace: 'default' },
    };

    const child2: Entity = {
      apiVersion: '1',
      kind: 'Component',
      metadata: { name: 'child2', namespace: 'default' },
    };

    function makeLocationEntity(targets: string[]): LocationEntity {
      return {
        apiVersion: 'backstage.io/v1beta1',
        kind: 'Location',
        metadata: {
          name: 'test-location',
          annotations: {
            [ANNOTATION_ORIGIN_LOCATION]: 'url:https://example.com/origin.yaml',
            [ANNOTATION_LOCATION]: 'url:https://example.com/origin.yaml',
          },
        },
        spec: {
          type: 'url',
          targets,
        },
      };
    }

    function createOrchestrator(processor: CatalogProcessor) {
      return new DefaultCatalogProcessingOrchestrator({
        processors: [processor],
        integrations: ScmIntegrations.fromConfig(new ConfigReader({})),
        logger: mockServices.logger.mock(),
        parser: defaultEntityDataParser,
        policy: EntityPolicies.allOf([]),
        rulesEnforcer: { isAllowed: () => true },
      });
    }

    it('returns ok with all deferred entities when all targets succeed', async () => {
      const processor: CatalogProcessor = {
        getProcessorName: () => 'test',
        validateEntityKind: async () => true,
        readLocation: async (location, _optional, emit) => {
          if (location.target === 'https://example.com/a.yaml') {
            emit(
              processingResult.entity(
                { type: 'url', target: location.target },
                child1,
              ),
            );
          } else if (location.target === 'https://example.com/b.yaml') {
            emit(
              processingResult.entity(
                { type: 'url', target: location.target },
                child2,
              ),
            );
          }
          return true;
        },
      };

      const entity = makeLocationEntity([
        'https://example.com/a.yaml',
        'https://example.com/b.yaml',
      ]);
      const result = await createOrchestrator(processor).process({
        entity,
        state: {},
      });

      expect(result.ok).toBe(true);
      expect(result).toMatchObject({
        errors: [],
        deferredEntities: expect.arrayContaining([
          expect.objectContaining({
            entity: expect.objectContaining({
              metadata: expect.objectContaining({ name: 'child1' }),
            }),
          }),
          expect.objectContaining({
            entity: expect.objectContaining({
              metadata: expect.objectContaining({ name: 'child2' }),
            }),
          }),
        ]),
      });
    });

    it('returns ok with successful deferred entities when one target emits an error', async () => {
      const processor: CatalogProcessor = {
        getProcessorName: () => 'test',
        validateEntityKind: async () => true,
        readLocation: async (location, _optional, emit) => {
          if (location.target === 'https://example.com/good.yaml') {
            emit(
              processingResult.entity(
                { type: 'url', target: location.target },
                child1,
              ),
            );
          } else if (location.target === 'https://example.com/bad.yaml') {
            emit(processingResult.notFoundError(location, 'not found'));
          }
          return true;
        },
      };

      const entity = makeLocationEntity([
        'https://example.com/good.yaml',
        'https://example.com/bad.yaml',
      ]);
      const result = await createOrchestrator(processor).process({
        entity,
        state: {},
      });

      expect(result.ok).toBe(true);
      expect(result).toMatchObject({
        errors: [expect.objectContaining({ message: 'not found' })],
        deferredEntities: [
          expect.objectContaining({
            entity: expect.objectContaining({
              metadata: expect.objectContaining({ name: 'child1' }),
            }),
          }),
        ],
      });
    });

    it('returns ok with successful deferred entities when one target processor throws', async () => {
      const processor: CatalogProcessor = {
        getProcessorName: () => 'test',
        validateEntityKind: async () => true,
        readLocation: async (location, _optional, emit) => {
          if (location.target === 'https://example.com/good.yaml') {
            emit(
              processingResult.entity(
                { type: 'url', target: location.target },
                child1,
              ),
            );
            return true;
          }
          throw new Error('connection refused');
        },
      };

      const entity = makeLocationEntity([
        'https://example.com/good.yaml',
        'https://example.com/throwing.yaml',
      ]);
      const result = await createOrchestrator(processor).process({
        entity,
        state: {},
      });

      expect(result.ok).toBe(true);
      expect(result).toMatchObject({
        errors: [
          expect.objectContaining({
            message: expect.stringContaining('connection refused'),
          }),
        ],
        deferredEntities: [
          expect.objectContaining({
            entity: expect.objectContaining({
              metadata: expect.objectContaining({ name: 'child1' }),
            }),
          }),
        ],
      });
    });

    it('returns ok with successful deferred entities when no processor handles one target', async () => {
      const processor: CatalogProcessor = {
        getProcessorName: () => 'test',
        validateEntityKind: async () => true,
        readLocation: async (location, _optional, emit) => {
          if (location.target === 'https://example.com/good.yaml') {
            emit(
              processingResult.entity(
                { type: 'url', target: location.target },
                child1,
              ),
            );
            return true;
          }
          return false;
        },
      };

      const entity = makeLocationEntity([
        'https://example.com/good.yaml',
        'https://example.com/unhandled.yaml',
      ]);
      const result = await createOrchestrator(processor).process({
        entity,
        state: {},
      });

      expect(result.ok).toBe(true);
      expect(result).toMatchObject({
        errors: [
          expect.objectContaining({
            message: expect.stringContaining('No processor was able to handle'),
          }),
        ],
        deferredEntities: [
          expect.objectContaining({
            entity: expect.objectContaining({
              metadata: expect.objectContaining({ name: 'child1' }),
            }),
          }),
        ],
      });
    });

    it('returns not ok when all targets fail', async () => {
      const processor: CatalogProcessor = {
        getProcessorName: () => 'test',
        validateEntityKind: async () => true,
        readLocation: async (location, _optional, emit) => {
          emit(
            processingResult.notFoundError(
              location,
              `not found: ${location.target}`,
            ),
          );
          return true;
        },
      };

      const entity = makeLocationEntity([
        'https://example.com/bad1.yaml',
        'https://example.com/bad2.yaml',
      ]);
      const result = await createOrchestrator(processor).process({
        entity,
        state: {},
      });

      expect(result.ok).toBe(false);
      expect(result.errors).toHaveLength(2);
    });

    it('returns not ok when a single target fails', async () => {
      const processor: CatalogProcessor = {
        getProcessorName: () => 'test',
        validateEntityKind: async () => true,
        readLocation: async () => {
          throw new Error('boom');
        },
      };

      const entity = makeLocationEntity(['https://example.com/only.yaml']);
      const result = await createOrchestrator(processor).process({
        entity,
        state: {},
      });

      expect(result.ok).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].message).toContain('boom');
    });

    it('returns ok with no deferred entities when targets list is empty', async () => {
      const processor: CatalogProcessor = {
        getProcessorName: () => 'test',
        validateEntityKind: async () => true,
      };

      const entity = makeLocationEntity([]);
      const result = await createOrchestrator(processor).process({
        entity,
        state: {},
      });

      expect(result.ok).toBe(true);
      expect(result).toMatchObject({
        errors: [],
        deferredEntities: [],
      });
    });

    it('preserves deferred entities from all successful targets when one in the middle fails', async () => {
      const child3: Entity = {
        apiVersion: '1',
        kind: 'Component',
        metadata: { name: 'child3', namespace: 'default' },
      };

      const processor: CatalogProcessor = {
        getProcessorName: () => 'test',
        validateEntityKind: async () => true,
        readLocation: async (location, _optional, emit) => {
          if (location.target === 'https://example.com/a.yaml') {
            emit(
              processingResult.entity(
                { type: 'url', target: location.target },
                child1,
              ),
            );
            return true;
          } else if (location.target === 'https://example.com/b.yaml') {
            throw new Error('404 not found');
          } else if (location.target === 'https://example.com/c.yaml') {
            emit(
              processingResult.entity(
                { type: 'url', target: location.target },
                child3,
              ),
            );
            return true;
          }
          return false;
        },
      };

      const entity = makeLocationEntity([
        'https://example.com/a.yaml',
        'https://example.com/b.yaml',
        'https://example.com/c.yaml',
      ]);
      const result = await createOrchestrator(processor).process({
        entity,
        state: {},
      });

      expect(result.ok).toBe(true);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].message).toContain('404 not found');
      expect(result).toMatchObject({
        deferredEntities: expect.arrayContaining([
          expect.objectContaining({
            entity: expect.objectContaining({
              metadata: expect.objectContaining({ name: 'child1' }),
            }),
          }),
          expect.objectContaining({
            entity: expect.objectContaining({
              metadata: expect.objectContaining({ name: 'child3' }),
            }),
          }),
        ]),
      });
      // Verify the failed target's entity is not present
      expect(result.deferredEntities).toBeDefined();
      const names = result.deferredEntities!.map(d => d.entity.metadata.name);
      expect(names).not.toContain('child2');
    });

    it('does not affect ok flag for non-Location entities with errors', async () => {
      const nonLocationEntity = {
        apiVersion: 'my-api/v1',
        kind: 'FooBar',
        metadata: {
          name: 'my-foo-bar',
          annotations: {
            [ANNOTATION_LOCATION]: 'url:./here',
            [ANNOTATION_ORIGIN_LOCATION]: 'url:./there',
          },
        },
      };

      const processor: CatalogProcessor = {
        getProcessorName: () => 'test',
        validateEntityKind: async () => true,
        postProcessEntity: async (e, _location, emit) => {
          emit(
            processingResult.generalError(
              { type: 'url', target: 'foo' },
              'some error',
            ),
          );
          return e;
        },
      };

      const orchestrator = new DefaultCatalogProcessingOrchestrator({
        processors: [processor],
        integrations: ScmIntegrations.fromConfig(new ConfigReader({})),
        logger: mockServices.logger.mock(),
        parser: defaultEntityDataParser,
        policy: EntityPolicies.allOf([]),
        rulesEnforcer: { isAllowed: () => true },
      });

      const result = await orchestrator.process({
        entity: nonLocationEntity,
        state: {},
      });

      expect(result.ok).toBe(false);
      expect(result.errors).toHaveLength(1);
    });
  });
});
