/*
 * Copyright 2022 The Backstage Authors
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

import { targetPaths } from '@backstage/cli-common';
import fs from 'fs-extra';
import { resolve as resolvePath } from 'node:path';
import yaml from 'yaml';

/**
 * Returns true if `dir` is a Yarn project, by the same rule as the lookup of
 * the workspace root in `@backstage/cli-common`. The `packageManager` field
 * decides when it names Yarn or pnpm. Without that field,
 * `devEngines.packageManager` decides, where the first of Yarn and pnpm
 * counts. Otherwise a `yarn.lock` without a `pnpm-lock.yaml` does.
 */
async function isYarnProject(
  dir: string,
  pkg: Record<string, any> | undefined,
): Promise<boolean> {
  if (!pkg) {
    return false;
  }
  const devEngineNames = [pkg.devEngines?.packageManager]
    .flat()
    .map(entry => entry?.name);
  const declared =
    typeof pkg.packageManager === 'string'
      ? pkg.packageManager.split('@')[0]
      : devEngineNames.find(name => name === 'yarn' || name === 'pnpm');
  if (declared === 'yarn' || declared === 'pnpm') {
    return declared === 'yarn';
  }
  return (
    !(await fs.pathExists(resolvePath(dir, 'pnpm-lock.yaml'))) &&
    (await fs.pathExists(resolvePath(dir, 'yarn.lock')))
  );
}

/**
 * Returns true if the current project is a monorepo.
 *
 * Uses a simple presence check on the `packages` field of a
 * `pnpm-workspace.yaml` file or the `workspaces` field in the root
 * `package.json`. Empty or invalid workspace config is treated as a monorepo;
 * we do not validate patterns. Like the lookup of the workspace root, a
 * `pnpm-workspace.yaml` file in a Yarn project is not read.
 *
 * @public
 */
export async function isMonoRepo(): Promise<boolean> {
  const rootPackageJsonPath = targetPaths.resolveWorkspaceRoot('package.json');
  const pkg = await fs.readJson(rootPackageJsonPath).catch(() => undefined);

  // pnpm declares workspace packages in pnpm-workspace.yaml rather than
  // package.json. Without a packages field the file only holds settings, and
  // the workspace only includes its root.
  const pnpmWorkspacePath = targetPaths.resolveWorkspaceRoot(
    'pnpm-workspace.yaml',
  );
  if (
    (await fs.pathExists(pnpmWorkspacePath)) &&
    !(await isYarnProject(targetPaths.workspaceRootDir, pkg))
  ) {
    try {
      const data = yaml.parse(await fs.readFile(pnpmWorkspacePath, 'utf8'));
      if (Array.isArray(data?.packages)) {
        return true;
      }
    } catch {
      return true;
    }
  }
  return Boolean(pkg?.workspaces);
}
