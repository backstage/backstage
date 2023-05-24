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
  createServiceFactory,
  coreServices,
  LifecycleServiceStartupHook,
  LifecycleServiceStartupOptions,
  LifecycleServiceShutdownHook,
  LifecycleServiceShutdownOptions,
  RootLifecycleService,
  LoggerService,
} from '@backstage/backend-plugin-api';

/** @internal */
export class BackendLifecycleImpl implements RootLifecycleService {
  constructor(private readonly logger: LoggerService) {}

  #hasStarted = false;
  #startupTasks: Array<{
    hook: LifecycleServiceStartupHook;
    options?: LifecycleServiceStartupOptions;
  }> = [];

  addStartupHook(
    hook: LifecycleServiceStartupHook,
    options?: LifecycleServiceStartupOptions,
  ): void {
    this.#startupTasks.push({ hook, options });
  }

  async startup(): Promise<void> {
    if (this.#hasStarted) {
      return;
    }
    this.#hasStarted = true;

    this.logger.info(`Running ${this.#startupTasks.length} startup tasks...`);
    await Promise.all(
      this.#startupTasks.map(async ({ hook, options }) => {
        const logger = options?.logger ?? this.logger;
        try {
          await hook();
          logger.info(`Startup hook succeeded`);
        } catch (error) {
          logger.error(`Startup hook failed, ${error}`);
        }
      }),
    );
  }

  #hasShutdown = false;
  #shutdownTasks: Array<{
    hook: LifecycleServiceShutdownHook;
    options?: LifecycleServiceShutdownOptions;
  }> = [];

  addShutdownHook(
    hook: LifecycleServiceShutdownHook,
    options?: LifecycleServiceShutdownOptions,
  ): void {
    this.#shutdownTasks.push({ hook, options });
  }

  async shutdown(): Promise<void> {
    if (this.#hasShutdown) {
      return;
    }
    this.#hasShutdown = true;

    this.logger.info(`Running ${this.#shutdownTasks.length} shutdown tasks...`);
    await Promise.all(
      this.#shutdownTasks.map(async ({ hook, options }) => {
        const logger = options?.logger ?? this.logger;
        try {
          await hook();
          logger.info(`Shutdown hook succeeded`);
        } catch (error) {
          logger.error(`Shutdown hook failed, ${error}`);
        }
      }),
    );
  }
}

/**
 * Allows plugins to register shutdown hooks that are run when the process is about to exit.
 *
 * @public
 */
export const rootLifecycleServiceFactory = createServiceFactory({
  service: coreServices.rootLifecycle,
  deps: {
    logger: coreServices.rootLogger,
  },
  async factory({ logger }) {
    return new BackendLifecycleImpl(logger);
  },
});
