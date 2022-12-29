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
} from '@backstage/backend-plugin-api';
import { Handler } from 'express';

/**
 * @public
 */
export type HttpRouterFactoryOptions = {
  /**
   * The path prefix used for each plugin, defaults to `/api/`.
   */
  pathPrefix?: string;
};

/** @public */
export const httpRouterFactory = createServiceFactory({
  service: coreServices.httpRouter,
  deps: {
    plugin: coreServices.pluginMetadata,
    rootHttpRouter: coreServices.rootHttpRouter,
  },
  async factory({ rootHttpRouter }, options?: HttpRouterFactoryOptions) {
    const pathPrefix = options?.pathPrefix ?? '/api/';

    return async ({ plugin }) => {
      const path = pathPrefix + plugin.getId();
      return {
        use(handler: Handler) {
          rootHttpRouter.use(path, handler);
        },
      };
    };
  },
});
