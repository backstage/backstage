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
import { spawn } from 'child_process';
import { promisify } from 'util';
import { paths } from '../../lib/paths';

const execAsync = promisify(spawn);

export default async function packageDocs() {
  //   const packages = await PackageGraph.listTargetPackages();
  //   for (const pkg of packages) {
  //     console.log(path.relative(paths.targetRoot, pkg.dir));
  //     const configPath = path.join(pkg.dir, 'typedoc.json');
  //     try {
  //       const DEFAULT_CONFIG = {
  //         extends: ['../../typedoc.base.jsonc'],
  //         entryPoints:
  //           Object.values(pkg.packageJson.exports ?? {}) ?? pkg.packageJson.main,
  //       };
  //       await writeFile(configPath, JSON.stringify(DEFAULT_CONFIG, null, 2));
  //     } catch (e) {
  //       console.error(`Failed to generate docs for ${pkg.packageJson.name}`);
  //       console.error(e);
  //     } finally {
  //     }
  //   }
  console.log(`Generating docs.`);
  await execAsync(
    paths.resolveTargetRoot('node_modules/.bin/typedoc'),
    ['--out', 'type-docs', '--entryPointStrategy', 'packages'],
    {
      stdio: 'inherit',
      cwd: paths.targetRoot,
      env: { ...process.env, NODE_OPTIONS: '--max-old-space-size=12288' },
    },
  );
  //   for (const pkg of packages) {
  //     const configPath = path.join(pkg.dir, 'typedoc.json');
  //     await rm(configPath);
  //   }
}
