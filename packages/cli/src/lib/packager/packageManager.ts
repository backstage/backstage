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

import { join as joinPath } from 'path';
import { existsSync } from 'fs';
import { findRootSync } from '@manypkg/find-root';

interface PackageManager {
  command: string;
  lockfile: string;
}

function detect(): PackageManager {
  const rootDir = findRootSync(process.cwd());
  const lockfiles = {
    'yarn.lock': 'yarn',
    'package-lock.json': 'npm',
  };

  for (const [lockfile, command] of Object.entries(lockfiles)) {
    if (existsSync(joinPath(rootDir, lockfile))) {
      if (command !== 'yarn')
        console.log(`Using ${command} because of ${lockfile} in ${rootDir}`);
      return {
        command,
        lockfile,
      };
    }
  }

  throw new Error(`No package manager lockfile found in ${rootDir}`);
}

const detectedPackageManager = detect();
export default detectedPackageManager;
