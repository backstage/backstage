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
  LifecycleServiceShutdownHook,
  LifecycleServiceShutdownOptions,
  RootLifecycleService,
  LoggerService,
} from '@backstage/backend-plugin-api';

export class BackendLifecycleImpl implements RootLifecycleService {
  constructor(private readonly logger: LoggerService) {}

  #isCalled = false;
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
    if (this.#isCalled) {
      return;
    }
    this.#isCalled = true;

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
