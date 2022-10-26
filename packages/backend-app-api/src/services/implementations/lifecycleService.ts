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
  ShutdownHookOptions,
} from '@backstage/backend-plugin-api';
import { Logger } from 'winston';

class BackendLifecycleImpl {
  constructor(private readonly logger: Logger) {}
  #shutdownTasks: Array<ShutdownHookOptions & { pluginId: string }> = [];

  addShutdownHook(options: ShutdownHookOptions & { pluginId: string }): void {
    this.#shutdownTasks.push(options);
  }

  async shutdown(): Promise<void> {
    await Promise.all(
      this.#shutdownTasks.map(hook =>
        hook
          .fn()
          .catch(e => {
            this.logger.error(
              `Shutdown hook registered by plugin '${hook.pluginId}' failed with: ${e}`,
            );
          })
          .then(() =>
            this.logger.debug(
              `Successfully ran hook registered by plugin ${hook.pluginId}`,
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
  addShutdownHook(options: ShutdownHookOptions): void {
    this.lifecycle.addShutdownHook({ ...options, pluginId: this.pluginId });
  }
}

/** @public */
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
    process.on('SIGTERM', async () => await rootLifecycle.shutdown());
    return async ({ plugin }) => {
      return new PluginScopedLifecycleImpl(rootLifecycle, plugin.getId());
    };
  },
});
