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
import { createDistWorkspace } from '../../lib/packager';
import { paths } from '../../lib/paths';
import { run } from '../../lib/run';
import { Command } from 'commander';

const PKG_PATH = 'package.json';

export default async (cmd: Command) => {
  // Skip the preparation steps if we're being asked for help
  if (cmd.args.includes('--help')) {
    await run('docker', ['image', 'build', '--help']);
    return;
  }

  const pkgPath = paths.resolveTarget(PKG_PATH);
  const pkg = await fs.readJson(pkgPath);
  const tempDistWorkspace = await createDistWorkspace([pkg.name], {
    files: [
      'package.json',
      'yarn.lock',
      'app-config.yaml',
      { src: paths.resolveTarget('Dockerfile'), dest: 'Dockerfile' },
    ],
  });
  console.log(`Dist workspace ready at ${tempDistWorkspace}`);

  // all args are forwarded to docker build
  await run('docker', ['image', 'build', '.', ...cmd.args], {
    cwd: tempDistWorkspace,
  });

  await fs.remove(tempDistWorkspace);
};
