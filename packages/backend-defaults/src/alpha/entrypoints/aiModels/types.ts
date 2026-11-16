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

import type { EmbeddingModelV3, LanguageModelV3 } from '@ai-sdk/provider';
import type { LoggerService } from '@backstage/backend-plugin-api';
import type { AIModelCapability } from '@backstage/backend-plugin-api/alpha';
import type { Config } from '@backstage/config';

/**
 * Creates an AI SDK language model for a concrete model ID.
 *
 * @alpha
 */
export type AILanguageModelFactory = (modelId: string) => LanguageModelV3;

/**
 * Creates an AI SDK embedding model for a concrete model ID.
 *
 * @alpha
 */
export type AIEmbeddingModelFactory = (modelId: string) => EmbeddingModelV3;

/**
 * Metadata about a configured AI provider instance.
 *
 * @alpha
 */
export interface AIProviderMetadata {
  /** The key of the provider instance under `ai.providers`. */
  id: string;
  /** The provider family type, as given by `ai.providers.<id>.type`. */
  type: string;
}

/**
 * The result of an AI provider health check.
 *
 * @alpha
 */
export interface AIProviderHealthCheckResult {
  healthy: boolean;
  message?: string;
  latency?: number;
}

/**
 * A configured AI provider instance, created by an {@link AIProviderFactory}.
 *
 * @alpha
 */
export interface AIProvider {
  readonly metadata: AIProviderMetadata;
  /** Whether this provider family supports the given capability. */
  supports(capability: AIModelCapability): boolean;
  getLanguageModelFactory(): AILanguageModelFactory;
  /** Required when the provider supports the `embeddings` capability. */
  getEmbeddingModelFactory?(): AIEmbeddingModelFactory;
  healthCheck(): Promise<AIProviderHealthCheckResult>;
  /** Releases any resources held by the provider, called on shutdown. */
  dispose?(): Promise<void>;
}

/**
 * Options passed to {@link AIProviderFactory.create}.
 *
 * @alpha
 */
export interface AIProviderFactoryOptions {
  /** The key of the provider instance under `ai.providers`. */
  id: string;
  /** The `ai.providers.<id>` configuration block. */
  config: Config;
  logger: LoggerService;
}

/**
 * Creates provider instances for one AI provider family.
 *
 * @remarks
 *
 * Contribute additional provider families through
 * `aiProviderFactoriesServiceRef`.
 *
 * @alpha
 */
export interface AIProviderFactory {
  /** The provider family type that `ai.providers.<id>.type` refers to. */
  readonly type: string;
  create(options: AIProviderFactoryOptions): Promise<AIProvider>;
}
