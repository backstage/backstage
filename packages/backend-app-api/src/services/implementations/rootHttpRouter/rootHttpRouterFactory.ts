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
import Router from 'express-promise-router';
import { Handler } from 'express';
import { createServiceBuilder } from '@backstage/backend-common';

/**
 * @public
 */
export type RootHttpRouterFactoryOptions = {
  /**
   * The path to forward all unmatched requests to. Defaults to '/api/app'
   */
  indexPath?: string | false;

  /**
   * Middlewares that are added before all other routes.
   */
  middleware?: Handler[];
};

/** @public */
export const rootHttpRouterFactory = createServiceFactory({
  service: coreServices.rootHttpRouter,
  deps: {
    config: coreServices.config,
    lifecycle: coreServices.rootLifecycle,
  },
  async factory({ config, lifecycle }, options?: RootHttpRouterFactoryOptions) {
    const indexPath = options?.indexPath ?? '/api/app';

    const namedRouter = Router();
    const indexRouter = Router();

    const service = createServiceBuilder(module).loadConfig(config);

    for (const middleware of options?.middleware ?? []) {
      service.addRouter('', middleware);
    }

    service.addRouter('', namedRouter).addRouter('', indexRouter);

    const server = await service.start();
    // Stop method isn't part of the public API, let's fix that once we move the implementation here.
    const stoppableServer = server as typeof server & {
      stop: (cb: (error?: Error) => void) => void;
    };

    lifecycle.addShutdownHook({
      async fn() {
        await new Promise<void>((resolve, reject) => {
          stoppableServer.stop((error?: Error) => {
            if (error) {
              reject(error);
            } else {
              resolve();
            }
          });
        });
      },
      labels: { service: 'rootHttpRouter' },
    });

    const existingPaths = new Array<string>();

    return {
      use: (path: string, handler: Handler) => {
        if (path.match(/^[/\s]*$/)) {
          throw new Error(`Root router path may not be empty`);
        }
        const conflictingPath = findConflictingPath(existingPaths, path);
        if (conflictingPath) {
          throw new Error(
            `Path ${path} conflicts with the existing path ${conflictingPath}`,
          );
        }
        existingPaths.push(path);
        namedRouter.use(path, handler);

        if (indexPath === path) {
          indexRouter.use(handler);
        }
      },
    };
  },
});

function normalizePath(path: string): string {
  return path.replace(/\/*$/, '/');
}

export function findConflictingPath(
  paths: string[],
  newPath: string,
): string | undefined {
  const normalizedNewPath = normalizePath(newPath);
  for (const path of paths) {
    const normalizedPath = normalizePath(path);
    if (normalizedPath.startsWith(normalizedNewPath)) {
      return path;
    }
    if (normalizedNewPath.startsWith(normalizedPath)) {
      return path;
    }
  }
  return undefined;
}
