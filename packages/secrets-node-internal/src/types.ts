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

import type { JsonObject } from '@backstage/types';

/**
 * An administrator-configured, provider-agnostic reference to a secret.
 *
 * @remarks
 *
 * The `provider` field selects a registered {@link SecretProvider} by id. The
 * `reference` is an opaque, provider-specific payload that only the selected
 * provider interprets — the resolver never inspects it. This keeps the shared
 * contract free of any provider's field model (for example a Kubernetes Secret
 * provider uses `namespace`/`name`/`key`, while a Vault provider might use
 * `path`/`key`).
 *
 * @public
 */
export interface SecretReference {
  /** Id of the provider that should resolve this reference. */
  provider: string;
  /** Opaque, provider-specific payload validated by the provider. */
  reference: JsonObject;
}

/**
 * A resolved secret and its lifecycle handle.
 *
 * @remarks
 *
 * The caller must call {@link ResolvedSecret.dispose} at its own lifecycle
 * boundary when a provider supplies one. What disposal means is owned by the
 * provider (for example releasing a lease); for providers that return a static
 * value it may be absent.
 *
 * @public
 */
export interface ResolvedSecret {
  /** The resolved secret value. Never persisted or logged by the resolver. */
  value: string;
  /** When the value is known to expire, if the provider can determine it. */
  expiresAt?: Date;
  /** Releases any resources held for this value. */
  dispose?(): Promise<void>;
}

/**
 * The request a {@link SecretProvider} receives for a single resolve.
 *
 * @public
 */
export interface SecretProviderResolveRequest {
  /** The opaque, provider-specific payload from the {@link SecretReference}. */
  reference: JsonObject;
}

/**
 * A single secret provider, selected by its unique {@link SecretProvider.id}.
 *
 * @public
 */
export interface SecretProvider {
  /** Unique id used to route a {@link SecretReference} to this provider. */
  readonly id: string;
  /**
   * Resolves the provider-specific reference to a live value.
   *
   * @remarks
   *
   * Thrown errors propagate unchanged and may surface in caller logs, so
   * providers must not include the reference payload or resolved value in error
   * messages or metadata. Only the provider knows which parts of its reference
   * are sensitive, so sanitizing failures is the provider's responsibility.
   */
  resolve(request: SecretProviderResolveRequest): Promise<ResolvedSecret>;
}

/**
 * A validated, immutable lookup of the registered {@link SecretProvider}s, keyed
 * by {@link SecretProvider.id}.
 *
 * @remarks
 *
 * The registry is built once per plugin scope from the set of registered
 * providers, rejecting duplicate ids so the resolver only has to route by id.
 *
 * @internal
 */
export interface SecretProviderRegistry {
  /** Returns the provider registered under the given id, if any. */
  getProvider(id: string): SecretProvider | undefined;
}

/**
 * Options for {@link SecretsService.resolve}.
 *
 * @public
 */
export interface SecretsResolveOptions {
  /** The administrator-configured reference to resolve. */
  reference: SecretReference;
}

/**
 * Provider-agnostic service that resolves a {@link SecretReference} to a live
 * value through a registered {@link SecretProvider}.
 *
 * @remarks
 *
 * A resolve handles a single reference. A caller that resolves several
 * references is responsible for disposing the handles it already holds if a
 * later resolve fails.
 *
 * @public
 */
export interface SecretsService {
  resolve(options: SecretsResolveOptions): Promise<ResolvedSecret>;
}
