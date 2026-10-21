/*
 * Copyright 2026 The Backstage Authors
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

// TODO: Make these regular dependencies again once a fixed version of
// @yarnpkg/core is published. Version 4.9.2 has a dependency on a local
// patch file that does not exist outside the Yarn repository, which breaks
// installation for everyone depending on this module.
const OPTIONAL_YARN_PACKAGES = [
  '@yarnpkg/cli',
  '@yarnpkg/core',
  '@yarnpkg/plugin-patch',
];

export function assertYarnPackagesAvailable(
  resolve: (name: string) => string = require.resolve,
) {
  const missing = OPTIONAL_YARN_PACKAGES.filter(name => {
    try {
      resolve(name);
      return false;
    } catch {
      return true;
    }
  });
  if (missing.length > 0) {
    throw new Error(
      'The verify-patches command is temporarily unavailable. Its Yarn ' +
        'dependencies have been made optional because @yarnpkg/core@4.9.2 ' +
        'was published with a broken dependency that fails installation. ' +
        'The command will be restored in a future release once this is ' +
        `fixed upstream. Missing packages: ${missing.join(', ')}`,
    );
  }
}
