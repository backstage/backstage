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
 * The name of the global object used to pass shared dependencies from the CLI to the module federation runtime.
 *
 * @public
 */
export const BACKSTAGE_RUNTIME_SHARED_DEPENDENCIES_GLOBAL =
  '__@backstage/module_federation_shared_dependencies__';

/**
 * Shared dependencies configuration in module federation remote modules.
 *
 * @public
 */
export type RemoteSharedDependencies = {
  [name: string]: {
    /** Whether to share this dependency as a singleton */
    singleton: boolean;
    /** Whether to load this dependency eagerly */
    eager: boolean;
    /** Provided module for fallback. Set to false to not provide a fallback, or a custom import path. */
    import?: false | string;
    /** Required version range. */
    requiredVersion: string;
  };
};

/**
 * Shared dependencies configuration in module federation host modules.
 *
 * @public
 */
export type HostSharedDependencies = {
  [name: string]: {
    /** Whether to share this dependency as a singleton */
    singleton: boolean;
    /** Whether to load this dependency eagerly */
    eager: boolean;
    /** Required version range. */
    requiredVersion: string;
    /** Version of the shared dependency. Will be resolved at build time by default but can be overridden, but not completely removed. */
    version?: string;
  };
};

/**
 * A single shared runtime dependency from the CLI that has been loaded and ready to be used in the module federation runtime.
 *
 * @public
 */
export type LoadedRuntimeSharedDependency = {
  version: string;
  lib: () => unknown;
  shareConfig: HostSharedDependencies[string];
};

/**
 * The global object used to pass shared dependencies from the CLI to the module federation runtime.
 *
 * @remarks
 *
 * Stored in {@link BACKSTAGE_RUNTIME_SHARED_DEPENDENCIES_GLOBAL}.
 *
 * @public
 */
export type RuntimeSharedDependenciesGlobal = {
  items: Array<{
    name: string;
    version: string;
    lib: () => Promise<unknown>;
    shareConfig: {
      singleton: boolean;
      requiredVersion: string;
      eager: boolean;
    };
  }>;
  version: 'v1';
};
