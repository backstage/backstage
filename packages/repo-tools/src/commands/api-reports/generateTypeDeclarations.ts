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

import fs from 'fs-extra';
import { spawnSync } from 'child_process';
import { paths as cliPaths } from '../../lib/paths';

/**
 * Generates the TypeScript declaration files for the specified project, using the provided `tsconfig.json` file.
 *
 * Any existing declaration files in the `dist-types` directory will be deleted before generating the new ones.
 *
 * If the `tsc` command exits with a non-zero exit code, the process will be terminated with the same exit code.
 *
 * @param tsconfigFilePath {string} The path to the `tsconfig.json` file to use for generating the declaration files.
 * @returns {Promise<void>} A promise that resolves when the declaration files have been generated.
 */
export async function generateTypeDeclarations(tsconfigFilePath: string) {
  await fs.remove(cliPaths.resolveTargetRoot('dist-types'));
  const { status } = spawnSync(
    'yarn',
    [
      'tsc',
      ['--project', tsconfigFilePath],
      ['--skipLibCheck', 'false'],
      ['--incremental', 'false'],
    ].flat(),
    {
      stdio: 'inherit',
      shell: true,
      cwd: cliPaths.targetRoot,
    },
  );
  if (status !== 0) {
    process.exit(status || undefined);
  }
}
