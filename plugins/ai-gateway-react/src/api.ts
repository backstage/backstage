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

import { createApiRef } from '@backstage/core-plugin-api';
import { JsonObject, JsonValue } from '@backstage/types';

/**
 * A message in a conversation.
 *
 * @public
 */
export interface AiGatewayMessage {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * Token usage of an AI request.
 *
 * @public
 */
export interface AiGatewayUsage {
  inputTokens: number;
  outputTokens: number;
}

/**
 * Options shared by all AI gateway requests. Provide exactly one of `prompt`
 * and `messages`.
 *
 * @public
 */
export interface AiGatewayTextRequest {
  /** The configured provider ID. Defaults to the default provider. */
  provider?: string;
  /** A concrete model ID or a configured model alias. */
  model?: string;
  system?: string;
  prompt?: string;
  messages?: AiGatewayMessage[];
}

/**
 * A request to generate a structured object.
 *
 * @public
 */
export interface AiGatewayObjectRequest extends AiGatewayTextRequest {
  /** A JSON Schema describing the object to generate. */
  schema: JsonObject;
}

/**
 * The result of generating text.
 *
 * @public
 */
export interface AiGatewayTextResponse {
  text: string;
  finishReason: string;
  usage: AiGatewayUsage;
}

/**
 * The result of generating an object.
 *
 * @public
 */
export interface AiGatewayObjectResponse<T = JsonValue> {
  object: T;
  finishReason: string;
  usage: AiGatewayUsage;
}

/**
 * A stream of generated text. Has the same shape as the result of the
 * backend AI models service.
 *
 * @public
 */
export interface AiGatewayStream {
  textStream: AsyncIterable<string>;
  response: Promise<{ finishReason: string; usage: AiGatewayUsage }>;
}

/**
 * Frontend access to the operator-configured AI models of the backend.
 *
 * @public
 */
export interface AiGatewayApi {
  generateText(request: AiGatewayTextRequest): Promise<AiGatewayTextResponse>;

  /**
   * The schema is not validated server-side, and the returned object is only
   * as reliable as the model's output, so validate it before use.
   */
  generateObject<T = JsonValue>(
    request: AiGatewayObjectRequest,
  ): Promise<AiGatewayObjectResponse<T>>;

  streamText(
    request: AiGatewayTextRequest,
    options?: { signal?: AbortSignal },
  ): AiGatewayStream;
}

/**
 * The API reference of the {@link AiGatewayApi}.
 *
 * @public
 */
export const aiGatewayApiRef = createApiRef<AiGatewayApi>({
  id: 'plugin.ai-gateway.service',
});
