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

import { mockServices } from '@backstage/backend-test-utils';
import { Entity } from '@backstage/catalog-model';
import { CatalogContextRetriever } from './CatalogContextRetriever';
import { QueryService } from './QueryService';

const fakeRetriever = (entities: Entity[]): CatalogContextRetriever =>
  ({
    retrieve: jest.fn().mockResolvedValue(
      entities.map((entity, i) => ({
        entity,
        entityRef: `component:default/${entity.metadata.name}`,
        score: 100 - i,
      })),
    ),
  } as unknown as CatalogContextRetriever);

const entity = (name: string, extra: Record<string, unknown> = {}): Entity =>
  ({
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Component',
    metadata: { name },
    spec: { type: 'service', owner: 'group:platform', ...extra },
  } as Entity);

describe('QueryService', () => {
  const logger = mockServices.logger.mock();

  it('returns a no-context message when retriever finds nothing', async () => {
    const generateText = jest.fn();
    const svc = new QueryService(
      fakeRetriever([]),
      'mock-model',
      generateText,
      logger,
      256,
    );

    const result = await svc.query('what is x?');

    expect(result.answer).toMatch(/couldn't find/i);
    expect(result.citations).toEqual([]);
    expect(generateText).not.toHaveBeenCalled();
  });

  it('passes a grounded prompt to generateText and returns the answer', async () => {
    const generateText = jest
      .fn()
      .mockResolvedValue({ text: '  group:platform owns payments-api  ' });
    const svc = new QueryService(
      fakeRetriever([entity('payments-api')]),
      'mock-model',
      generateText,
      logger,
      256,
    );

    const result = await svc.query('who owns payments?');

    expect(result.answer).toEqual('group:platform owns payments-api');
    expect(result.citations).toEqual(['component:default/payments-api']);

    const call = generateText.mock.calls[0][0];
    expect(call.model).toEqual('mock-model');
    expect(call.system).toMatch(/Backstage software catalog/);
    expect(call.prompt).toContain('component:default/payments-api');
    expect(call.prompt).toContain('owner: group:platform');
    expect(call.prompt).toContain('Question: who owns payments?');
    expect(call.maxOutputTokens).toEqual(256);
  });

  it('throws InputError on an empty question', async () => {
    const svc = new QueryService(
      fakeRetriever([]),
      'mock-model',
      jest.fn(),
      logger,
      256,
    );

    await expect(svc.query('   ')).rejects.toThrow(/must not be empty/);
  });

  it('forwards caller credentials to the retriever', async () => {
    const retriever = fakeRetriever([entity('a')]);
    const svc = new QueryService(
      retriever,
      'mock-model',
      jest.fn().mockResolvedValue({ text: 'ok' }),
      logger,
      256,
    );

    await svc.query('a', { credentials: { token: 't0k' } });

    expect(retriever.retrieve).toHaveBeenCalledWith('a', {
      credentials: { token: 't0k' },
    });
  });

  it('includes entity relations in the prompt when present', async () => {
    const generateText = jest.fn().mockResolvedValue({ text: 'ok' });
    const svc = new QueryService(
      fakeRetriever([
        entity('payments-api', {
          dependsOn: ['resource:default/payments-db'],
          providesApis: ['api:default/payments'],
        }),
      ]),
      'mock-model',
      generateText,
      logger,
      256,
    );

    await svc.query('payments');

    const prompt = generateText.mock.calls[0][0].prompt as string;
    expect(prompt).toContain('dependsOn: resource:default/payments-db');
    expect(prompt).toContain('providesApis: api:default/payments');
  });
});
