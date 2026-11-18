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

import { ConfigCredentialStore } from './ConfigCredentialStore';
import { EncryptedUserCredentialStore } from './EncryptedUserCredentialStore';
import { assertEncryptionKey } from './encryption';
import { parseConfigCredentials, scopeKeyOf } from './identifiers';
import type {
  AiCredentialStores,
  CredentialScope,
  CredentialStoresOptions,
} from './types';

/**
 * Creates scope-bound Pi credential stores.
 *
 * `org` and `service:<id>` scopes are read-only views of installation
 * configuration secrets. A `user:<id>` scope is backed by the encrypted
 * database store, so personal credentials can be written and rotated.
 *
 * Selecting the scope, and therefore the user identity, is the host's
 * responsibility: this factory neither authenticates a caller nor authorizes a
 * scope.
 *
 * @alpha
 */
export function createCredentialStores(
  options: CredentialStoresOptions,
): AiCredentialStores {
  if (typeof options !== 'object' || options === null) {
    throw new Error('Invalid credential store options: expected an object');
  }
  const { db } = options;
  if (typeof db !== 'function') {
    throw new Error(
      'Invalid credential store options: db must be a Knex client',
    );
  }
  const encryptionKey = assertEncryptionKey(options.encryptionKey);
  const previousEncryptionKey =
    options.previousEncryptionKey === undefined
      ? undefined
      : assertEncryptionKey(options.previousEncryptionKey);
  const configScopes = parseConfigCredentials(options.configCredentials);

  return {
    forScope(scope: CredentialScope) {
      const scopeKey = scopeKeyOf(scope);
      switch (scope.kind) {
        case 'org':
        case 'service':
          return new ConfigCredentialStore(
            scope,
            configScopes.get(scopeKey) ?? new Map(),
          );
        case 'user':
          return new EncryptedUserCredentialStore({
            db,
            encryptionKey,
            previousEncryptionKey,
            scopeKey,
          });
        default:
          // Unreachable through the type, reachable from untyped callers.
          throw new Error(
            `Unsupported credential scope kind: ${JSON.stringify(
              (scope as { kind?: unknown }).kind,
            )}`,
          );
      }
    },
  };
}
