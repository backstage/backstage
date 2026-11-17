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

/** All unlisted APIs and operation/transport combinations are denied. */
export const MODEL_HTTP_MATRIX = Object.freeze({
  operations: Object.freeze({
    stream: true,
    complete: true,
    streamSimple: true,
    completeSimple: true,
    streamDeferred: false,
    fetchDeferred: false,
    cancelDeferred: false,
    classify: false,
    generateImages: false,
  }),
  apis: Object.freeze({
    'openai-responses': 'http',
    'openai-completions': 'http',
    'azure-openai-responses': 'http',
    'anthropic-messages': 'http',
    'openai-codex-responses': 'sse',
  }),
  denied: Object.freeze({
    bedrock: 'no guarded transport seam',
    codexAuto: 'websocket may bypass fetch',
    codexWebSocket: 'no guarded transport seam',
    unverifiedProvenance: 'managed admission not verified',
    unlistedCombinations: 'not certified',
  }),
  authentication: Object.freeze({
    apiKey: 'allowed',
    unexpiredOAuth: 'allowed',
    nativeOAuthRefresh: 'denied',
    // Exchange remains denied until its complete transport and journal path is certified.
    anthropicFederation: 'denied',
  }),
  sdkQueryParams: Object.freeze({
    'anthropic-messages': Object.freeze({ beta: 'true' }),
  }),
} as const);
