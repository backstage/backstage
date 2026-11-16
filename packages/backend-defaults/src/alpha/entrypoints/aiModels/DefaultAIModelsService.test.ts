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

import type { LanguageModelV3StreamPart } from '@ai-sdk/provider';
import { mockServices } from '@backstage/backend-test-utils';
import { ConfigReader } from '@backstage/config';
import type { JsonObject } from '@backstage/types';
import { simulateReadableStream } from 'ai';
import { MockEmbeddingModelV3, MockLanguageModelV3 } from 'ai/test';
import { z } from 'zod';
import { DefaultAIModelsService } from './DefaultAIModelsService';
import type { AIProvider, AIProviderFactory } from './types';

const usage = {
  inputTokens: {
    total: 3,
    noCache: 3,
    cacheRead: undefined,
    cacheWrite: undefined,
  },
  outputTokens: { total: 5, text: 5, reasoning: undefined },
};

function textModel(text: string, modelId?: string) {
  return new MockLanguageModelV3({
    modelId,
    doGenerate: async () => ({
      content: [{ type: 'text', text }],
      finishReason: { unified: 'stop', raw: 'stop' },
      usage,
      warnings: [],
    }),
  });
}

function streamModel(parts: LanguageModelV3StreamPart[]) {
  return new MockLanguageModelV3({
    doStream: async () => ({
      stream: simulateReadableStream({
        chunks: [
          { type: 'stream-start', warnings: [] },
          { type: 'text-start', id: '1' },
          ...parts,
        ],
      }),
    }),
  });
}

const finishPart: LanguageModelV3StreamPart = {
  type: 'finish',
  finishReason: { unified: 'stop', raw: 'stop' },
  usage,
};

function createMockFactory(
  options: {
    type?: string;
    capabilities?: Array<'text-generation' | 'embeddings'>;
    languageModel?: (modelId: string) => MockLanguageModelV3;
  } = {},
) {
  const type = options.type ?? 'mock';
  const capabilities = options.capabilities ?? [
    'text-generation',
    'embeddings',
  ];
  const languageModel = jest.fn(
    options.languageModel ??
      ((modelId: string) => textModel(`from ${modelId}`, modelId)),
  );
  const embeddingModel = jest.fn(
    (modelId: string) =>
      new MockEmbeddingModelV3({
        modelId,
        maxEmbeddingsPerCall: 100,
        doEmbed: async ({ values }) => ({
          embeddings: values.map((_, index) => [index, 1]),
          usage: { tokens: 7 },
          warnings: [],
        }),
      }),
  );
  const dispose = jest.fn(async () => {});
  const factory: AIProviderFactory = {
    type,
    async create({ id }): Promise<AIProvider> {
      return {
        metadata: { id, type },
        supports: capability => capabilities.includes(capability),
        getLanguageModelFactory: () => languageModel,
        getEmbeddingModelFactory: () => embeddingModel,
        healthCheck: async () => ({ healthy: true }),
        dispose,
      };
    },
  };
  return { factory, languageModel, embeddingModel, dispose };
}

const twoProviderConfig = {
  ai: {
    defaultProvider: 'primary',
    providers: {
      primary: {
        type: 'mock',
        defaultModels: {
          'text-generation': 'fast',
          embeddings: 'embed-1',
        },
        modelAliases: {
          'text-generation': {
            fast: 'primary-fast-1',
            smart: 'primary-smart-1',
          },
        },
      },
      secondary: {
        type: 'mock',
        defaultModels: { 'text-generation': 'secondary-default' },
      },
    },
  },
};

async function createService(
  data: JsonObject,
  factories: AIProviderFactory[] = [createMockFactory().factory],
) {
  return DefaultAIModelsService.create({
    config: new ConfigReader(data),
    logger: mockServices.logger.mock(),
    factories,
  });
}

