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

import { isDeepStrictEqual } from 'node:util';
import type {
  AuthOperationOptions,
  Credential,
  CredentialInfo,
  CredentialStore,
} from '@earendil-works/pi-ai';
import { assertIdentifier } from './identifiers';
import type { CredentialScope } from './types';

/**
 * Read-only Pi credential store backed by installation configuration secrets.
 *
 * Org and service credentials are owned by the installation, so they support
 * `read` and `list` only. `modify` accepts a callback that leaves the value
 * unchanged and rejects everything else; `delete` always rejects. This store
 * therefore never rotates an OAuth credential and must not be presented as
 * supporting OAuth refresh.
 */
export class ConfigCredentialStore implements CredentialStore {
  readonly #credentials: ReadonlyMap<string, Credential>;
  readonly #scope: CredentialScope;

  constructor(
    scope: CredentialScope,
    credentials: ReadonlyMap<string, Credential>,
  ) {
    this.#scope = scope;
    this.#credentials = credentials;
  }

  async read(
    providerId: string,
    options?: AuthOperationOptions,
  ): Promise<Credential | undefined> {
    const id = assertIdentifier(providerId, 'provider ID');
    options?.signal?.throwIfAborted();
    const credential = this.#credentials.get(id);
    return credential === undefined ? undefined : clone(credential);
  }

  async list(
    options?: AuthOperationOptions,
  ): Promise<readonly CredentialInfo[]> {
    options?.signal?.throwIfAborted();
    return Array.from(this.#credentials, ([providerId, credential]) => ({
      providerId,
      type: credential.type,
    }));
  }

  async modify(
    providerId: string,
    fn: (current: Credential | undefined) => Promise<Credential | undefined>,
    options?: AuthOperationOptions,
  ): Promise<Credential | undefined> {
    const id = assertIdentifier(providerId, 'provider ID');
    options?.signal?.throwIfAborted();

    const current = this.#credentials.get(id);
    const next = await fn(current === undefined ? undefined : clone(current));
    if (next === undefined) {
      return current === undefined ? undefined : clone(current);
    }
    if (current !== undefined && isDeepStrictEqual(next, current)) {
      return clone(current);
    }
    throw new Error(
      `Credential for ${describeScope(
        this.#scope,
      )}/${id} is configured by installation secrets and is read-only`,
    );
  }

  async delete(
    providerId: string,
    options?: AuthOperationOptions,
  ): Promise<void> {
    const id = assertIdentifier(providerId, 'provider ID');
    options?.signal?.throwIfAborted();
    throw new Error(
      `Credential for ${describeScope(
        this.#scope,
      )}/${id} is configured by installation secrets and cannot be deleted`,
    );
  }
}

function clone(credential: Credential): Credential {
  return structuredClone(credential);
}

function describeScope(scope: CredentialScope): string {
  return scope.kind === 'org' ? 'org' : `${scope.kind}:${scope.id}`;
}
