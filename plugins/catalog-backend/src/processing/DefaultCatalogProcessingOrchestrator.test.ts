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

import { getVoidLogger } from '@backstage/backend-common';
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
import { defaultEntityDataParser } from '../modules/util/parse';
import { ConfigReader } from '@backstage/config';
import { InputError } from '@backstage/errors';

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
      logger: getVoidLogger(),
      parser: defaultEntityDataParser,
      policy: EntityPolicies.allOf([]),
      rulesEnforcer: { isAllowed: () => true },
      legacySingleProcessorValidation: false,
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

    it('runs all processor validations when asked to', async () => {
      const validate = jest.fn(async () => true);
      const processor1: Partial<CatalogProcessor> = {
        validateEntityKind: validate,
      };
      const processor2: Partial<CatalogProcessor> = {
        validateEntityKind: validate,
      };

      const legacy = new DefaultCatalogProcessingOrchestrator({
        processors: [
          processor1 as CatalogProcessor,
          processor2 as CatalogProcessor,
        ],
        integrations: ScmIntegrations.fromConfig(new ConfigReader({})),
        logger: getVoidLogger(),
        parser: defaultEntityDataParser,
        policy: EntityPolicies.allOf([]),
        rulesEnforcer: { isAllowed: () => true },
        legacySingleProcessorValidation: true,
      });

      const modern = new DefaultCatalogProcessingOrchestrator({
        processors: [
          processor1 as CatalogProcessor,
          processor2 as CatalogProcessor,
        ],
        integrations: ScmIntegrations.fromConfig(new ConfigReader({})),
        logger: getVoidLogger(),
        parser: defaultEntityDataParser,
        policy: EntityPolicies.allOf([]),
        rulesEnforcer: { isAllowed: () => true },
        legacySingleProcessorValidation: false,
      });

      await expect(legacy.process({ entity })).resolves.toMatchObject({
        ok: true,
      });
      expect(validate).toHaveBeenCalledTimes(1);

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
        logger: getVoidLogger(),
        parser,
        policy: EntityPolicies.allOf([]),
        rulesEnforcer,
        legacySingleProcessorValidation: false,
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
        logger: getVoidLogger(),
        parser,
        policy: EntityPolicies.allOf([new FailingEntityPolicy()]),
        rulesEnforcer,
        legacySingleProcessorValidation: false,
      });

      await expect(
        orchestrator.process({ entity, state: {} }),
      ).resolves.toEqual(
        expect.objectContaining({
          ok: false,
          errors: [
            new InputError(
              "Policy check failed for location:default/l; caused by unknown error 'boom'",
            ),
          ],
        }),
      );
    });
  });
});
