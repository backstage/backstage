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

import { ConflictError } from '@backstage/errors';
import type { SecretProvider, SecretProviderRegistry } from './types';

/**
 * Builds a {@link SecretProviderRegistry} from the registered providers,
 * rejecting duplicate ids.
 *
 * @remarks
 *
 * Each plugin that uses the secrets service builds its own registry from its
 * provider instances. Duplicate ids cause a {@link ConflictError} for each
 * affected plugin; plugins do not compete for a shared registry.
 */
export function createSecretProviderRegistry(
  providers: SecretProvider[],
): SecretProviderRegistry {
  const byId = new Map<string, SecretProvider>();
  for (const provider of providers) {
    if (byId.has(provider.id)) {
      throw new ConflictError(
        `Duplicate secret provider registered with id '${provider.id}'`,
      );
    }
    byId.set(provider.id, provider);
  }

  return {
    getProvider(id) {
      return byId.get(id);
    },
  };
}
