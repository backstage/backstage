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

import fs from 'fs-extra';
import os from 'node:os';
import path from 'node:path';
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
import { FileReaderProcessor } from '../processors/FileReaderProcessor';
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

  describe('allowed location types', () => {
    it('enforces allowedLocationTypes during processing', async () => {
      const integrations = ScmIntegrations.fromConfig(new ConfigReader({}));
      const processor: jest.Mocked<CatalogProcessor> = {
        getProcessorName: jest.fn(),
        validateEntityKind: jest.fn(async () => true),
        readLocation: jest.fn(async () => true),
      };
      const orchestrator = new DefaultCatalogProcessingOrchestrator({
        processors: [processor],
        integrations,
        logger: mockServices.logger.mock(),
        parser: jest.fn(),
        policy: EntityPolicies.allOf([]),
        rulesEnforcer: { isAllowed: jest.fn().mockReturnValue(true) },
        allowedLocationTypes: ['url'],
      });

      const makeEntity = (
        locationType: string,
        specType: string,
      ): LocationEntity => ({
        apiVersion: 'backstage.io/v1beta1',
        kind: 'Location',
        metadata: {
          name: 'test',
          annotations: {
            [ANNOTATION_ORIGIN_LOCATION]: `${locationType}:https://example.com/c.yaml`,
            [ANNOTATION_LOCATION]: `${locationType}:https://example.com/c.yaml`,
          },
        },
        spec: { type: specType, target: 'https://example.com/other.yaml' },
      });

      const disallowed = await orchestrator.process({
        entity: makeEntity('url', 'file'),
        state: {},
      });
      expect(disallowed.ok).toBe(false);
      expect(processor.readLocation).not.toHaveBeenCalled();

      const inherited = await orchestrator.process({
        entity: makeEntity('file', 'file'),
        state: {},
      });
      expect(inherited.ok).toBe(true);
      expect(processor.readLocation).toHaveBeenCalled();
    });

    it('rejects url locations that declare file type specs before any file read', async () => {
      const marker = `secret-${Math.random().toString(36).slice(2)}`;
      const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'test-'));
      const secretFile = path.join(tempDir, 'secrets.yaml');
      // Invalid YAML, so that a read would surface the marker in the errors
      await fs.writeFile(secretFile, `key: [[${marker}\n`);

      const readLocationSpy = jest.spyOn(
        FileReaderProcessor.prototype,
        'readLocation',
      );

      const kindProcessor: jest.Mocked<CatalogProcessor> = {
        getProcessorName: jest.fn().mockReturnValue('kind-validator'),
        validateEntityKind: jest.fn(async entity => entity.kind === 'Location'),
      };

      const orchestrator = new DefaultCatalogProcessingOrchestrator({
        processors: [kindProcessor, new FileReaderProcessor()],
        integrations: ScmIntegrations.fromConfig(new ConfigReader({})),
        logger: mockServices.logger.mock(),
        parser: defaultEntityDataParser,
        policy: EntityPolicies.allOf([]),
        rulesEnforcer: { isAllowed: jest.fn().mockReturnValue(true) },
        allowedLocationTypes: ['url'],
      });

      const entity: LocationEntity = {
        apiVersion: 'backstage.io/v1beta1',
        kind: 'Location',
        metadata: {
          name: 'test',
          annotations: {
            [ANNOTATION_ORIGIN_LOCATION]:
              'url:https://example.com/catalog-info.yaml',
            [ANNOTATION_LOCATION]: 'url:https://example.com/catalog-info.yaml',
          },
        },
        spec: { type: 'file', target: secretFile },
      };

      const result = await orchestrator.process({ entity, state: {} });

      expect(result.ok).toBe(false);
      expect(result.errors?.map(e => e.message)).toEqual([
        expect.stringContaining('allowed type'),
      ]);
      expect(result.errors?.map(e => e.message).join('\n')).not.toContain(
        marker,
      );
      expect(readLocationSpy).not.toHaveBeenCalled();

      await fs.rm(tempDir, { recursive: true, force: true });
    });
  });
});
