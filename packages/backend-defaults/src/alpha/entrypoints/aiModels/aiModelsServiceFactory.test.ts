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

import {
  createServiceFactory,
  ServiceFactory,
} from '@backstage/backend-plugin-api';
import {
  mockServices,
  ServiceFactoryTester,
} from '@backstage/backend-test-utils';
import { JsonObject } from '@backstage/types';
import { MockLanguageModelV3 } from 'ai/test';
import {
  aiModelsServiceFactory,
  aiProviderFactoriesServiceRef,
} from './aiModelsServiceFactory';

function tester(data: JsonObject, extraFactories: ServiceFactory[] = []) {
  return ServiceFactoryTester.from(aiModelsServiceFactory, {
    dependencies: [
      mockServices.rootConfig.factory({ data }),
      ...extraFactories,
    ],
  });
}

describe('aiModelsServiceFactory', () => {
  it('creates models for the built-in provider families without calling them', async () => {
    const service = await tester({
      ai: {
        defaultProvider: 'openai',
        providers: {
          openai: {
            type: 'openai',
            apiKey: 'test-key',
            defaultModels: {
              'text-generation': 'gpt-test',
              embeddings: 'embed-test',
            },
          },
          anthropic: {
            type: 'anthropic',
            apiKey: 'test-key',
            baseURL: 'https://anthropic.example.com/v1',
            defaultModels: { 'text-generation': 'claude-test' },
          },
          google: {
            type: 'google',
            apiKey: 'test-key',
            defaultModels: { 'text-generation': 'gemini-test' },
          },
          bedrock: {
            type: 'bedrock',
            region: 'us-east-1',
            defaultModels: { 'text-generation': 'bedrock-test' },
          },
          groq: {
            type: 'openai-compatible',
            baseURL: 'https://groq.example.com/openai/v1',
            apiKey: 'test-key',
            headers: { 'x-team': 'backstage' },
            defaultModels: { 'text-generation': 'llama-test' },
          },
        },
      },
    }).getSubject('test');

    const expected = {
      openai: ['gpt-test', /^openai/],
      anthropic: ['claude-test', /^anthropic/],
      google: ['gemini-test', /^google/],
      bedrock: ['bedrock-test', /^amazon-bedrock/],
      groq: ['llama-test', /^groq/],
    } as const;
    for (const [provider, [modelId, providerPattern]] of Object.entries(
      expected,
    )) {
      const model = await service.resolveModel({
        capability: 'text-generation',
        provider,
      });
      expect(model.modelId).toBe(modelId);
      expect(model.provider).toMatch(providerPattern);
    }

    const embeddingModel = await service.resolveModel({
      capability: 'embeddings',
    });
    expect(embeddingModel.modelId).toBe('embed-test');
  });

  it('fails when a built-in family is given an unsupported capability or missing settings', async () => {
    await expect(
      tester({
        ai: {
          providers: {
            anthropic: {
              type: 'anthropic',
              defaultModels: { embeddings: 'nope' },
            },
          },
        },
      }).getSubject('test'),
    ).rejects.toThrow(
      "AI provider 'anthropic' of type 'anthropic' does not support the 'embeddings' capability",
    );
    await expect(
      tester({
        ai: { providers: { local: { type: 'openai-compatible' } } },
      }).getSubject('test'),
    ).rejects.toThrow(
      "Missing required config value at 'ai.providers.local.baseURL'",
    );
  });

  it('uses contributed provider factories', async () => {
    const model = new MockLanguageModelV3({
      modelId: 'custom-model',
      doGenerate: async () => ({
        content: [{ type: 'text', text: 'custom answer' }],
        finishReason: { unified: 'stop', raw: undefined },
        usage: {
          inputTokens: {
            total: undefined,
            noCache: undefined,
            cacheRead: undefined,
            cacheWrite: undefined,
          },
          outputTokens: {
            total: undefined,
            text: undefined,
            reasoning: undefined,
          },
        },
        warnings: [],
      }),
    });
    const customFactory = createServiceFactory({
      service: aiProviderFactoriesServiceRef,
      deps: {},
      async factory() {
        return {
          type: 'custom',
          async create({ id }) {
            return {
              metadata: { id, type: 'custom' },
              supports: capability => capability === 'text-generation',
              getLanguageModelFactory: () => () => model,
              healthCheck: async () => ({ healthy: true }),
            };
          },
        };
      },
    });

    const service = await tester(
      {
        ai: {
          defaultProvider: 'mine',
          providers: {
            mine: {
              type: 'custom',
              defaultModels: { 'text-generation': 'custom-model' },
            },
          },
        },
      },
      [customFactory],
    ).getSubject('test');

    await expect(service.generateText({ prompt: 'hi' })).resolves.toEqual({
      provider: 'mine',
      model: 'custom-model',
      text: 'custom answer',
      finishReason: 'stop',
      usage: { inputTokens: 0, outputTokens: 0 },
    });
  });

  it('rejects a contributed factory that duplicates a built-in type', async () => {
    const duplicate = createServiceFactory({
      service: aiProviderFactoriesServiceRef,
      deps: {},
      async factory() {
        return {
          type: 'openai',
          create: async () => {
            throw new Error('not called');
          },
        };
      },
    });

    await expect(tester({}, [duplicate]).getSubject('test')).rejects.toThrow(
      "Duplicate AI provider factory type 'openai'",
    );
  });
});
