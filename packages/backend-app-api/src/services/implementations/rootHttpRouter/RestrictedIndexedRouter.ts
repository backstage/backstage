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

function normalizePath(path: string): string {
  return path.replace(/\/*$/, '/');
}

export class RestrictedIndexedRouter implements RootHttpRouterService {
  #indexPath?: false | string;

  #router = Router();
  #namedRoutes = Router();
  #indexRouter = Router();
  #existingPaths = new Array<string>();

  constructor(indexPath?: false | string) {
    this.#indexPath = indexPath;
    this.#router.use(this.#namedRoutes);
    this.#router.use(this.#indexRouter);
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
