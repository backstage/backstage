/*
 * Copyright 2024 The Backstage Authors
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
  RootHealthService,
  RootLifecycleService,
  coreServices,
  createServiceFactory,
} from '@backstage/backend-plugin-api';

/** @internal */
export class DefaultRootHealthService implements RootHealthService {
  #isRunning = false;

  constructor(readonly options: { lifecycle: RootLifecycleService }) {
    options.lifecycle.addStartupHook(() => {
      this.#isRunning = true;
    });
    options.lifecycle.addShutdownHook(() => {
      this.#isRunning = false;
    });
  }

  async getLiveness(): Promise<{ status: number; payload?: any }> {
    return { status: 200, payload: { status: 'ok' } };
  }

  async getReadiness(): Promise<{ status: number; payload?: any }> {
    if (!this.#isRunning) {
      return {
        status: 503,
        payload: { message: 'Backend has not started yet', status: 'error' },
      };
    }

    return { status: 200, payload: { status: 'ok' } };
  }
}

/**
 * @public
 */
export const rootHealthServiceFactory = createServiceFactory({
  service: coreServices.rootHealth,
  deps: {
    lifecycle: coreServices.rootLifecycle,
  },
  async factory({ lifecycle }) {
    return new DefaultRootHealthService({ lifecycle });
  },
});
