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

const PKG_PATH = 'package.json';

export default async (imageTag: string) => {
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

  await run('docker', ['build', '.', '-t', imageTag], {
    cwd: tempDistWorkspace,
  });

  await fs.remove(tempDistWorkspace);
};
