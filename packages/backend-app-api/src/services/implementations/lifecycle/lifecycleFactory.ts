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
} from '@backstage/backend-plugin-api';

/**
 * Allows plugins to register shutdown hooks that are run when the process is about to exit.
 * @public */
export const lifecycleFactory = createServiceFactory({
  service: coreServices.lifecycle,
  deps: {
    logger: coreServices.logger,
    rootLifecycle: coreServices.rootLifecycle,
    pluginMetadata: coreServices.pluginMetadata,
  },
  async factory({ rootLifecycle, logger, pluginMetadata }) {
    const plugin = pluginMetadata.getId();
    return {
      addShutdownHook(options: LifecycleServiceShutdownHook): void {
        rootLifecycle.addShutdownHook({
          ...options,

          logger: options.logger?.child({ plugin }) ?? logger,
        });
      },
    };
  },
});
