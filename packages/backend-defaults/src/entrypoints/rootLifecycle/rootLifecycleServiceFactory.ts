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
import { HookRunner } from '../../lib/HookRunner';

/** @internal */
export class BackendLifecycleImpl implements RootLifecycleService {
  readonly #startup: HookRunner<LifecycleServiceStartupOptions>;
  readonly #beforeShutdown: HookRunner<undefined>;
  readonly #shutdown: HookRunner<LifecycleServiceShutdownOptions>;

  constructor(logger: LoggerService) {
    this.#startup = new HookRunner('startup', logger, {
      lateAddMessage:
        'Attempted to add startup hook after startup has completed',
    });
    this.#beforeShutdown = new HookRunner('before shutdown', logger, {
      lateAddMessage:
        'Attempted to add before shutdown hook after shutdown has started',
    });
    this.#shutdown = new HookRunner('shutdown', logger, {
      lateAddMessage:
        'Attempted to add shutdown hook after shutdown has started',
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

  addBeforeShutdownHook(hook: () => void): void {
    this.#beforeShutdown.add(hook);
  }

  async beforeShutdown(): Promise<void> {
    await this.#beforeShutdown.run();
  }

  addShutdownHook(
    hook: LifecycleServiceShutdownHook,
    options?: LifecycleServiceShutdownOptions,
  ): void {
    this.#shutdown.add(hook, options);
  }

  async shutdown(): Promise<void> {
    await this.#shutdown.run();
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
