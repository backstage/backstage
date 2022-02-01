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

import fs from 'fs-extra';
import {
  join as joinPath,
  resolve as resolvePath,
  relative as relativePath,
} from 'path';
import { tmpdir } from 'os';
import tar, { CreateOptions } from 'tar';
import { paths } from '../paths';
import { run } from '../run';
import { ParallelOption } from '../parallel';
import {
  dependencies as cliDependencies,
  devDependencies as cliDevDependencies,
} from '../../../package.json';
import { getPackages } from '@manypkg/get-packages';
import { PackageGraph, PackageGraphNode } from '../monorepo';

// These packages aren't safe to pack in parallel since the CLI depends on them
const UNSAFE_PACKAGES = [
  ...Object.keys(cliDependencies),
  ...Object.keys(cliDevDependencies),
];

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

  /**
   * If set to true, the target packages are built before they are packaged into the workspace.
   */
  buildDependencies?: boolean;

  /**
   * When `buildDependencies` is set, this list of packages will not be built even if they are dependencies.
   */
  buildExcludes?: string[];

  /**
   * Enable (true/false) or control amount of (number) parallelism in some build steps.
   */
  parallel?: ParallelOption;

  /**
   * If set, creates a skeleton tarball that contains all package.json files
   * with the same structure as the workspace dir.
   */
  skeleton?: 'skeleton.tar' | 'skeleton.tar.gz';
};

/**
 * Uses `yarn pack` to package local packages and unpacks them into a dist workspace.
 * The target workspace will end up containing dist version of each package and
 * will be suitable for packaging e.g. into a docker image.
 *
 * This creates a structure that is functionally similar to if the packages where
 * installed from npm, but uses Yarn workspaces to link to them at runtime.
 */
export async function createDistWorkspace(
  packageNames: string[],
  options: Options = {},
) {
  const targetDir =
    options.targetDir ??
    (await fs.mkdtemp(resolvePath(tmpdir(), 'dist-workspace')));

  const { packages } = await getPackages(paths.targetDir);
  const packageGraph = PackageGraph.fromPackages(packages);
  const targetNames = packageGraph.collectPackageNames(packageNames, node => {
    // Don't include dependencies of packages that are marked as bundled
    if (node.packageJson.bundled) {
      return undefined;
    }

    return node.publishedLocalDependencies.keys();
  });
  const targets = Array.from(targetNames).map(name => packageGraph.get(name)!);

  if (options.buildDependencies) {
    const exclude = options.buildExcludes ?? [];

    const toBuild = targets.filter(target => !exclude.includes(target.name));
    if (toBuild.length > 0) {
      const scopeArgs = toBuild.flatMap(target => ['--scope', target.name]);
      const lernaArgs =
        options.parallel && Number.isInteger(options.parallel)
          ? ['--concurrency', options.parallel.toString()]
          : [];

      await run('yarn', ['lerna', ...lernaArgs, 'run', ...scopeArgs, 'build'], {
        cwd: paths.targetRoot,
      });
    }
  }

  await moveToDistWorkspace(targetDir, targets);

  const files: FileEntry[] = options.files ?? ['yarn.lock', 'package.json'];

  for (const file of files) {
    const src = typeof file === 'string' ? file : file.src;
    const dest = typeof file === 'string' ? file : file.dest;
    await fs.copy(paths.resolveTargetRoot(src), resolvePath(targetDir, dest));
  }

  if (options.skeleton) {
    const skeletonFiles = targets.map(target => {
      const dir = relativePath(paths.targetRoot, target.dir);
      return joinPath(dir, 'package.json');
    });

    await tar.create(
      {
        file: resolvePath(targetDir, options.skeleton),
        cwd: targetDir,
        portable: true,
        noMtime: true,
        gzip: options.skeleton.endsWith('.gz'),
      } as CreateOptions & { noMtime: boolean },
      skeletonFiles,
    );
  }

  return targetDir;
}

async function moveToDistWorkspace(
  workspaceDir: string,
  localPackages: PackageGraphNode[],
): Promise<void> {
  async function pack(target: PackageGraphNode, archive: string) {
    console.log(`Repacking ${target.name} into dist workspace`);
    const archivePath = resolvePath(workspaceDir, archive);

    await run('yarn', ['pack', '--filename', archivePath], {
      cwd: target.dir,
    });
    // TODO(Rugvip): yarn pack doesn't call postpack, once the bug is fixed this can be removed
    if (target.packageJson?.scripts?.postpack) {
      await run('yarn', ['postpack'], { cwd: target.dir });
    }

    const outputDir = relativePath(paths.targetRoot, target.dir);
    const absoluteOutputPath = resolvePath(workspaceDir, outputDir);
    await fs.ensureDir(absoluteOutputPath);

    await tar.extract({
      file: archivePath,
      cwd: absoluteOutputPath,
      strip: 1,
    });
    await fs.remove(archivePath);

    // We remove the dependencies from package.json of packages that are marked
    // as bundled, so that yarn doesn't try to install them.
    if (target.packageJson.bundled) {
      const pkgJson = await fs.readJson(
        resolvePath(absoluteOutputPath, 'package.json'),
      );
      delete pkgJson.dependencies;
      delete pkgJson.devDependencies;
      delete pkgJson.peerDependencies;
      delete pkgJson.optionalDependencies;

      await fs.writeJson(
        resolvePath(absoluteOutputPath, 'package.json'),
        pkgJson,
        {
          spaces: 2,
        },
      );
    }
  }

  const unsafePackages = localPackages.filter(p =>
    UNSAFE_PACKAGES.includes(p.name),
  );
  const safePackages = localPackages.filter(
    p => !UNSAFE_PACKAGES.includes(p.name),
  );

  // The unsafe package are packed first one by one in order to avoid race conditions
  // where the CLI is being executed with broken dependencies.
  for (const target of unsafePackages) {
    await pack(target, `temp-package.tgz`);
  }

  // Repacking in parallel is much faster and safe for all packages outside of the Backstage repo
  await Promise.all(
    safePackages.map(async (target, index) =>
      pack(target, `temp-package-${index}.tgz`),
    ),
  );
}
