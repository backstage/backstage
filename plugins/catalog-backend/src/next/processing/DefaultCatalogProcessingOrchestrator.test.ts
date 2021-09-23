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
  EntityPolicy,
  LocationEntity,
  LOCATION_ANNOTATION,
  ORIGIN_LOCATION_ANNOTATION,
} from '@backstage/catalog-model';
import { ScmIntegrationRegistry } from '@backstage/integration';
import {
  CatalogProcessor,
  CatalogProcessorParser,
  results,
} from '../../ingestion';
import { CatalogRulesEnforcer } from '../../ingestion/CatalogRules';
import { DefaultCatalogProcessingOrchestrator } from './DefaultCatalogProcessingOrchestrator';

describe('DefaultCatalogProcessingOrchestrator', () => {
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

    const processor: jest.Mocked<CatalogProcessor> = {
      validateEntityKind: jest.fn(async () => true),
      readLocation: jest.fn(async (_l, _o, emit) => {
        emit(results.entity({ type: 't', target: 't' }, entity));
        return true;
      }),
    };
    const integrations: jest.Mocked<ScmIntegrationRegistry> = {} as any;
    const parser: CatalogProcessorParser = jest.fn();
    const policy: jest.Mocked<EntityPolicy> = {
      enforce: jest.fn(async x => x),
    };
    const rulesEnforcer: jest.Mocked<CatalogRulesEnforcer> = {
      isAllowed: jest.fn(),
    };

    const orchestrator = new DefaultCatalogProcessingOrchestrator({
      processors: [processor],
      integrations,
      logger: getVoidLogger(),
      parser,
      policy,
      rulesEnforcer,
    });

    rulesEnforcer.isAllowed.mockReturnValueOnce(true);
    await expect(
      orchestrator.process({ entity, state: new Map() }),
    ).resolves.toEqual(expect.objectContaining({ ok: true }));

    rulesEnforcer.isAllowed.mockReturnValueOnce(false);
    await expect(
      orchestrator.process({ entity, state: new Map() }),
    ).resolves.toEqual(expect.objectContaining({ ok: false }));
  });
});
