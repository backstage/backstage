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

import { resolvePackagePaths } from './paths';
import pLimit from 'p-limit';
import { relative as relativePath } from 'path';
import { paths as cliPaths } from './paths';
import portFinder from 'portfinder';

export async function runner(
  paths: string[],
  command: (dir: string, options?: { port: number }) => Promise<void>,
  options?: {
    concurrencyLimit: number;
    startingPort?: number;
  },
) {
  const packages = await resolvePackagePaths({ paths });
  const limit = pLimit(options?.concurrencyLimit ?? 5);
  let port =
    options?.startingPort &&
    (await portFinder.getPortPromise({
      // Prevent collisions with optic which runs 8000->8999
      port: options.startingPort,
      stopPort: options.startingPort + 1_000,
    }));
  const resultsList = await Promise.all(
    packages.map(pkg =>
      limit(async () => {
        let resultText = '';
        try {
          if (port)
            port =
              options?.startingPort &&
              (await portFinder.getPortPromise({
                // Prevent collisions with optic which runs 8000->8999
                port: port + 1,
                stopPort: options.startingPort + 1_000,
              }));
          console.log(`## Processing ${pkg}`);
          await command(pkg, port ? { port } : undefined);
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
