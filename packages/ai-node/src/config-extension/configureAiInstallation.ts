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

import type { Knex } from 'knex';
import type { Credential } from '@earendil-works/pi-ai';
import type { ConfigAtPath } from '../contracts';
import { createCredentialStores } from '../credentials/createCredentialStores';
import { createCredentialRotation } from '../credentials/rotation';
import type { AiCredentialStores } from '../credentials/types';
import { parseAiInstallationConfig } from './parseInstallationConfig';
import type { ConfiguredAiInstallation } from './types';

/**
 * Options for {@link configureAiInstallation}.
 *
 * @alpha
 */
export interface ConfigureAiInstallationOptions {
  /** The root config and the path of the installation's AI section. */
  readonly source: ConfigAtPath;
  /** The consuming plugin's Knex client, used for personal credentials. */
  readonly db: Knex;
}

/**
 * Turns installation configuration into the wiring the managed integration
 * consumes: the canonical model catalog, the scoped credential stores, and
 * the user-versus-organization credential precedence.
 *
 * @remarks
 *
 * Without configuration the result keeps the fail-closed default: no
 * credential stores, so every dispatch is denied with an actionable reason,
 * and an empty catalog, so no model resolves. With configuration, absence of a
 * specific entry still fails closed — a missing provider credential or an
 * unlisted model is denied per dispatch and journaled, never replaced by a
 * fallback.
 *
 * The stores are the same scoped stores used elsewhere in the package, so
 * org and service credentials remain strictly read-only (a modifying callback
 * rejects, `delete` rejects, a no-op `modify` resolves) while personal
 * credentials stay in the encrypted store. Configuration only ever feeds the
 * read-only installation layer.
 *
 * Credential entries are opaque to the config schema; their shape and kind are
 * enforced by the credential store constructor, which rejects the whole
 * configuration with the offending path when an entry is unusable.
 *
 * @alpha
 */
export function configureAiInstallation(
  options: ConfigureAiInstallationOptions,
): ConfiguredAiInstallation {
  const parsed = parseAiInstallationConfig(options.source);
  if (parsed.credentials === undefined) {
    return {
      models: parsed.models,
      credentialPrecedence: 'user-first',
      credentialTokenEndpoints: {},
    };
  }

  const {
    encryptionKey,
    previousEncryptionKey,
    precedence,
    scopes,
    tokenEndpoints,
  } = parsed.credentials;
  let credentialStores: AiCredentialStores;
  try {
    credentialStores = createCredentialStores({
      db: options.db,
      encryptionKey,
      previousEncryptionKey,
      // Opaque config entries become typed credentials here. The cast is
      // discharged by createCredentialStores, which validates and rejects
      // every entry before any store is handed out.
      configCredentials: scopes as unknown as ReadonlyMap<
        string,
        ReadonlyMap<string, Credential>
      >,
    });
  } catch (error) {
    throw new Error(
      `Invalid AI credential configuration at '${options.source.path}': ${
        (error as Error).message
      }`,
    );
  }

  return {
    models: parsed.models,
    credentialStores,
    ...(previousEncryptionKey === undefined
      ? {}
      : {
          credentialRotation: createCredentialRotation({
            db: options.db,
            encryptionKey,
            previousEncryptionKey,
          }),
        }),
    credentialPrecedence: precedence,
    credentialTokenEndpoints: tokenEndpoints,
  };
}
