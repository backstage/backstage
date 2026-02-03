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

import { LoggerService } from './LoggerService';

/**
 * @public
 */
export type LifecycleServiceStartupHook = () => void | Promise<void>;

/**
 * @public
 */
export interface LifecycleServiceStartupOptions {
  /**
   * Optional {@link LoggerService} that will be used for logging instead of the default logger.
   */
  logger?: LoggerService;
}

/**
 * @public
 */
export type LifecycleServiceShutdownHook = () => void | Promise<void>;

/**
 * @public
 */
export interface LifecycleServiceShutdownOptions {
  /**
   * Optional {@link LoggerService} that will be used for logging instead of the default logger.
   */
  logger?: LoggerService;
}

/**
 * Provides registration of plugin startup and shutdown lifecycle hooks.
 *
 * See the {@link https://backstage.io/docs/backend-system/core-services/lifecycle | service documentation} for more details.
 *
 * @public
 */
export interface LifecycleService {
  /**
   * Register a function to be called when the backend has been initialized.
   *
   * @remarks
   *
   * When used with plugin scope it will wait for the plugin itself to have been initialized.
   *
   * When used with root scope it will wait for all plugins to have been initialized.
   */
  addStartupHook(
    hook: LifecycleServiceStartupHook,
    options?: LifecycleServiceStartupOptions,
  ): void;

  /**
   * Register a function to be called when the backend is shutting down.
   */
  addShutdownHook(
    hook: LifecycleServiceShutdownHook,
    options?: LifecycleServiceShutdownOptions,
  ): void;
}
