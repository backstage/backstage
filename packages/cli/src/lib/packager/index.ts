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
import { resolve as resolvePath, relative as relativePath } from 'path';
import { paths } from '../paths';
import { run } from '../run';
import tar from 'tar';
import { tmpdir } from 'os';

type LernaPackage = {
  name: string;
  private: boolean;
  location: string;
  scripts: Record<string, string>;
};

type FileEntry =
  | string
  | {
      src: string;
      dest: string;
    };

type Options = {
  /**
   * Target directory for the dist workspace, defaults to a temporary directory
   */
  targetDir?: string;

  /**
   * Files to copy into the target workspace.
   *
   * Defaults to ['yarn.lock', 'package.json'].
   */
  files?: FileEntry[];
};

/**
 * Uses `yarn pack` to package local packages and unpacks them into a dist workspace.
 * The target workspace will end up containing dist version of each package and
 * will be suitable for packaging e.g. into a docker image.
 *
 * This creates a structure that is functionally similar to if the packages where
 * installed from NPM, but uses yarn workspaces to link to them at runtime.
 */
export async function createDistWorkspace(
  packageNames: string[],
  options: Options = {},
) {
  const targetDir =
    options.targetDir ??
    (await fs.mkdtemp(resolvePath(tmpdir(), 'dist-workspace')));

  const targets = await findTargetPackages(packageNames);

  await moveToDistWorkspace(targetDir, targets);

  const files: FileEntry[] = options.files ?? ['yarn.lock', 'package.json'];

  for (const file of files) {
    const src = typeof file === 'string' ? file : file.src;
    const dest = typeof file === 'string' ? file : file.dest;
    await fs.copy(paths.resolveTargetRoot(src), resolvePath(targetDir, dest));
  }
  return targetDir;
}

async function moveToDistWorkspace(
  workspaceDir: string,
  localPackages: LernaPackage[],
): Promise<void> {
  await Promise.all(
    localPackages.map(async (target, index) => {
      console.log(`Repacking ${target.name} into dist workspace`);
      const archive = `temp-package-${index}.tgz`;
      const archivePath = resolvePath(workspaceDir, archive);

      await run('yarn', ['pack', '--filename', archivePath], {
        cwd: target.location,
      });
      // TODO(Rugvip): yarn pack doesn't call postpack, once the bug is fixed this can be removed
      if (target.scripts.postpack) {
        await run('yarn', ['postpack'], { cwd: target.location });
      }

      const outputDir = relativePath(paths.targetRoot, target.location);
      const absoluteOutputPath = resolvePath(workspaceDir, outputDir);
      await fs.ensureDir(absoluteOutputPath);

      await tar.extract({
        file: archivePath,
        cwd: absoluteOutputPath,
        strip: 1,
      });
      await fs.remove(archivePath);
    }),
  );
}

async function findTargetPackages(pkgNames: string[]): Promise<LernaPackage[]> {
  const LernaProject = require('@lerna/project');
  const PackageGraph = require('@lerna/package-graph');

  const project = new LernaProject(paths.targetDir);
  const packages = await project.getPackages();
  const graph = new PackageGraph(packages);

  const targets = new Map<string, any>();
  const searchNames = pkgNames.slice();

  while (searchNames.length) {
    const name = searchNames.pop()!;

    if (targets.has(name)) {
      continue;
    }

    const node = graph.get(name);
    if (!node) {
      throw new Error(`Package '${name}' not found`);
    }

    // Don't include dependencies of packages that are marked as bundled
    if (!node.pkg.get('bundled')) {
      const pkgDeps = Object.keys(node.pkg.dependencies);
      const localDeps: string[] = Array.from(node.localDependencies.keys());
      const filteredDeps = localDeps.filter(dep => pkgDeps.includes(dep));

      searchNames.push(...filteredDeps);
    }

    targets.set(name, node.pkg);
  }

  return Array.from(targets.values());
}
