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

/**
 * Installation-scoped AI configuration, read at the `ai` path by the default
 * `aiServiceRef` factory.
 *
 * @remarks
 *
 * The `ai` section configures the canonical model catalog and the
 * installation credentials; a host that wires the integration itself can
 * pass any other path to `configureAiInstallation`. Both sections are
 * optional and fail closed: without `ai.credentials` no credential stores
 * are wired, and without `ai.models` no model resolves — a missing entry is
 * a journaled, actionable denial, never a fallback.
 *
 * ```yaml
 * ai:
 *   credentials:
 *     # Standard base64 of exactly 32 raw bytes, kept in an app-config secret.
 *     encryptionKey: ${AI_CREDENTIAL_ENCRYPTION_KEY}
 *     # `user-first` (default) or `org-first`.
 *     precedence: user-first
 *     scopes:
 *       org:
 *         anthropic:
 *           type: api_key
 *           key: ${ANTHROPIC_API_KEY}
 *       service:catalog-indexer:
 *         openai:
 *           type: oauth
 *           refresh: ...
 *           access: ...
 *           expires: 1234
 *   models:
 *     - provider: openai
 *       modelId: gpt-5
 *       # Adapter identifier of a provider module; the guard certifies it.
 *       api: openai-responses
 *       baseUrl: https://api.openai.com/v1
 *       contextWindow: 400000
 *       maxTokens: 128000
 *       name: GPT-5 # optional, defaults to modelId
 *       reasoning: true # optional, defaults to false
 *       input: [text, image] # optional, defaults to [text]
 *       cost: { input: 1.25, output: 10, cacheRead: 0.125 } # unset rates are 0
 * ```
 *
 * `encryptionKey` is required whenever `ai.credentials` exists. `scopes`
 * accepts exactly `org` and `service:<id>`; user scopes are rejected because
 * personal credentials live in the encrypted store written by the login
 * flow, and the installation stores are read-only. Credential entries are
 * opaque: the credential kind and its fields are interpreted by the
 * credential stores and provider modules that consume them. `precedence`
 * selects which scope wins when both a personal and an installation
 * credential exist; absence falls through to the next scope while a failed
 * read fails closed. `models` is the canonical catalog: the only models this
 * installation may dispatch, with `contextWindow` and `maxTokens` required
 * because the engine derives sizing and compaction from them. Unknown
 * fields, duplicate models, unusable adapter identifiers, non-http(s)
 * destinations and malformed scope keys all reject at startup with the exact
 * configuration path and corrective guidance.
 *
 * Each consuming plugin additionally chooses its own agent configuration
 * path and passes the root config plus that path to `openHarness` — there is
 * no required `ai.plugins.*` or `<pluginId>.ai` namespace. The schema at a
 * plugin-selected path is:
 *
 * ```yaml
 * <plugin-chosen-path>:
 *   mode: service | interactive
 *   model:
 *     provider: <provider-id>
 *     modelId: <model-id>
 *   thinkingLevel: off | minimal | low | medium | high | xhigh | max
 * ```
 *
 * `mode: service` requires `model.provider` and `model.modelId`.
 */
export interface Config {}
