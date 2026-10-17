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

import { createAmazonBedrock } from '@ai-sdk/amazon-bedrock';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import type { ProviderV3 } from '@ai-sdk/provider';
import { fromNodeProviderChain } from '@aws-sdk/credential-providers';
import type { AIModelCapability } from '@backstage/backend-plugin-api/alpha';
import type { Config } from '@backstage/config';
import type { AIProvider, AIProviderFactory } from './types';

function readHeaders(config: Config): Record<string, string> | undefined {
  const headersConfig = config.getOptionalConfig('headers');
  if (!headersConfig) {
    return undefined;
  }
  return Object.fromEntries(
    headersConfig.keys().map(name => [name, headersConfig.getString(name)]),
  );
}

function createSdkProvider(options: {
  id: string;
  type: string;
  sdk: ProviderV3;
  capabilities: AIModelCapability[];
}): AIProvider {
  const { id, type, sdk, capabilities } = options;
  const provider: AIProvider = {
    metadata: { id, type },
    supports(capability) {
      return capabilities.includes(capability);
    },
    getLanguageModelFactory() {
      return modelId => sdk.languageModel(modelId);
    },
    async healthCheck() {
      // Built-in providers are stateless HTTP clients. A live check would
      // spend tokens, so only the configuration is checked.
      return { healthy: true };
    },
  };
  if (capabilities.includes('embeddings')) {
    provider.getEmbeddingModelFactory = () => modelId =>
      sdk.embeddingModel(modelId);
  }
  return provider;
}

const openaiFactory: AIProviderFactory = {
  type: 'openai',
  async create({ id, config }) {
    return createSdkProvider({
      id,
      type: 'openai',
      capabilities: ['text-generation', 'embeddings'],
      sdk: createOpenAI({
        apiKey: config.getOptionalString('apiKey'),
        baseURL: config.getOptionalString('baseURL'),
        headers: readHeaders(config),
      }),
    });
  },
};

const anthropicFactory: AIProviderFactory = {
  type: 'anthropic',
  async create({ id, config }) {
    return createSdkProvider({
      id,
      type: 'anthropic',
      capabilities: ['text-generation'],
      sdk: createAnthropic({
        apiKey: config.getOptionalString('apiKey'),
        baseURL: config.getOptionalString('baseURL'),
        headers: readHeaders(config),
      }),
    });
  },
};

const googleFactory: AIProviderFactory = {
  type: 'google',
  async create({ id, config }) {
    return createSdkProvider({
      id,
      type: 'google',
      capabilities: ['text-generation', 'embeddings'],
      sdk: createGoogleGenerativeAI({
        apiKey: config.getOptionalString('apiKey'),
        baseURL: config.getOptionalString('baseURL'),
        headers: readHeaders(config),
      }),
    });
  },
};

const bedrockFactory: AIProviderFactory = {
  type: 'bedrock',
  async create({ id, config }) {
    const apiKey = config.getOptionalString('apiKey');
    return createSdkProvider({
      id,
      type: 'bedrock',
      capabilities: ['text-generation', 'embeddings'],
      sdk: createAmazonBedrock({
        region: config.getOptionalString('region'),
        baseURL: config.getOptionalString('baseURL'),
        headers: readHeaders(config),
        // Without a Bedrock API key, use the standard AWS credential chain
        // (environment, shared config, instance and container roles).
        ...(apiKey
          ? { apiKey }
          : { credentialProvider: fromNodeProviderChain() }),
      }),
    });
  },
};

const openaiCompatibleFactory: AIProviderFactory = {
  type: 'openai-compatible',
  async create({ id, config }) {
    return createSdkProvider({
      id,
      type: 'openai-compatible',
      capabilities: ['text-generation', 'embeddings'],
      sdk: createOpenAICompatible({
        name: id,
        baseURL: config.getString('baseURL'),
        apiKey: config.getOptionalString('apiKey'),
        headers: readHeaders(config),
      }),
    });
  },
};

/**
 * The provider families that are always available.
 *
 * @internal
 */
export const builtinProviderFactories: AIProviderFactory[] = [
  openaiFactory,
  anthropicFactory,
  googleFactory,
  bedrockFactory,
  openaiCompatibleFactory,
];