describe('DefaultAIModelsService', () => {
  it('resolves provider and model selections as documented', async () => {
    const mock = createMockFactory();
    const service = await createService(twoProviderConfig, [mock.factory]);

    // Neither given: default provider and its default model (an alias).
    await expect(service.generateText({ prompt: 'hi' })).resolves.toEqual({
      provider: 'primary',
      model: 'primary-fast-1',
      text: 'from primary-fast-1',
      finishReason: 'stop',
      usage: { inputTokens: 3, outputTokens: 5 },
    });

    // Model only: resolved within the default provider, aliases included.
    await expect(
      service.generateText({ model: 'smart', prompt: 'hi' }),
    ).resolves.toMatchObject({ provider: 'primary', model: 'primary-smart-1' });
    await expect(
      service.generateText({ model: 'gpt-x', prompt: 'hi' }),
    ).resolves.toMatchObject({ provider: 'primary', model: 'gpt-x' });

    // Provider only: that provider's default model.
    await expect(
      service.generateText({ provider: 'secondary', prompt: 'hi' }),
    ).resolves.toMatchObject({
      provider: 'secondary',
      model: 'secondary-default',
    });

    // Both given: exact model on that provider; aliases are per provider.
    await expect(
      service.generateText({
        provider: 'secondary',
        model: 'smart',
        prompt: 'hi',
      }),
    ).resolves.toMatchObject({ provider: 'secondary', model: 'smart' });

    const model = await service.resolveModel({
      capability: 'text-generation',
      provider: 'secondary',
    });
    expect(model.modelId).toBe('secondary-default');
    const embeddingModel = await service.resolveModel({
      capability: 'embeddings',
    });
    expect(embeddingModel.modelId).toBe('embed-1');
  });

  it('passes prompts and call settings to the model', async () => {
    const model = textModel('ok');
    const service = await createService(twoProviderConfig, [
      createMockFactory({ languageModel: () => model }).factory,
    ]);

    await service.generateText({
      system: 'be brief',
      messages: [
        { role: 'user', content: 'hello' },
        { role: 'assistant', content: 'hi' },
        { role: 'user', content: 'again' },
      ],
      maxOutputTokens: 10,
      temperature: 0.2,
    });

    expect(model.doGenerateCalls).toHaveLength(1);
    const call = model.doGenerateCalls[0];
    expect(call.maxOutputTokens).toBe(10);
    expect(call.temperature).toBe(0.2);
    expect(call.prompt.map(message => message.role)).toEqual([
      'system',
      'user',
      'assistant',
      'user',
    ]);
  });

  it('generates objects from zod and JSON Schema schemas', async () => {
    const service = await createService(twoProviderConfig, [
      createMockFactory({
        languageModel: () => textModel('{"summary":"fine","count":2}'),
      }).factory,
    ]);

    const fromZod = await service.generateObject({
      prompt: 'review',
      schema: z.object({ summary: z.string(), count: z.number() }),
    });
    expect(fromZod).toEqual({
      provider: 'primary',
      model: 'primary-fast-1',
      object: { summary: 'fine', count: 2 },
      finishReason: 'stop',
      usage: { inputTokens: 3, outputTokens: 5 },
    });

    const fromJsonSchema = await service.generateObject({
      prompt: 'review',
      schema: {
        type: 'object',
        properties: { summary: { type: 'string' } },
        required: ['summary'],
      },
    });
    expect(fromJsonSchema.object).toEqual({ summary: 'fine', count: 2 });

    await expect(
      service.generateObject({
        prompt: 'review',
        schema: z.object({ summary: z.number() }),
      }),
    ).rejects.toThrow(/No object generated/);
  });

  it('streams text and reports the final response', async () => {
    const service = await createService(twoProviderConfig, [
      createMockFactory({
        languageModel: () =>
          streamModel([
            { type: 'text-delta', id: '1', delta: 'Hello' },
            { type: 'text-delta', id: '1', delta: ', world' },
            { type: 'text-end', id: '1' },
            finishPart,
          ]),
      }).factory,
    ]);

    const result = service.streamText({ prompt: 'hi' });
    expect(result.provider).toBe('primary');
    expect(result.model).toBe('primary-fast-1');

    const chunks: string[] = [];
    for await (const chunk of result.textStream) {
      chunks.push(chunk);
    }
    expect(chunks).toEqual(['Hello', ', world']);
    await expect(result.response).resolves.toEqual({
      finishReason: 'stop',
      usage: { inputTokens: 3, outputTokens: 5 },
    });
  });

  it('surfaces stream failures through the stream and response', async () => {
    const service = await createService(twoProviderConfig, [
      createMockFactory({
        languageModel: () =>
          streamModel([
            { type: 'text-delta', id: '1', delta: 'partial' },
            { type: 'error', error: new Error('upstream failed') },
          ]),
      }).factory,
    ]);

    const result = service.streamText({ prompt: 'hi' });
    const chunks: string[] = [];
    await expect(async () => {
      for await (const chunk of result.textStream) {
        chunks.push(chunk);
      }
    }).rejects.toThrow('upstream failed');
    expect(chunks).toEqual(['partial']);
    await expect(result.response).rejects.toThrow('upstream failed');
  });

  it('generates embeddings', async () => {
    const mock = createMockFactory();
    const service = await createService(twoProviderConfig, [mock.factory]);

    await expect(service.embed({ values: ['a', 'b'] })).resolves.toEqual({
      provider: 'primary',
      model: 'embed-1',
      embeddings: [
        [0, 1],
        [1, 1],
      ],
      usage: { tokens: 7 },
    });
    expect(mock.embeddingModel).toHaveBeenCalledWith('embed-1');

    await expect(service.embed({ values: [] })).rejects.toThrow(
      'An AI embeddings request must contain at least one value',
    );
  });

  it('rejects requests that cannot be served', async () => {
    const service = await createService(twoProviderConfig);

    await expect(
      service.generateText({ provider: 'missing', prompt: 'hi' }),
    ).rejects.toMatchObject({
      name: 'InputError',
      message:
        "Unknown AI provider 'missing', the configured providers are: primary, secondary",
    });
    await expect(
      service.embed({ provider: 'secondary', values: ['a'] }),
    ).rejects.toMatchObject({
      name: 'InputError',
      message:
        "The 'embeddings' capability is not enabled on AI provider 'secondary', set ai.providers.secondary.defaultModels.embeddings to enable it",
    });
    await expect(service.generateText({})).rejects.toMatchObject({
      name: 'InputError',
      message:
        'An AI text request must contain exactly one of `prompt` or `messages`',
    });
    await expect(
      service.generateText({
        prompt: 'hi',
        messages: [{ role: 'user', content: 'hi' }],
      }),
    ).rejects.toThrow('exactly one of `prompt` or `messages`');
    await expect(service.generateText({ messages: [] })).rejects.toThrow(
      'An AI text request must contain at least one message',
    );
    expect(() =>
      service.streamText({ provider: 'missing', prompt: 'hi' }),
    ).toThrow("Unknown AI provider 'missing'");

    const withoutDefault = await createService({
      ai: { providers: { primary: twoProviderConfig.ai.providers.primary } },
    });
    await expect(
      withoutDefault.generateText({ prompt: 'hi' }),
    ).rejects.toMatchObject({
      name: 'InputError',
      message:
        'No AI provider was requested and ai.defaultProvider is not configured',
    });
    await expect(
      withoutDefault.generateText({ provider: 'primary', prompt: 'hi' }),
    ).resolves.toMatchObject({ model: 'primary-fast-1' });
  });

  it('constructs without AI configuration and fails each call clearly', async () => {
    const service = await createService({});
    const message =
      'AI models are not configured, add provider instances under ai.providers';

    await expect(service.generateText({ prompt: 'hi' })).rejects.toMatchObject({
      name: 'ServiceUnavailableError',
      message,
    });
    await expect(
      service.generateObject({ prompt: 'hi', schema: { type: 'object' } }),
    ).rejects.toThrow(message);
    await expect(service.embed({ values: ['a'] })).rejects.toThrow(message);
    await expect(
      service.resolveModel({ capability: 'text-generation' }),
    ).rejects.toThrow(message);
    expect(() => service.streamText({ prompt: 'hi' })).toThrow(message);
  });

  it('validates configuration at startup', async () => {
    const mock = createMockFactory();

    await expect(
      createService({}, [mock.factory, createMockFactory().factory]),
    ).rejects.toThrow(
      "Duplicate AI provider factory type 'mock', each provider family type must be registered only once",
    );
    await expect(
      createService({ ai: { providers: { x: { type: 'nope' } } } }, [
        mock.factory,
      ]),
    ).rejects.toThrow(
      "Unknown AI provider type 'nope' at ai.providers.x.type, the available types are: mock",
    );
    await expect(
      createService({
        ai: {
          defaultProvider: 'other',
          providers: { x: { type: 'mock' } },
        },
      }),
    ).rejects.toThrow(
      "The AI provider 'other' set in ai.defaultProvider is not configured under ai.providers",
    );
    await expect(
      createService(
        {
          ai: {
            providers: {
              x: { type: 'text-only', defaultModels: { embeddings: 'e' } },
            },
          },
        },
        [
          createMockFactory({
            type: 'text-only',
            capabilities: ['text-generation'],
          }).factory,
        ],
      ),
    ).rejects.toThrow(
      "AI provider 'x' of type 'text-only' does not support the 'embeddings' capability, remove ai.providers.x.defaultModels.embeddings",
    );
    await expect(
      createService({
        ai: {
          providers: { x: { type: 'mock', defaultModels: { images: 'i' } } },
        },
      }),
    ).rejects.toThrow(
      "Unknown AI capability 'images' at ai.providers.x.defaultModels, the known capabilities are: text-generation, embeddings",
    );
    await expect(
      createService({
        ai: {
          providers: {
            x: {
              type: 'mock',
              modelAliases: { embeddings: { small: 'e-small' } },
            },
          },
        },
      }),
    ).rejects.toThrow(
      "AI provider 'x' has model aliases for 'embeddings', but the capability is not enabled; set ai.providers.x.defaultModels.embeddings to enable it",
    );
  });

  it('disposes providers', async () => {
    const mock = createMockFactory();
    const service = await createService(twoProviderConfig, [mock.factory]);
    await service.dispose();
    expect(mock.dispose).toHaveBeenCalledTimes(2);
  });
});
