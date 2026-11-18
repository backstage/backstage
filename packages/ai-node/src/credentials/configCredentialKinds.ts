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

import type { AnyModel } from '@earendil-works/pi-ai';
import type { AiCredentialKind, AiProviderModule } from '../providers/types';
import type { AiProviderRegistry } from '../providers/registry';

/**
 * One credential entry as installation configuration declares it, reduced to
 * what composition validation needs.
 *
 * @alpha
 */
export type ConfiguredCredentialKind = Readonly<{
  /** The credential scope key, e.g. `org` or `service:scaffolder`. */
  scope: string;
  providerId: string;
  kind: AiCredentialKind;
}>;

/**
 * Rejects configured credentials whose kind no registered module for that
 * provider consumes, before the service starts.
 *
 * @remarks
 * The check is per provider: every catalog entry of that provider whose module
 * is registered contributes its `credentialKinds`, so a provider that serves
 * both API-key and OAuth families accepts either. Providers with no registered
 * module cannot be validated here and stay dispatch-time fail-closed, because
 * composition does not know what a module that is not registered would accept.
 *
 * @alpha
 */
export function assertConfigCredentialKinds(options: {
  models: readonly AnyModel[];
  providers: AiProviderRegistry;
  configured: readonly ConfiguredCredentialKind[];
}): void {
  if (!options.configured.length) {
    return;
  }
  const supported = new Map<string, Set<AiCredentialKind>>();
  for (const model of options.models) {
    const module: AiProviderModule | undefined = options.providers.get(
      model.api as string,
    );
    if (module === undefined) {
      continue;
    }
    const kinds = supported.get(model.provider) ?? new Set<AiCredentialKind>();
    for (const kind of module.credentialKinds) {
      kinds.add(kind);
    }
    supported.set(model.provider, kinds);
  }
  for (const entry of options.configured) {
    const kinds = supported.get(entry.providerId);
    if (kinds === undefined || kinds.has(entry.kind)) {
      continue;
    }
    const list = [...kinds].sort().join(', ');
    throw new Error(
      `Credential configuration for provider '${entry.providerId}' at scope '${entry.scope}' uses a '${entry.kind}' credential, which no registered module for that provider accepts. Supported credential kinds: ${list}. Change the entry's kind, or register a provider module that consumes '${entry.kind}'`,
    );
  }
}
