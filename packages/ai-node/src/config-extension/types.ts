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

import type { JsonValue } from '@backstage/config';
import type { AnyModel } from '@earendil-works/pi-ai';
import type { AiCredentialStores } from '../credentials/types';
import type { ConfiguredCredentialKind } from '../credentials/configCredentialKinds';
import type { Fence } from '../contracts';

/**
 * Installation default for the path of the AI installation configuration.
 *
 * @remarks
 *
 * This is installation-scoped configuration, not the per-plugin agent
 * configuration chosen by each consuming plugin: every plugin still selects
 * its own `mode`/`model` path. A host that wants a different installation
 * path passes it to {@link configureAiInstallation} explicitly.
 *
 * @alpha
 */
export const AI_INSTALLATION_CONFIG_PATH = 'ai';

/**
 * One provider's trusted OAuth refresh endpoint.
 *
 * @remarks
 * `url` is an absolute `https` URL on the reserved `/oauth/token` or
 * `/v1/oauth/token` route of the provider's own origin, without query,
 * fragment or userinfo. `clientId` is the public OAuth client ID the family
 * exchanges with — public by contract, never a secret, which is why it lives in
 * configuration rather than a store.
 *
 * @alpha
 */
export type AiTokenEndpoint = Readonly<{ url: string; clientId: string }>;

/**
 * Which credential scope wins when both a personal and an installation
 * credential exist for the same provider.
 *
 * @remarks
 *
 * Absence always falls through to the next scope; a failed read never does.
 * `user-first` is the default: a caller's own provider account is preferred,
 * and installations without personal credentials behave exactly like
 * `org-first`.
 *
 * @alpha
 */
export type AiCredentialsPrecedence = 'user-first' | 'org-first';

/**
 * Opaque, provider-scoped credential entries from installation config.
 *
 * @remarks
 *
 * The outer key is exactly `org` or `service:<id>`; the inner key is a
 * provider ID and the value is the provider's own credential entry. This
 * schema deliberately does not interpret credential kinds: static keys,
 * OAuth credentials and future credential kinds are all owned by the modules
 * that consume them, and the credential store constructors enforce the shape
 * they accept.
 *
 * @alpha
 */
export type AiConfigCredentialScopes = ReadonlyMap<
  string,
  ReadonlyMap<string, JsonValue>
>;

/**
 * Parsed installation credential configuration.
 *
 * @alpha
 */
export type AiInstallationCredentials = Readonly<{
  /** Raw 32-byte authenticated-encryption key for personal credentials. */
  encryptionKey: Uint8Array;
  /** Previous personal credential key, accepted only during rotation. */
  previousEncryptionKey?: Uint8Array;
  precedence: AiCredentialsPrecedence;
  scopes: AiConfigCredentialScopes;
  /**
   * Trusted OAuth token endpoints for guarded auth operations, keyed by
   * provider ID.
   *
   * @remarks
   *
   * Each provider's trusted endpoint (`url` on the journal-owned
   * `/oauth/token` or `/v1/oauth/token` route of its own origin) with the
   * public `clientId` its refresh exchanges with. The host passes them to
   * `createAuthOperations({ tokenEndpoints })`; a request to any other origin
   * is denied before it is sent, and empty means no guarded auth operations.
   */
  tokenEndpoints: Readonly<Record<string, AiTokenEndpoint>>;
}>;

/**
 * Parsed AI installation configuration at one configuration path.
 *
 * @remarks
 *
 * `credentials` is absent when the installation configures none, which keeps
 * the fail-closed default: every dispatch is denied with an actionable
 * reason. `models` is the canonical catalog: the only models that may be
 * dispatched by this installation, keyed by `provider` and `id`.
 *
 * @alpha
 */
export type AiInstallationConfig = Readonly<{
  credentials?: AiInstallationCredentials;
  models: readonly AnyModel[];
}>;

/**
 * The integration wiring this configuration produces.
 *
 * @alpha
 */
export type ConfiguredAiInstallation = Readonly<{
  models: readonly AnyModel[];
  credentialStores?: AiCredentialStores;
  /**
   * Re-encrypts personal credentials for this plugin's database during a key
   * rotation. Only trusted hosts holding a live fence may invoke this operation.
   * It reports counts, never credential contents. The default AiService does
   * not expose a fence for maintenance operations.
   */
  credentialRotation?: Readonly<{
    rotate(fence: Fence): Promise<{ inspected: number; rotated: number }>;
  }>;
  credentialPrecedence: AiCredentialsPrecedence;
  /**
   * Trusted token endpoints per provider for guarded auth operations, each
   * with the public client ID its family's refresh exchanges with.
   */
  credentialTokenEndpoints: Readonly<Record<string, AiTokenEndpoint>>;
  /**
   * The kinds the configuration declares per provider, so composition can
   * reject one no registered module for that provider consumes.
   */
  configCredentialKinds?: readonly ConfiguredCredentialKind[];
}>;
