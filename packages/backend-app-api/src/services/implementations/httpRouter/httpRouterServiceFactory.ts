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
  coreServices,
  createServiceFactory,
} from '@backstage/backend-plugin-api';
import { Handler } from 'express';
import PromiseRouter from 'express-promise-router';
import { createLifecycleMiddleware } from './createLifecycleMiddleware';

/**
 * @public
 */
export interface HttpRouterFactoryOptions {
  /**
   * A callback used to generate the path for each plugin, defaults to `/api/{pluginId}`.
   */
  getPath?(pluginId: string): string;
}

/** @public */
export const httpRouterServiceFactory = createServiceFactory(
  (options?: HttpRouterFactoryOptions) => ({
    service: coreServices.httpRouter,
    deps: {
      plugin: coreServices.pluginMetadata,
      lifecycle: coreServices.lifecycle,
      rootHttpRouter: coreServices.rootHttpRouter,
    },
    async factory({ plugin, rootHttpRouter, lifecycle }) {
      const getPath = options?.getPath ?? (id => `/api/${id}`);
      const path = getPath(plugin.getId());

      const router = PromiseRouter();
      rootHttpRouter.use(path, router);

      router.use(createLifecycleMiddleware({ lifecycle }));

      return {
        use(handler: Handler) {
          router.use(handler);
        },
      };
    },
  }),
);
