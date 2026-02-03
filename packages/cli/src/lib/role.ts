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
import { OptionValues } from 'commander';
import { paths } from './paths';
import { PackageRoles, PackageRole } from '@backstage/cli-node';

export async function findRoleFromCommand(
  opts: OptionValues,
): Promise<PackageRole> {
  if (opts.role) {
    return PackageRoles.getRoleInfo(opts.role)?.role;
  }

  const pkg = await fs.readJson(paths.resolveTarget('package.json'));
  const info = PackageRoles.getRoleFromPackage(pkg);
  if (!info) {
    throw new Error(`Target package must have 'backstage.role' set`);
  }
  return info;
}
