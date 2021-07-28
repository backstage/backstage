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

import { promisify } from 'util';
import { exec } from 'child_process';
import { version as cliVersion } from '../../package.json';
import os from 'os';

export default async () => {
  const promisifiedExec = promisify(exec);

  await new Promise(async () => {
    const yarnVersion = await promisifiedExec('yarn --version');
    const npmVersion = await promisifiedExec('npm --version');

    console.log(
      `Operating System - ${os.type}(${os.release}) - ${os.platform}/${os.arch}`,
    );

    console.log('\n------------------\n');

    console.log('Node.js environment:\n');
    console.log(`Node.js - ${process.version}`);
    console.log(`@backstage/cli- ${cliVersion}`);

    console.log('\n------------------\n');

    console.log('Global environment:\n');
    console.log(
      `yarn - ${
        yarnVersion.stderr ? yarnVersion.stderr : yarnVersion.stdout.trim()
      }`,
    );
    console.log(
      `npm - ${
        npmVersion.stderr ? npmVersion.stderr : npmVersion.stdout.trim()
      }`,
    );

    // TODO - How to find whether the current repo is a clone or a fork or a create-app generated repo?

    // TODO - How to find actual resolved versions of backstage libraries that the app and backend packages build against?
  });
};
