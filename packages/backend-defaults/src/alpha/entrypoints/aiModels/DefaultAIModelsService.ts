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
  embedMany,
  generateText,
  jsonSchema,
  LanguageModelUsage,
  Output,
  streamText,
} from 'ai';
import type { LoggerService } from '@backstage/backend-plugin-api';
import type {
  AIEmbedRequest,
  AIEmbedResponse,
  AIGenerateObjectRequest,
  AIGenerateObjectResponse,
  AIGenerateTextRequest,
  AIGenerateTextResponse,
  AIModelCapability,
  AIModelSelection,
  AIModelsService,
  AIObjectSchema,
  AIResolvedModel,
  AIResolveModelRequest,
  AIStreamTextRequest,
  AIStreamTextResponse,
  AITextRequestOptions,
  AITokenUsage,
} from '@backstage/backend-plugin-api/alpha';
import type { Config } from '@backstage/config';
import { InputError, ServiceUnavailableError } from '@backstage/errors';
import type { JsonObject } from '@backstage/types';
import type {
  AIEmbeddingModelFactory,
  AILanguageModelFactory,
  AIProvider,
  AIProviderFactory,
} from './types';

const CAPABILITIES: readonly AIModelCapability[] = [
  'text-generation',
  'embeddings',
];

function isCapability(value: string): value is AIModelCapability {
  return (CAPABILITIES as readonly string[]).includes(value);
}

type ProviderEntry = {
  id: string;
  provider: AIProvider;
  /** Concrete default model IDs; a capability is enabled only when present. */
  defaultModels: Map<AIModelCapability, string>;
  aliases: Map<AIModelCapability, Map<string, string>>;
  languageModelFactory: AILanguageModelFactory;
  embeddingModelFactory?: AIEmbeddingModelFactory;
};

type Selection = {
  entry: ProviderEntry;
  modelId: string;
};

function toTokenUsage(usage: LanguageModelUsage): AITokenUsage {
  return {
    inputTokens: usage.inputTokens ?? 0,
    outputTokens: usage.outputTokens ?? 0,
  };
}

function isZodSchema(schema: AIObjectSchema<unknown>): boolean {
  return (
    '_zod' in schema ||
    typeof (schema as { safeParse?: unknown }).safeParse === 'function'
  );
}

function toPrompt(
  request: AITextRequestOptions,
):
  | { prompt: string }
  | { messages: NonNullable<AITextRequestOptions['messages']> } {
  const hasPrompt = request.prompt !== undefined;
  const hasMessages = request.messages !== undefined;
  if (hasPrompt === hasMessages) {
    throw new InputError(
      'An AI text request must contain exactly one of `prompt` or `messages`',
    );
  }
  if (hasMessages) {
    if (request.messages!.length === 0) {
      throw new InputError(
        'An AI text request must contain at least one message',
      );
    }
    return { messages: request.messages! };
  }
  return { prompt: request.prompt! };
}

async function createEntry(
  id: string,
  providerConfig: Config,
  factories: Map<string, AIProviderFactory>,
  logger: LoggerService,
): Promise<ProviderEntry> {
  const configPath = `ai.providers.${id}`;
  const type = providerConfig.getString('type');
  const factory = factories.get(type);
  if (!factory) {
    throw new Error(
      `Unknown AI provider type '${type}' at ${configPath}.type, the available types are: ${[
        ...factories.keys(),
      ].join(', ')}`,
    );
  }

  const provider = await factory.create({
    id,
    config: providerConfig,
    logger: logger.child({ aiProvider: id }),
  });

  const aliases = new Map<AIModelCapability, Map<string, string>>();
  const aliasesConfig = providerConfig.getOptionalConfig('modelAliases');
  for (const capability of aliasesConfig?.keys() ?? []) {
    if (!isCapability(capability)) {
      throw new Error(
        `Unknown AI capability '${capability}' at ${configPath}.modelAliases, the known capabilities are: ${CAPABILITIES.join(
          ', ',
        )}`,
      );
    }
    const capabilityAliases = aliasesConfig!.getConfig(capability);
    aliases.set(
      capability,
      new Map(
        capabilityAliases
          .keys()
          .map(alias => [alias, capabilityAliases.getString(alias)]),
      ),
    );
  }

  const defaultModels = new Map<AIModelCapability, string>();
  const defaultModelsConfig = providerConfig.getOptionalConfig('defaultModels');
  for (const capability of defaultModelsConfig?.keys() ?? []) {
    if (!isCapability(capability)) {
      throw new Error(
        `Unknown AI capability '${capability}' at ${configPath}.defaultModels, the known capabilities are: ${CAPABILITIES.join(
          ', ',
        )}`,
      );
    }
    if (!provider.supports(capability)) {
      throw new Error(
        `AI provider '${id}' of type '${type}' does not support the '${capability}' capability, remove ${configPath}.defaultModels.${capability}`,
      );
    }
    const model = defaultModelsConfig!.getString(capability);
    defaultModels.set(capability, aliases.get(capability)?.get(model) ?? model);
  }

  for (const capability of aliases.keys()) {
    if (!defaultModels.has(capability)) {
      throw new Error(
        `AI provider '${id}' has model aliases for '${capability}', but the capability is not enabled; set ${configPath}.defaultModels.${capability} to enable it`,
      );
    }
  }

  let embeddingModelFactory: AIEmbeddingModelFactory | undefined;
  if (defaultModels.has('embeddings')) {
    embeddingModelFactory = provider.getEmbeddingModelFactory?.();
    if (!embeddingModelFactory) {
      throw new Error(
        `AI provider '${id}' of type '${type}' declares support for embeddings but does not provide an embedding model factory`,
      );
    }
  }

  return {
    id,
    provider,
    defaultModels,
    aliases,
    languageModelFactory: provider.getLanguageModelFactory(),
    embeddingModelFactory,
  };
}

