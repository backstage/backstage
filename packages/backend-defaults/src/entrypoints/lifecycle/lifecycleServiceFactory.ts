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
  coreServices,
  createServiceFactory,
} from '@backstage/backend-plugin-api';
import { HookRunner } from '../../lib/HookRunner';

/** @internal */
export class BackendPluginLifecycleImpl implements LifecycleService {
  readonly #logger: LoggerService;
  readonly #pluginMetadata: PluginMetadataService;
  readonly #startup: HookRunner<LifecycleServiceStartupOptions>;
  readonly #shutdown: HookRunner<LifecycleServiceShutdownOptions>;

  constructor(logger: LoggerService, pluginMetadata: PluginMetadataService) {
    this.#logger = logger;
    this.#pluginMetadata = pluginMetadata;
    this.#startup = new HookRunner('plugin startup', logger, {
      lateAddMessage:
        'Attempted to add plugin startup hook after startup has completed',
    });
    this.#shutdown = new HookRunner('plugin shutdown', logger, {
      lateAddMessage:
        'Attempted to add plugin shutdown hook after shutdown has started',
    });
  }

  addStartupHook(
    hook: LifecycleServiceStartupHook,
    options?: LifecycleServiceStartupOptions,
  ): void {
    this.#startup.add(hook, options);
  }

  async startup(): Promise<void> {
    await this.#startup.run();
  }

  addShutdownHook(
    hook: LifecycleServiceShutdownHook,
    options?: LifecycleServiceShutdownOptions,
  ): void {
    const plugin = this.#pluginMetadata.getId();
    const logger = options?.logger?.child({ plugin }) ?? this.#logger;
    this.#shutdown.add(hook, { ...options, logger });
  }

  async shutdown(): Promise<void> {
    await this.#shutdown.run();
  }
}

/**
 * Registration of plugin startup and shutdown lifecycle hooks.
 *
 * See {@link @backstage/code-plugin-api#LifecycleService}
 * and {@link https://backstage.io/docs/backend-system/core-services/lifecycle | the service docs}
 * for more information.
 *
 * @public
 */
export const lifecycleServiceFactory = createServiceFactory({
  service: coreServices.lifecycle,
  deps: {
    logger: coreServices.logger,
    pluginMetadata: coreServices.pluginMetadata,
  },
  async factory({ logger, pluginMetadata }) {
    return new BackendPluginLifecycleImpl(logger, pluginMetadata);
  },
});
