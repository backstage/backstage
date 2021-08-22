/*
 * Copyright 2020 The Backstage Authors
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

import { version as cliVersion } from '../../package.json';
import os from 'os';
import { runPlain } from '../lib/run';
import { paths } from '../lib/paths';
import { Lockfile } from '../lib/versioning';

export default async () => {
  await new Promise(async () => {
    const yarnVersion = await runPlain('yarn --version');
    const npmVersion = await runPlain('npm --version');

    console.log(
      `Operating System - ${os.type}(${os.release}) - ${os.platform}/${os.arch}`,
    );

    console.log('\n------------------\n');

    console.log('Node.js environment:\n');
    console.log(`Node.js - ${process.version}`);
    console.log(`@backstage/cli- ${cliVersion}`);

    console.log('\n------------------\n');

    console.log('Global environment:\n');
    console.log(`yarn - ${yarnVersion}`);
    console.log(`npm - ${npmVersion}`);

    // TODO - How to find whether the current repo is a clone or a fork or a create-app generated repo?

    console.log('\n------------------\n');

    console.log('Backstage deps:\n');
    const lockfilePath = paths.resolveTargetRoot('yarn.lock');
    const lockfile = await Lockfile.load(lockfilePath);
    const deps = lockfile.keys();

    for (const dep of deps) {
      if (dep.indexOf('@backstage/') !== -1) {
        console.log(dep, lockfile.get(dep)![0].version);
      }
    }
  });
};
