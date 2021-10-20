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
  Entity,
  EntityPolicies,
  LocationEntity,
  LocationSpec,
  LOCATION_ANNOTATION,
  ORIGIN_LOCATION_ANNOTATION,
} from '@backstage/catalog-model';
import { ScmIntegrations } from '@backstage/integration';
import {
  CatalogProcessor,
  CatalogProcessorCache,
  CatalogProcessorEmit,
  CatalogProcessorParser,
  results,
} from '../ingestion';
import { CatalogRulesEnforcer } from '../ingestion/CatalogRules';
import { DefaultCatalogProcessingOrchestrator } from './DefaultCatalogProcessingOrchestrator';
import { defaultEntityDataParser } from '../ingestion/processors/util/parse';
import { ConfigReader } from '@backstage/config';

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
        results.entity(
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
        results.relation({
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
          [LOCATION_ANNOTATION]: 'url:./here',
          [ORIGIN_LOCATION_ANNOTATION]: 'url:./there',
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
    });

    it('runs a minimal processing', async () => {
      await expect(orchestrator.process({ entity })).resolves.toEqual({
        ok: true,
        completedEntity: entity,
        deferredEntities: [],
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
        deferredEntities: [
          {
            locationKey: 'url:./new-place',
            entity: {
              apiVersion: 'my-api/v1',
              kind: 'FooBar',
              metadata: {
                name: 'my-new-foo-bar',
                annotations: {
                  [LOCATION_ANNOTATION]: 'url:./new-place',
                  [ORIGIN_LOCATION_ANNOTATION]: 'url:./there',
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
  });

  describe('rules', () => {
    it('enforces catalog rules', async () => {
      const entity: LocationEntity = {
        apiVersion: 'backstage.io/v1beta1',
        kind: 'Location',
        metadata: {
          name: 'l',
          annotations: {
            [ORIGIN_LOCATION_ANNOTATION]: 'url:https://example.com/origin.yaml',
            [LOCATION_ANNOTATION]: 'url:https://example.com/origin.yaml',
          },
        },
        spec: {
          type: 'url',
          target: 'http://example.com/entity.yaml',
        },
      };

      const integrations = ScmIntegrations.fromConfig(new ConfigReader({}));
      const processor: jest.Mocked<CatalogProcessor> = {
        validateEntityKind: jest.fn(async () => true),
        readLocation: jest.fn(async (_l, _o, emit) => {
          emit(results.entity({ type: 't', target: 't' }, entity));
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
  });
});
