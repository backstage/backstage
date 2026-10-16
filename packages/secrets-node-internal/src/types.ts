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
 * The consumer must call {@link ResolvedSecret.dispose} at its own lifecycle
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
 * Trusted context describing the consumer performing a resolve.
 *
 * @remarks
 *
 * This is derived from the plugin-scoped resolver instance, never from a
 * caller-supplied argument or from the {@link SecretReference}, so it cannot be
 * spoofed by a template or other caller.
 *
 * @public
 */
export interface SecretConsumerContext {
  /** Id of the plugin that owns the resolver instance. */
  pluginId: string;
}

/**
 * The request a {@link SecretProvider} receives for a single resolve.
 *
 * @public
 */
export interface SecretProviderResolveRequest {
  /** The opaque, provider-specific payload from the {@link SecretReference}. */
  reference: JsonObject;
  /** Trusted information about the consumer. */
  consumer: SecretConsumerContext;
}

/**
 * A single secret provider, selected by its unique {@link SecretProvider.id}.
 *
 * @public
 */
export interface SecretProvider {
  /** Unique id used to route a {@link SecretReference} to this provider. */
  readonly id: string;
  /** Resolves the provider-specific reference to a live value. */
  resolve(request: SecretProviderResolveRequest): Promise<ResolvedSecret>;
}

/**
 * Options for {@link SecretResolverService.resolve}.
 *
 * @public
 */
export interface SecretResolverResolveOptions {
  /** The administrator-configured reference to resolve. */
  reference: SecretReference;
}

/**
 * Provider-agnostic service that resolves a {@link SecretReference} to a live
 * value through a registered {@link SecretProvider}.
 *
 * @remarks
 *
 * A resolve handles a single reference. A consumer that resolves several
 * references is responsible for disposing the handles it already holds if a
 * later resolve fails.
 *
 * @public
 */
export interface SecretResolverService {
  resolve(options: SecretResolverResolveOptions): Promise<ResolvedSecret>;
}