/**
 * The default implementation of the AI models service.
 *
 * @internal
 */
export class DefaultAIModelsService implements AIModelsService {
  readonly #providers: Map<string, ProviderEntry>;
  readonly #defaultProvider: string | undefined;
  readonly #logger: LoggerService;

  static async create(options: {
    config: Config;
    logger: LoggerService;
    factories: AIProviderFactory[];
  }): Promise<DefaultAIModelsService> {
    const { config, logger } = options;

    const factories = new Map<string, AIProviderFactory>();
    for (const factory of options.factories) {
      if (factories.has(factory.type)) {
        throw new Error(
          `Duplicate AI provider factory type '${factory.type}', each provider family type must be registered only once`,
        );
      }
      factories.set(factory.type, factory);
    }

    const aiConfig = config.getOptionalConfig('ai');
    const providersConfig = aiConfig?.getOptionalConfig('providers');
    const providers = new Map<string, ProviderEntry>();
    for (const id of providersConfig?.keys() ?? []) {
      providers.set(
        id,
        await createEntry(
          id,
          providersConfig!.getConfig(id),
          factories,
          logger,
        ),
      );
    }

    const defaultProvider = aiConfig?.getOptionalString('defaultProvider');
    if (defaultProvider !== undefined && !providers.has(defaultProvider)) {
      throw new Error(
        `The AI provider '${defaultProvider}' set in ai.defaultProvider is not configured under ai.providers`,
      );
    }

    return new DefaultAIModelsService(providers, defaultProvider, logger);
  }

  private constructor(
    providers: Map<string, ProviderEntry>,
    defaultProvider: string | undefined,
    logger: LoggerService,
  ) {
    this.#providers = providers;
    this.#defaultProvider = defaultProvider;
    this.#logger = logger;
  }

  async generateText(
    request: AIGenerateTextRequest,
  ): Promise<AIGenerateTextResponse> {
    const { entry, modelId } = this.#select('text-generation', request);
    const result = await generateText({
      ...this.#callSettings(request),
      ...toPrompt(request),
      model: entry.languageModelFactory(modelId),
    });
    return {
      provider: entry.id,
      model: modelId,
      text: result.text,
      finishReason: result.finishReason,
      usage: toTokenUsage(result.totalUsage),
    };
  }

  streamText(request: AIStreamTextRequest): AIStreamTextResponse {
    const { entry, modelId } = this.#select('text-generation', request);
    const prompt = toPrompt(request);

    let resolveResponse: (
      value: Awaited<AIStreamTextResponse['response']>,
    ) => void;
    let rejectResponse: (error: unknown) => void;
    const response = new Promise<Awaited<AIStreamTextResponse['response']>>(
      (resolve, reject) => {
        resolveResponse = resolve;
        rejectResponse = reject;
      },
    );
    // Consumers may only iterate the text stream; avoid an unhandled rejection.
    response.catch(() => {});

    const result = streamText({
      ...this.#callSettings(request),
      ...prompt,
      model: entry.languageModelFactory(modelId),
      // Errors are surfaced through the text stream and response instead.
      onError: () => {},
    });

    async function* textStream(): AsyncGenerator<string> {
      try {
        for await (const part of result.fullStream) {
          if (part.type === 'text-delta') {
            yield part.text;
          } else if (part.type === 'error') {
            throw part.error;
          } else if (part.type === 'abort') {
            throw (
              request.abortSignal?.reason ??
              new Error('The AI text stream was aborted')
            );
          } else if (part.type === 'finish') {
            resolveResponse({
              finishReason: part.finishReason,
              usage: toTokenUsage(part.totalUsage),
            });
          }
        }
        // Covers an aborted stream that ends without a finish part.
        rejectResponse(new Error('The AI text stream ended without finishing'));
      } catch (error) {
        rejectResponse(error);
        throw error;
      }
    }

    return {
      provider: entry.id,
      model: modelId,
      textStream: textStream(),
      response,
    };
  }

