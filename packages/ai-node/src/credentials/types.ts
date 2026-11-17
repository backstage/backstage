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

import type { BackstageUserPrincipal } from '@backstage/backend-plugin-api';
import type {
  AuthOperationOptions,
  Credential,
  CredentialStore,
} from '@earendil-works/pi-ai';
import type { Knex } from 'knex';

/**
 * The account a set of provider credentials belongs to.
 *
 * `org` and `service:<id>` are installation owned and read-only. `user:<id>` is
 * personal and backed by the encrypted store.
 *
 * @alpha
 */
export type CredentialScope =
  | Readonly<{ kind: 'org' }>
  | Readonly<{ kind: 'user'; id: string }>
  | Readonly<{ kind: 'service'; id: string }>;

/**
 * Future seam for credentials that live outside this package, such as a
 * Keycloak or Vault backed personal account.
 *
 * There is no implementation in this release, and no precedence or fallback
 * policy is defined by this type alone. A host that implements it must resolve
 * only for a verified caller and must not grant Backstage authority.
 *
 * @alpha
 */
export interface UserCredentialProvider {
  resolve(
    user: BackstageUserPrincipal,
    providerId: string,
    options?: AuthOperationOptions,
  ): Promise<Credential | undefined>;
}

/**
 * Provides Pi credential store instances bound to a single scope.
 *
 * @alpha
 */
export interface AiCredentialStores {
  forScope(scope: CredentialScope): CredentialStore;
}

/**
 * Input for {@link createCredentialStores}.
 *
 * `configCredentials` is produced by trusted host config-secret parsing. Its
 * outer key is exactly `org` or `service:<id>`, its inner keys are provider
 * IDs.
 *
 * @alpha
 */
export interface CredentialStoresOptions {
  readonly db: Knex;
  readonly encryptionKey: Uint8Array;
  readonly configCredentials: ReadonlyMap<
    string,
    ReadonlyMap<string, Credential>
  >;
}
