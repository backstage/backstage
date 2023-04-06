/*
 * Copyright 2023 The Backstage Authors
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

import { RootHttpRouterService } from '@backstage/backend-plugin-api';
import { Handler, Router } from 'express';
import trimEnd from 'lodash/trimEnd';

function normalizePath(path: string): string {
  return `${trimEnd(path, '/')}/`;
}

/**
 * Options for the {@link DefaultRootHttpRouter} class.
 *
 * @public
 */
export interface DefaultRootHttpRouterOptions {
  /**
   * The path to forward all unmatched requests to. Defaults to '/api/app' if
   * not given. Disables index path behavior if false is given.
   */
  indexPath?: string | false;
}

/**
 * The default implementation of the {@link @backstage/backend-plugin-api#RootHttpRouterService} interface for
 * {@link @backstage/backend-plugin-api#coreServices.rootHttpRouter}.
 *
 * @public
 */
export class DefaultRootHttpRouter implements RootHttpRouterService {
  #indexPath?: string;

  #router = Router();
  #namedRoutes = Router();
  #indexRouter = Router();
  #existingPaths = new Array<string>();

  static create(options?: DefaultRootHttpRouterOptions) {
    let indexPath;
    if (options?.indexPath === false) {
      indexPath = undefined;
    } else if (options?.indexPath === undefined) {
      indexPath = '/api/app';
    } else if (options?.indexPath === '') {
      throw new Error('indexPath option may not be an empty string');
    } else {
      indexPath = options.indexPath;
    }
    return new DefaultRootHttpRouter(indexPath);
  }

  private constructor(indexPath?: string) {
    this.#indexPath = indexPath;
    this.#router.use(this.#namedRoutes);
    if (this.#indexPath) {
      this.#router.use(this.#indexRouter);
    }
  }

  use(path: string, handler: Handler) {
    if (path.match(/^[/\s]*$/)) {
      throw new Error(`Root router path may not be empty`);
    }
    const conflictingPath = this.#findConflictingPath(path);
    if (conflictingPath) {
      throw new Error(
        `Path ${path} conflicts with the existing path ${conflictingPath}`,
      );
    }
    this.#existingPaths.push(path);
    this.#namedRoutes.use(path, handler);

    if (this.#indexPath === path) {
      this.#indexRouter.use(handler);
    }
  }

  handler(): Handler {
    return this.#router;
  }

  #findConflictingPath(newPath: string): string | undefined {
    const normalizedNewPath = normalizePath(newPath);
    for (const path of this.#existingPaths) {
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
}
