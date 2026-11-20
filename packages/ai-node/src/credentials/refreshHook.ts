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

import type { BackstageCredentials } from '@backstage/backend-plugin-api';
import type { Fence } from '../contracts';
import type { AiTokenEndpoint } from '../config-extension/types';
import type { AttemptJournal } from '../journal/types';
import type { AiEventSink } from '../observability/types';
import type { AiProviderModule } from '../providers/types';
import { createAuthOperationGuard } from '../providers/auth/guard';
import { createAuthModuleRegistry } from '../providers/auth/modules';
import { createAuthOperations } from '../providers/auth/operations';
import type { AiAuthOperations } from '../providers/auth/operations';
import type {
  CredentialRefreshHook,
  CredentialRefreshInput,
} from '../integration';
import type { AiCredentialStores, CredentialScope } from './types';

/**
 * Input for {@link createCredentialRefreshHook}.
 *
 * @alpha
 */
export interface CreateCredentialRefreshHookOptions {
  /** The registered provider modules; families that ship an auth module carry it. */
  providerModules: readonly AiProviderModule[];
  /** Trusted token endpoints per provider from installation configuration. */
  tokenEndpoints: Readonly<Record<string, AiTokenEndpoint>>;
  /** The scoped credential stores the rotated credential is written to. */
  stores: AiCredentialStores;
  /** The durable journal every auth attempt is recorded in. */
  journal: AttemptJournal;
  /** Network transport for the guarded token request. Defaults to `fetch`. */
  transport?: typeof fetch;
  /** Observability sink for local denials; no-op when absent. */
  emit?: AiEventSink;
}

/**
 * Assembles the guarded OAuth refresh machinery a hook needs.
 *
 * @remarks
 * Returns `undefined` when the configuration and the registered modules do not
 * line up — an endpoint is declared but no registered family carries an auth
 * module for it. Callers keep their fail-closed expired-credential denial in
 * that case, which names the missing half; nothing here guesses.
 *
 * The returned hook performs one journaled `auth.token` operation per refresh:
 * the token request is envelope-validated against the family's module, sent
 * through the guarded transport, and the rotated credential is written to the
 * scoped store under a fence. A failure (provider rejection, unusable token
 * body) rejects, and the dispatch that awaited it is denied and journaled.
 *
 * Crash window, stated plainly: the remote refresh and the local write are two
 * steps. A process death after the provider rotated the token but before the
 * write commits leaves the store holding the pre-rotation refresh token, which
 * the provider has already invalidated. That is an uncertain rotation: the
 * caller must re-authenticate (or run the store's recovery path) before
 * refreshing again. This hook makes no exactly-once claim across a crash.
 *
 * @alpha
 */
export function createCredentialRefreshHook(
  options: CreateCredentialRefreshHookOptions,
): CredentialRefreshHook | undefined {
  const endpoints = options.tokenEndpoints ?? {};
  const providerIds = Object.keys(endpoints);
  if (providerIds.length === 0) {
    return undefined;
  }
  const modules = createAuthModuleRegistry(
    options.providerModules.flatMap(module =>
      module.authModule === undefined ? [] : [module.authModule],
    ),
  );
  const usable = providerIds.filter(
    providerId => modules.get(providerId) !== undefined,
  );
  if (usable.length === 0) {
    return undefined;
  }
  const operations = createAuthOperations({
    guard: createAuthOperationGuard({
      transport: options.transport ?? fetch,
      recheck: async () => true,
      journal: options.journal,
      ...(options.emit === undefined ? {} : { emit: options.emit }),
      modules,
    }),
    journal: options.journal,
    stores: options.stores,
    modules,
    tokenEndpoints: endpoints,
    ...(options.emit === undefined ? {} : { emit: options.emit }),
  });
  return async (input: CredentialRefreshInput) =>
    refreshWith(operations, input);
}

async function refreshWith(
  operations: AiAuthOperations,
  input: CredentialRefreshInput & {
    credentials: BackstageCredentials;
    scope: CredentialScope;
    fence: Fence;
  },
): Promise<void> {
  await operations.refresh({
    context: {
      actor: input.actor,
      credentials: input.credentials,
      provenance: { origin: 'verified', ...input.provenance },
      fence: input.fence,
      definitionVersion: input.definitionVersion,
      configVersion: input.configVersion,
    },
    scope: input.scope,
    providerId: input.provider,
  });
}
