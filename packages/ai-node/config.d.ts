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
 * a journaled, actionable denial, never a fallback. The runtime validation
 * in `@backstage/ai-node` enforces exact scope keys, duplicate-free model
 * lists, certified adapter identifiers, and reserved token routes; this
 * schema mirrors that contract without loosening it.
 *
 * `ai.credentials.tokenEndpoints` lists, per provider, the absolute `https`
 * URL of the OAuth token route guarded auth operations may use for
 * credential refresh (`/oauth/token` or `/v1/oauth/token` on the provider's
 * own origin). Providers without an entry cannot refresh OAuth credentials;
 * the currently supported auth providers are Anthropic and OpenAI token
 * endpoints.
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
/**
 * A credential entry's value: any JSON-persistable structure, including
 * nested objects such as an api_key credential's `env` map.
 *
 * @visibility secret
 */
export type CredentialValue =
  | string
  | number
  | boolean
  | null
  | CredentialValue[]
  | { [field: string]: CredentialValue };

export interface Config {
  ai?: {
    credentials?: {
      /**
       * Standard base64 of exactly 32 raw bytes; the authenticated-encryption
       * key for the encrypted personal credential store. Supply it through an
       * app-config environment variable, never committed to the file.
       *
       * @visibility secret
       */
      encryptionKey: string;
      /** Previous key during personal credential encryption-key rotation. */
      rotation?: {
        /**
         * Standard base64 of the previous 32-byte personal credential key.
         *
         * @visibility secret
         */
        previousEncryptionKey: string;
      };
      /**
       * Which credential scope wins when both a personal and an installation
       * credential exist for a provider. Defaults to `user-first`.
       */
      precedence?: 'user-first' | 'org-first';
      /**
       * Installation-owned provider credentials by scope. Scope keys are
       * exactly `org` or `service:<id>`; user scopes are rejected because
       * personal credentials live in the encrypted store written by the
       * login flow. The credential entries are opaque: their kind and fields
       * are interpreted by the credential stores and provider modules that
       * consume them, and their values are credential material.
       */
      scopes?: {
        [scopeId: string]: {
          [providerId: string]: {
            /**
             * One opaque credential entry; values are secrets.
             *
             * @visibility secret
             */
            [field: string]: CredentialValue;
          };
        };
      };
      /**
       * Trusted OAuth token routes per provider for guarded auth operations,
       * as absolute `https` URLs on the provider's origin ending in the
       * reserved `/oauth/token` or `/v1/oauth/token` route. Providers
       * without an entry cannot refresh OAuth credentials; the supported
       * auth providers are Anthropic and OpenAI token endpoints.
       */
      tokenEndpoints?: {
        [providerId: string]: string;
      };
    };
    /**
     * The canonical model catalog: the only models this installation may
     * dispatch. `contextWindow` and `maxTokens` are required in tokens; the
     * engine derives sizing and compaction from them and never invents a
     * value.
     */
    models?: Array<{
      provider: string;
      modelId: string;
      /** Certified adapter identifier of a registered provider module. */
      api: string;
      baseUrl: string;
      contextWindow: number;
      maxTokens: number;
      /** Display name; defaults to `modelId`. */
      name?: string;
      reasoning?: boolean;
      input?: string[];
      cost?: {
        input?: number;
        output?: number;
        cacheRead?: number;
        cacheWrite?: number;
      };
    }>;
  };
}
