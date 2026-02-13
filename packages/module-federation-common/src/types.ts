/*
 * Copyright 2025 The Backstage Authors
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

/**
 * Generic type for shared dependencies configuration in module federation.
 *
 * The ContextFields type parameter is used to provide additional fields
 * to the shared dependencies configuration according to the context.
 *
 * @public
 */
export type SharedDependencies<ContextFields> = {
  [name: string]: {
    /** Whether this dependency should be a singleton */
    singleton?: boolean;
  } & ContextFields;
};

/**
 * Specific fields for shared dependencies configured in module federation remote modules.
 *
 * @public
 */
export type Remote = {
  /** Provided module for fallback. Set to false to not provide a fallback, or a custom import path. */
  import?: false | string;
  /** Required version range. Optional for remotes - can be auto-filled from package.json at build time. */
  requiredVersion?: false | string;
  /** Version of the shared dependency. Will be resolved at build time by default but can be overridden, but not completely removed. */
  version?: false | string;
};

/**
 * Specific fields for shared dependencies configured in the module federation host.
 *
 * @public
 */
export type Host = {
  /** Whether to load this dependency eagerly */
  eager?: boolean;
  /** Required version range. Required for host. */
  requiredVersion: false | string;
  /** Version of the shared dependency. Will be resolved at build time by default but can be overridden, but not completely removed. */
  version?: string;
};

/**
 * Specific fields for shared dependencies configured when bootstrapping the module federation host at runtime.
 *
 * @internal
 */
export type Runtime = {
  // version is always expected for runtime host dependencies
  version: string;
  module: () => Promise<any>;
};
