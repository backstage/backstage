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

import { Command } from 'commander';
import fs from 'fs-extra';
import { createDistWorkspace } from '../../lib/packager';
import { paths } from '../../lib/paths';
import { parseParallel, PARALLEL_ENV_VAR } from '../../lib/parallel';

const PKG_PATH = 'package.json';
const TARGET_DIR = 'dist-workspace';

export default async (cmd: Command) => {
  const targetDir = paths.resolveTarget(TARGET_DIR);
  const pkgPath = paths.resolveTarget(PKG_PATH);
  const pkg = await fs.readJson(pkgPath);

  await fs.remove(targetDir);
  await fs.mkdir(targetDir);
  await createDistWorkspace([pkg.name], {
    targetDir: targetDir,
    buildDependencies: Boolean(cmd.build),
    parallel: parseParallel(process.env[PARALLEL_ENV_VAR]),
    skeleton: 'skeleton.tar',
  });
};
