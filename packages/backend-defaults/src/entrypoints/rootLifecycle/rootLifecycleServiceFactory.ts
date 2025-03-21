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
    if (this.#hasStarted) {
      throw new Error('Attempted to add startup hook after startup');
    }
    this.#startupTasks.push({ hook, options });
  }

  async startup(): Promise<void> {
    if (this.#hasStarted) {
      return;
    }
    this.#hasStarted = true;

    this.logger.debug(`Running ${this.#startupTasks.length} startup tasks...`);
    await Promise.all(
      this.#startupTasks.map(async ({ hook, options }) => {
        const logger = options?.logger ?? this.logger;
        try {
          await hook();
          logger.debug(`Startup hook succeeded`);
        } catch (error) {
          logger.error(`Startup hook failed, ${error}`);
        }
      }),
    );
  }

  #hasBeforeShutdown = false;
  #beforeShutdownTasks: Array<{ hook: () => void | Promise<void> }> = [];

  addBeforeShutdownHook(hook: () => void): void {
    if (this.#hasBeforeShutdown) {
      throw new Error(
        'Attempt to add before shutdown hook after shutdown has started',
      );
    }
    this.#beforeShutdownTasks.push({ hook });
  }

  async beforeShutdown(): Promise<void> {
    if (this.#hasBeforeShutdown) {
      return;
    }
    this.#hasBeforeShutdown = true;

    this.logger.debug(
      `Running ${this.#beforeShutdownTasks.length} before shutdown tasks...`,
    );
    await Promise.all(
      this.#beforeShutdownTasks.map(async ({ hook }) => {
        try {
          await hook();
          this.logger.debug(`Before shutdown hook succeeded`);
        } catch (error) {
          this.logger.error(`Before shutdown hook failed, ${error}`);
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
    if (this.#hasShutdown) {
      throw new Error('Attempted to add shutdown hook after shutdown');
    }
    this.#shutdownTasks.push({ hook, options });
  }

  async shutdown(): Promise<void> {
    if (this.#hasShutdown) {
      return;
    }
    this.#hasShutdown = true;

    this.logger.debug(
      `Running ${this.#shutdownTasks.length} shutdown tasks...`,
    );
    await Promise.all(
      this.#shutdownTasks.map(async ({ hook, options }) => {
        const logger = options?.logger ?? this.logger;
        try {
          await hook();
          logger.debug(`Shutdown hook succeeded`);
        } catch (error) {
          logger.error(`Shutdown hook failed, ${error}`);
        }
      }),
    );
  }
}

/**
 * Registration of backend startup and shutdown lifecycle hooks.
 *
 * See {@link @backstage/code-plugin-api#RootLifecycleService}
 * and {@link https://backstage.io/docs/backend-system/core-services/root-lifecycle | the service docs}
 * for more information.
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
