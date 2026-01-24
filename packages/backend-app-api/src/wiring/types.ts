/*
 * Copyright 2022 The Backstage Authors
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

import {
  BackendFeature,
  ExtensionPoint,
  ServiceRef,
  ServiceFactory,
} from '@backstage/backend-plugin-api';

/**
 * @public
 */
export interface Backend {
  add(feature: BackendFeature | Promise<{ default: BackendFeature }>): void;
  start(): Promise<{ result: BackendStartupResult }>;
  stop(): Promise<void>;
}

/**
 * @public
 */
export interface CreateSpecializedBackendOptions {
  defaultServiceFactories: ServiceFactory[];
}

/**
 * @public
 */
export type ServiceOrExtensionPoint<T = unknown> =
  | ExtensionPoint<T>
  | ServiceRef<T>;

/**
 * Result of a module startup attempt.
 * @public
 */
export interface ModuleStartupResult {
  /**
   * The time the module startup was completed.
   */
  resultAt: Date;

  /**
   * The ID of the module.
   */
  moduleId: string;

  /**
   * If the startup failed, this contains information about the failure.
   */
  failure?: {
    /**
     * The error that occurred during startup, if any.
     */
    error: Error;
    /**
     * Whether the failure was allowed.
     */
    allowed: boolean;
  };
}

/**
 * Result of a plugin startup attempt.
 * @public
 */
export interface PluginStartupResult {
  /**
   * The time the plugin startup was completed.
   */
  resultAt: Date;
  /**
   * If the startup failed, this contains information about the failure.
   */
  failure?: {
    /**
     * The error that occurred during startup, if any.
     */
    error: Error;
    /**
     * Whether the failure was allowed.
     */
    allowed: boolean;
  };
  /**
   * The ID of the plugin.
   */
  pluginId: string;
  /**
   * Results for all modules belonging to this plugin.
   */
  modules: ModuleStartupResult[];
}

/**
 * Result of a backend startup attempt.
 * @public
 */
export interface BackendStartupResult {
  /**
   * The time the backend startup started.
   */
  beginAt: Date;
  /**
   * The time the backend startup was completed.
   */
  resultAt: Date;
  /**
   * Results for all plugins that were attempted to start.
   */
  plugins: PluginStartupResult[];
  /**
   * The outcome of the backend startup.
   */
  outcome: 'success' | 'failure';
}
