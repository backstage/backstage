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

import { getMatchingWorkspacePaths } from '../../lib/paths';
import pLimit from 'p-limit';
import { relative as relativePath } from 'path';
import { paths as cliPaths } from '../../lib/paths';

export async function runner(
  paths: string[],
  command: (dir: string) => Promise<void>,
) {
  const packages = await getMatchingWorkspacePaths(paths);
  const limit = pLimit(5);

  const resultsList = await Promise.all(
    packages.map(pkg =>
      limit(async () => {
        let resultText = '';
        try {
          console.log(`## Processing ${pkg}`);
          await command(pkg);
        } catch (err) {
          resultText = err.message;
        }

        return {
          relativeDir: relativePath(cliPaths.targetRoot, pkg),
          resultText,
        };
      }),
    ),
  );

  return resultsList;
}
