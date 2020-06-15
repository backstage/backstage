/*
 * Copyright 2020 Spotify AB
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

import fs from 'fs-extra';
import { dirname, resolve as resolvePath } from 'path';

/**
 * Looks for a package.json that has name: "root" to identify the root of the monorepo
 *
 * This is a copy of the same function in the CLI
 */
export function findRootPath(topPath: string): string {
  let path = topPath;

  // Some sanity check to avoid infinite loop
  for (let i = 0; i < 1000; i++) {
    const packagePath = resolvePath(path, 'package.json');
    const exists = fs.pathExistsSync(packagePath);
    if (exists) {
      try {
        const data = fs.readJsonSync(packagePath);
        if (data.name === 'root' || data.name.includes('backstage-e2e')) {
          return path;
        }
      } catch (error) {
        throw new Error(
          `Failed to parse package.json file while searching for root, ${error}`,
        );
      }
    }

    const newPath = dirname(path);
    if (newPath === path) {
      throw new Error(
        `No package.json with name "root" found as a parent of ${topPath}`,
      );
    }
    path = newPath;
  }

  throw new Error(
    `Iteration limit reached when searching for root package.json at ${topPath}`,
  );
}
