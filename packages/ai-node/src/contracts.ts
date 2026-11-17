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

import type { Config } from '@backstage/config';
import type { BackstageCredentials } from '@backstage/backend-plugin-api';
import type { Context } from '@earendil-works/chord/context';
import type { Harness, RegistryReader } from '@earendil-works/pi-durable';

/**
 * The storage and ownership namespace of one managed AI session.
 *
 * @remarks
 *
 * The namespace is `(pluginMetadata.getId(), sessionId)`: the trusted
 * plugin ID of the consuming plugin, never a caller-selected plugin ID, paired
 * with the caller's stable application session identifier.
 *
 * @alpha
 */
export type Namespace = Readonly<{ pluginId: string; sessionId: string }>;

/**
 * Proof that a writer holds the current lease of a namespace.
 *
 * @remarks
 *
 * The token is a monotonically increasing database value represented as a
 * decimal string; see the module design for the lease protocol. Wave 0 ships
 * no lease implementation; this type reserves the integration contract.
 *
 * @alpha
 */
export type Fence = Readonly<{
  namespace: Namespace;
  owner: string;
  token: string;
}>;

/**
 * An explicit choice of where a plugin's AI configuration lives in app-config.
 *
 * @remarks
 *
 * There is no implicit or required `ai.*` configuration path; every consumer
 * supplies its own root config and path, and configuration errors name the
 * consuming plugin, the exact path, the offending field, and a correction.
 *
 * @alpha
 */
export type ConfigAtPath = Readonly<{ root: Config; path: string }>;

/**
 * The mediated view of a native Pi harness exposed on a managed handle.
 *
 * @remarks
 *
 * This is not the raw Pi `Harness`: `close` is never exposed, operations are
 * mediated by ownership and lifecycle, and methods on a released handle
 * reject. The underlying type is Pi-facing and therefore alpha.
 *
 * @alpha
 */
export type ManagedNativeHarness = Omit<Harness, 'close'>;

/**
 * Options for {@link AiService.openHarness}.
 *
 * @alpha
 */
export type OpenHarnessOptions = Readonly<{
  sessionId: string;
  config: ConfigAtPath;
  credentials: BackstageCredentials;
  registry: RegistryReader;
  registryVersion: string;
}>;

/**
 * An acquired, reference-counted handle to a process-local shared harness.
 *
 * @remarks
 *
 * Release is idempotent per acquisition and never cancels admitted durable
 * work; methods on the mediated harness reject after release.
 *
 * @alpha
 */
export interface ManagedHarness {
  readonly harness: ManagedNativeHarness;
  readonly context: Context;
  release(): Promise<void>;
}

/**
 * The managed, low-level Pi Durable primitive for backend plugins.
 *
 * @alpha
 */
export interface AiService {
  openHarness(options: OpenHarnessOptions): Promise<ManagedHarness>;
}
