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
import type { JsonObject } from '@backstage/types';
import type { ZodType as ZodV3Type, ZodTypeDef as ZodV3TypeDef } from 'zod/v3';
import type { $ZodType as ZodV4Type } from 'zod/v4/core';

/**
 * A model capability that can be enabled on a configured AI provider instance.
 *
 * @alpha
 */
export type AIModelCapability = 'text-generation' | 'embeddings';

/**
 * Selects the provider instance and model to use for a request.
 *
 * @remarks
 *
 * Resolution rules:
 *
 * - `provider` and `model` given: that model on that provider instance.
 * - only `provider` given: the default model of that provider instance for the
 *   requested capability.
 * - neither given: the default model of the `ai.defaultProvider` instance.
 * - only `model` given: the model is resolved within the `ai.defaultProvider`
 *   instance.
 *
 * The `model` may be a concrete upstream model ID or an alias that the
 * operator configured under `modelAliases`.
 *
 * @alpha
 */
export interface AIModelSelection {
  /** The key of a provider instance under `ai.providers`. */
  provider?: string;
  /** A concrete model ID or a configured model alias. */
  model?: string;
}

/**
 * A message in a conversation passed to a language model.
 *
 * @alpha
 */
export interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * Token usage reported for a language model call.
 *
 * @remarks
 *
 * Counts are `0` when the provider does not report them.
 *
 * @alpha
 */
export interface AITokenUsage {
  inputTokens: number;
  outputTokens: number;
}

/**
 * Common options for language model requests.
 *
 * @remarks
 *
 * Exactly one of `prompt` or `messages` must be provided.
 *
 * @alpha
 */
export interface AITextRequestOptions extends AIModelSelection {
  /** System instructions for the model. */
  system?: string;
  /** A single user prompt. */
  prompt?: string;
  /** A list of conversation messages. */
  messages?: AIMessage[];
  /** The maximum number of tokens to generate. */
  maxOutputTokens?: number;
  /** The sampling temperature. Supported ranges depend on the provider. */
  temperature?: number;
  /** A signal that cancels the request. */
  abortSignal?: AbortSignal;
}

/**
 * Metadata describing the provider instance and model that served a request.
 *
 * @alpha
 */
export interface AIResolvedModelInfo {
  /** The key of the provider instance under `ai.providers`. */
  provider: string;
  /** The concrete model ID, after alias resolution. */
  model: string;
}

/**
 * A text generation request.
 *
 * @alpha
 */
export interface AIGenerateTextRequest extends AITextRequestOptions {}

/**
 * The result of a text generation request.
 *
 * @alpha
 */
export interface AIGenerateTextResponse extends AIResolvedModelInfo {
  text: string;
  finishReason: string;
  usage: AITokenUsage;
}

/**
 * A streaming text generation request.
 *
 * @alpha
 */
export interface AIStreamTextRequest extends AITextRequestOptions {}

/**
 * The result of a streaming text generation request.
 *
 * @alpha
 */
export interface AIStreamTextResponse extends AIResolvedModelInfo {
  /**
   * The streamed text chunks as they arrive from the model. Iteration throws
   * if the model call fails.
   */
  textStream: AsyncIterable<string>;
  /**
   * Resolves with the finish reason and token usage when the stream completes,
   * or rejects if the model call fails or is aborted. It settles only once
   * `textStream` has been consumed.
   */
  response: Promise<{
    finishReason: string;
    usage: AITokenUsage;
  }>;
}

/**
 * The schema for a structured output request.
 *
 * @remarks
 *
 * Either a zod schema (zod 3 or zod 4), or a plain JSON Schema object. When a
 * zod schema is used, the generated object is validated against it. When a
 * JSON Schema object is used, the schema is forwarded to the model but the
 * generated object is not validated by the service, so the type parameter is
 * not checked at runtime.
 *
 * @alpha
 */
export type AIObjectSchema<T> =
  | ZodV3Type<T, ZodV3TypeDef, any>
  | ZodV4Type<T, any>
  | JsonObject;

/**
 * A structured output generation request.
 *
 * @alpha
 */
export interface AIGenerateObjectRequest<T> extends AITextRequestOptions {
  /** The schema of the object to generate. */
  schema: AIObjectSchema<T>;
  /** An optional name for the object, used as guidance by some providers. */
  schemaName?: string;
  /** An optional description of the object, used as guidance by some providers. */
  schemaDescription?: string;
}

/**
 * The result of a structured output generation request.
 *
 * @alpha
 */
export interface AIGenerateObjectResponse<T> extends AIResolvedModelInfo {
  object: T;
  finishReason: string;
  usage: AITokenUsage;
}

/**
 * An embeddings request.
 *
 * @alpha
 */
export interface AIEmbedRequest extends AIModelSelection {
  /** The values to embed. */
  values: string[];
  /** A signal that cancels the request. */
  abortSignal?: AbortSignal;
}

/**
 * The result of an embeddings request.
 *
 * @alpha
 */
export interface AIEmbedResponse extends AIResolvedModelInfo {
  /** One embedding per input value, in the same order. */
  embeddings: number[][];
  usage: { tokens: number };
}

/**
 * A request to resolve a model object for advanced runtime integration.
 *
 * @alpha
 */
export interface AIResolveModelRequest<
  TCapability extends AIModelCapability = AIModelCapability,
> extends AIModelSelection {
  capability: TCapability;
}

/**
 * The AI SDK model type returned by `resolveModel` for a capability.
 *
 * @alpha
 */
export type AIResolvedModel<TCapability extends AIModelCapability> =
  TCapability extends 'embeddings' ? EmbeddingModelV3 : LanguageModelV3;

/**
 * Provides access to the AI models configured under `ai.providers`.
 *
 * See {@link https://backstage.io/docs/backend-system/core-services/ai-models | the service docs}
 * for more information.
 *
 * @remarks
 *
 * Requests that cannot be served throw before any model call is made: an
 * `InputError` for an unknown provider instance, a missing `prompt` or
 * `messages`, or a capability that is not enabled on the selected provider,
 * and a `ServiceUnavailableError` when no AI providers are configured.
 *
 * @alpha
 */
export interface AIModelsService {
  /**
   * Generates text with the selected model.
   */
  generateText(request: AIGenerateTextRequest): Promise<AIGenerateTextResponse>;

  /**
   * Streams text from the selected model.
   *
   * @remarks
   *
   * Model selection is validated synchronously, so this throws immediately if
   * the request cannot be served. Errors from the model call itself surface
   * through `textStream` and `response`.
   */
  streamText(request: AIStreamTextRequest): AIStreamTextResponse;

  /**
   * Generates an object that conforms to the given schema.
   */
  generateObject<T>(
    request: AIGenerateObjectRequest<T>,
  ): Promise<AIGenerateObjectResponse<T>>;

  /**
   * Generates embeddings for the given values.
   */
  embed(request: AIEmbedRequest): Promise<AIEmbedResponse>;

  /**
   * Resolves an AI SDK model object for advanced runtime integration.
   *
   * @remarks
   *
   * This is intended for runtimes that already understand AI SDK models.
   * Ordinary consumers should use the other methods of this service, which
   * don't expose AI SDK types. The same selection rules and capability gates
   * apply.
   */
  resolveModel<TCapability extends AIModelCapability>(
    request: AIResolveModelRequest<TCapability>,
  ): Promise<AIResolvedModel<TCapability>>;
}
