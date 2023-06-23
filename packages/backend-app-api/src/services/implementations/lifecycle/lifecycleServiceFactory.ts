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
  LifecycleService,
  LifecycleServiceShutdownHook,
  LifecycleServiceShutdownOptions,
  LifecycleServiceStartupHook,
  LifecycleServiceStartupOptions,
  LoggerService,
  PluginMetadataService,
  RootLifecycleService,
  coreServices,
  createServiceFactory,
} from '@backstage/backend-plugin-api';

/** @internal */
export class BackendPluginLifecycleImpl implements LifecycleService {
  constructor(
    private readonly logger: LoggerService,
    private readonly rootLifecycle: RootLifecycleService,
    private readonly pluginMetadata: PluginMetadataService,
  ) {}

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

    this.logger.debug(
      `Running ${this.#startupTasks.length} plugin startup tasks...`,
    );
    await Promise.all(
      this.#startupTasks.map(async ({ hook, options }) => {
        const logger = options?.logger ?? this.logger;
        try {
          await hook();
          logger.debug(`Plugin startup hook succeeded`);
        } catch (error) {
          logger.error(`Plugin startup hook failed, ${error}`);
        }
      }),
    );
  }

  addShutdownHook(
    hook: LifecycleServiceShutdownHook,
    options?: LifecycleServiceShutdownOptions,
  ): void {
    const plugin = this.pluginMetadata.getId();
    this.rootLifecycle.addShutdownHook(hook, {
      logger: options?.logger?.child({ plugin }) ?? this.logger,
    });
  }
}

/**
 * Allows plugins to register shutdown hooks that are run when the process is about to exit.
 * @public
 */
export const lifecycleServiceFactory = createServiceFactory({
  service: coreServices.lifecycle,
  deps: {
    logger: coreServices.logger,
    rootLifecycle: coreServices.rootLifecycle,
    pluginMetadata: coreServices.pluginMetadata,
  },
  async factory({ rootLifecycle, logger, pluginMetadata }) {
    return new BackendPluginLifecycleImpl(
      logger,
      rootLifecycle,
      pluginMetadata,
    );
  },
});
