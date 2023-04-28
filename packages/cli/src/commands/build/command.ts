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

import { OptionValues } from 'commander';
import { buildPackage, Output } from '../../lib/builder';
import { findRoleFromCommand } from '../../lib/role';
import { PackageRoles } from '@backstage/cli-node';
import { paths } from '../../lib/paths';
import { buildFrontend } from './buildFrontend';
import { buildBackend } from './buildBackend';
import { isValidUrl } from '../../lib/urls';

export async function command(opts: OptionValues): Promise<void> {
  const role = await findRoleFromCommand(opts);

  if (role === 'frontend' || role === 'backend') {
    const configPaths = (opts.config as string[]).map(arg => {
      if (isValidUrl(arg)) {
        return arg;
      }
      return paths.resolveTarget(arg);
    });

    if (role === 'frontend') {
      return buildFrontend({
        targetDir: paths.targetDir,
        configPaths,
        writeStats: Boolean(opts.stats),
      });
    }
    return buildBackend({
      targetDir: paths.targetDir,
      configPaths,
      skipBuildDependencies: Boolean(opts.skipBuildDependencies),
    });
  }

  const roleInfo = PackageRoles.getRoleInfo(role);

  const outputs = new Set<Output>();

  if (roleInfo.output.includes('cjs')) {
    outputs.add(Output.cjs);
  }
  if (roleInfo.output.includes('esm')) {
    outputs.add(Output.esm);
  }
  if (roleInfo.output.includes('types')) {
    outputs.add(Output.types);
  }

  return buildPackage({
    outputs,
    minify: Boolean(opts.minify),
    useApiExtractor: Boolean(opts.experimentalTypeBuild),
  });
}
