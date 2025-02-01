/*
 * Copyright 2025 The Backstage Authors
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
import { exec } from 'child_process';
import { promisify } from 'util';
import { paths } from '../../lib/paths';
import { rm, writeFile } from 'fs/promises';
import { PackageGraph } from '@backstage/cli-node';
import path from 'path';

const execAsync = promisify(exec);

export default async function packageDocs() {
  const packages = await PackageGraph.listTargetPackages();
  for (const pkg of packages) {
    console.log(path.relative(paths.targetRoot, pkg.dir));
    if (path.relative(paths.targetRoot, pkg.dir).startsWith('packages/')) {
      continue;
    }
    const configPath = path.join(pkg.dir, 'typedoc.json');
    try {
      const DEFAULT_CONFIG = {
        extends: ['../../typedoc.base.jsonc'],
        entryPoints:
          Object.values(pkg.packageJson.exports ?? {}) ?? pkg.packageJson.main,
      };
      await writeFile(configPath, JSON.stringify(DEFAULT_CONFIG, null, 2));
      console.log(`Generating docs for ${pkg.packageJson.name}`);
      await execAsync(
        `${paths.resolveTargetRoot('node_modules/.bin/typedoc')} --out docs`,
        {
          cwd: pkg.dir,
        },
      );
    } catch (e) {
      console.error(`Failed to generate docs for ${pkg.packageJson.name}`);
      console.error(e);
    } finally {
      await rm(configPath);
    }
  }
}