  async generateObject<T>(
    request: AIGenerateObjectRequest<T>,
  ): Promise<AIGenerateObjectResponse<T>> {
    const { entry, modelId } = this.#select('text-generation', request);
    const { schema, schemaName, schemaDescription } = request;
    const result = await generateText({
      ...this.#callSettings(request),
      ...toPrompt(request),
      model: entry.languageModelFactory(modelId),
      output: Output.object<T>({
        // Zod schemas are validated by the AI SDK. JSON Schema objects are
        // forwarded to the model as is, and the result is not validated.
        schema: isZodSchema(schema)
          ? (schema as Exclude<AIObjectSchema<T>, JsonObject>)
          : jsonSchema<T>(schema as Parameters<typeof jsonSchema>[0]),
        name: schemaName,
        description: schemaDescription,
      }),
    });
    return {
      provider: entry.id,
      model: modelId,
      object: result.output,
      finishReason: result.finishReason,
      usage: toTokenUsage(result.totalUsage),
    };
  }

  async embed(request: AIEmbedRequest): Promise<AIEmbedResponse> {
    const { entry, modelId } = this.#select('embeddings', request);
    if (request.values.length === 0) {
      throw new InputError(
        'An AI embeddings request must contain at least one value',
      );
    }
    const result = await embedMany({
      model: entry.embeddingModelFactory!(modelId),
      values: request.values,
      abortSignal: request.abortSignal,
    });
    return {
      provider: entry.id,
      model: modelId,
      embeddings: result.embeddings,
      usage: { tokens: result.usage.tokens },
    };
  }

  async resolveModel<TCapability extends AIModelCapability>(
    request: AIResolveModelRequest<TCapability>,
  ): Promise<AIResolvedModel<TCapability>> {
    const { capability } = request;
    if (!isCapability(capability)) {
      throw new InputError(`Unknown AI capability '${capability}'`);
    }
    const { entry, modelId } = this.#select(capability, request);
    const model =
      capability === 'embeddings'
        ? entry.embeddingModelFactory!(modelId)
        : entry.languageModelFactory(modelId);
    return model as AIResolvedModel<TCapability>;
  }

  /**
   * Releases resources held by the configured providers.
   */
  async dispose(): Promise<void> {
    await Promise.all(
      [...this.#providers.values()].map(async ({ id, provider }) => {
        try {
          await provider.dispose?.();
        } catch (error) {
          this.#logger.warn(`Failed to dispose AI provider '${id}'`, error);
        }
      }),
    );
  }

  #callSettings(request: AITextRequestOptions) {
    return {
      system: request.system,
      maxOutputTokens: request.maxOutputTokens,
      temperature: request.temperature,
      abortSignal: request.abortSignal,
    };
  }

  #select(
    capability: AIModelCapability,
    selection: AIModelSelection,
  ): Selection {
    if (this.#providers.size === 0) {
      throw new ServiceUnavailableError(
        'AI models are not configured, add provider instances under ai.providers',
      );
    }

    const providerId = selection.provider ?? this.#defaultProvider;
    if (providerId === undefined) {
      throw new InputError(
        'No AI provider was requested and ai.defaultProvider is not configured',
      );
    }

    const entry = this.#providers.get(providerId);
    if (!entry) {
      throw new InputError(
        `Unknown AI provider '${providerId}', the configured providers are: ${[
          ...this.#providers.keys(),
        ].join(', ')}`,
      );
    }

    const defaultModel = entry.defaultModels.get(capability);
    if (defaultModel === undefined) {
      throw new InputError(
        `The '${capability}' capability is not enabled on AI provider '${providerId}', set ai.providers.${providerId}.defaultModels.${capability} to enable it`,
      );
    }

    const modelId = selection.model
      ? entry.aliases.get(capability)?.get(selection.model) ?? selection.model
      : defaultModel;

    this.#logger.debug(
      `Resolved AI ${capability} model '${modelId}' on provider '${providerId}'`,
    );
    return { entry, modelId };
  }
}
