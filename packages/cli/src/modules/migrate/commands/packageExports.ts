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

import {
  fixPackageExports,
  readFixablePackages,
  writeFixedPackages,
} from '../../maintenance/commands/repo/fix';

export async function command() {
  console.log(
    'The `migrate package-exports` command is deprecated, use `repo fix` instead.',
  );
  const packages = await readFixablePackages();

  for (const pkg of packages) {
    fixPackageExports(pkg);
  }

  await writeFixedPackages(packages);
}
