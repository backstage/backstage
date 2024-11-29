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

import fs from 'fs-extra';
import { resolve as resolvePath } from 'path';
import { PlaywrightTestConfig } from '@playwright/test';
import { getPackagesSync } from '@manypkg/get-packages';
import type { BackstagePackage } from '@backstage/cli-node';

/**
 * Generates a list of playwright projects by scanning the monorepo for packages with an `e2e-tests/` folder.
 *
 * @public
 */
export function generateProjects(): PlaywrightTestConfig['projects'] {
  // TODO(Rugvip): Switch this over to use @backstage/cli-node once released, and support SINCE=origin/main
  const { root, packages } = getPackagesSync(process.cwd());
  const e2eTestPackages = [...(root ? [root] : []), ...packages].filter(pkg => {
    return fs.pathExistsSync(resolvePath(pkg.dir, 'e2e-tests'));
  }) as BackstagePackage[];

  return e2eTestPackages.map(pkg => ({
    name: pkg.packageJson.name,
    testDir: resolvePath(pkg.dir, 'e2e-tests'),
    use: {
      channel: 'chrome',
    },
  }));
}
