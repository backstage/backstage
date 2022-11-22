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
  BackendLifecycle,
  createServiceFactory,
  lifecycleServiceRef,
  loggerToWinstonLogger,
  pluginMetadataServiceRef,
  rootLoggerServiceRef,
  BackendLifecycleShutdownHook,
} from '@backstage/backend-plugin-api';
import { Logger } from 'winston';

const CALLBACKS = ['SIGTERM', 'SIGINT', 'beforeExit'];
export class BackendLifecycleImpl {
  constructor(private readonly logger: Logger) {
    CALLBACKS.map(signal => process.on(signal, () => this.shutdown()));
  }

  #isCalled = false;
  #shutdownTasks: Array<BackendLifecycleShutdownHook & { pluginId: string }> =
    [];

  addShutdownHook(
    options: BackendLifecycleShutdownHook & { pluginId: string },
  ): void {
    this.#shutdownTasks.push(options);
  }

  async shutdown(): Promise<void> {
    if (this.#isCalled) {
      return;
    }
    this.#isCalled = true;

    this.logger.info(`Running ${this.#shutdownTasks.length} shutdown tasks...`);
    await Promise.all(
      this.#shutdownTasks.map(hook =>
        Promise.resolve()
          .then(() => hook.fn())
          .catch(e => {
            this.logger.error(
              `Shutdown hook registered by plugin '${hook.pluginId}' failed with: ${e}`,
            );
          })
          .then(() =>
            this.logger.info(
              `Successfully ran shutdown hook registered by plugin ${hook.pluginId}`,
            ),
          ),
      ),
    );
  }
}

class PluginScopedLifecycleImpl implements BackendLifecycle {
  constructor(
    private readonly lifecycle: BackendLifecycleImpl,
    private readonly pluginId: string,
  ) {}
  addShutdownHook(options: BackendLifecycleShutdownHook): void {
    this.lifecycle.addShutdownHook({ ...options, pluginId: this.pluginId });
  }
}

/**
 * Allows plugins to register shutdown hooks that are run when the process is about to exit.
 * @public */
export const lifecycleFactory = createServiceFactory({
  service: lifecycleServiceRef,
  deps: {
    logger: rootLoggerServiceRef,
    plugin: pluginMetadataServiceRef,
  },
  async factory({ logger }) {
    const rootLifecycle = new BackendLifecycleImpl(
      loggerToWinstonLogger(logger),
    );
    return async ({ plugin }) => {
      return new PluginScopedLifecycleImpl(rootLifecycle, plugin.getId());
    };
  },
});
