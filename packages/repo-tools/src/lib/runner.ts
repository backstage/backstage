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

import { targetPaths } from '@backstage/cli-common';
import { resolvePackagePaths } from './paths';
import pLimit from 'p-limit';

export async function runner(
  paths: string[],
  command: (dir: string) => Promise<void>,
) {
  const packages = await resolvePackagePaths({ paths });
  const limit = pLimit(5);

  const resultsList = await Promise.all(
    packages.map(pkg =>
      limit(async () => {
        let resultText = '';
        try {
          console.log(`## Processing ${pkg}`);
          // The package paths are relative to the installation root, which
          // need not be the working directory
          await command(targetPaths.resolveInstallationRoot(pkg));
        } catch (err) {
          resultText = err.message;
        }

        return {
          relativeDir: pkg,
          resultText,
        };
      }),
    ),
  );

  return resultsList;
}

export async function block() {
  return new Promise(() => {});
}
