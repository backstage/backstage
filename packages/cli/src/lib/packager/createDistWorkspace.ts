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

import chalk from 'chalk';
import fs from 'fs-extra';
import {
  join as joinPath,
  resolve as resolvePath,
  relative as relativePath,
} from 'path';
import pLimit from 'p-limit';
import { tmpdir } from 'os';
import tar, { CreateOptions, FileOptions } from 'tar';
import partition from 'lodash/partition';
import { paths } from '../paths';
import { run } from '../run';
import {
  dependencies as cliDependencies,
  devDependencies as cliDevDependencies,
} from '../../../package.json';
import {
  BuildOptions,
  buildPackages,
  getOutputsForRole,
  Output,
} from '../builder';
import { productionPack } from './productionPack';
import {
  PackageRoles,
  PackageGraph,
  PackageGraphNode,
} from '@backstage/cli-node';
import { runParallelWorkers } from '../parallel';

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
   * Configuration files to load during packaging.
   */
  configPaths?: string[];

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
   * Controls amount of parallelism in some build steps.
   */
  parallelism?: number;

  /**
   * If set, creates a skeleton tarball that contains all package.json files
   * with the same structure as the workspace dir.
   */
  skeleton?: 'skeleton.tar' | 'skeleton.tar.gz';

  /**
   * If set to true, `yarn pack` is always preferred when creating the dist
   * workspace. This ensures correct workspace output at significant cost to
   * command performance.
   */
  alwaysYarnPack?: boolean;

  /**
   * If set to true, the generated code will be minified.
   */
  minify?: boolean;
};

function prefixLogFunc(prefix: string, out: 'stdout' | 'stderr') {
  return (data: Buffer) => {
    for (const line of data.toString('utf8').split(/\r?\n/)) {
      process[out].write(`${prefix} ${line}\n`);
    }
  };
}

/**
 * Uses `yarn pack` to package local packages and unpacks them into a dist workspace.
 * The target workspace will end up containing dist version of each package and
 * will be suitable for packaging e.g. into a docker image.
 *
 * This creates a structure that is functionally similar to if the packages were
 * installed from npm, but uses Yarn workspaces to link to them at runtime.
 */
export async function createDistWorkspace(
  packageNames: string[],
  options: Options = {},
) {
  const targetDir =
    options.targetDir ??
    (await fs.mkdtemp(resolvePath(tmpdir(), 'dist-workspace')));

  const packages = await PackageGraph.listTargetPackages();
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
    const configPaths = options.configPaths ?? [];

    const toBuild = new Set(
      targets.map(_ => _.name).filter(name => !exclude.includes(name)),
    );

    const standardBuilds = new Array<BuildOptions>();
    const customBuild = new Array<{
      dir: string;
      name: string;
      args?: string[];
    }>();

    for (const pkg of packages) {
      if (!toBuild.has(pkg.packageJson.name)) {
        continue;
      }
      const role = pkg.packageJson.backstage?.role;
      if (!role) {
        console.warn(
          `Building ${pkg.packageJson.name} separately because it has no role`,
        );
        customBuild.push({ dir: pkg.dir, name: pkg.packageJson.name });
        continue;
      }

      const buildScript = pkg.packageJson.scripts?.build;
      if (!buildScript) {
        customBuild.push({ dir: pkg.dir, name: pkg.packageJson.name });
        continue;
      }

      if (!buildScript.startsWith('backstage-cli package build')) {
        console.warn(
          `Building ${pkg.packageJson.name} separately because it has a custom build script, '${buildScript}'`,
        );
        customBuild.push({ dir: pkg.dir, name: pkg.packageJson.name });
        continue;
      }

      if (PackageRoles.getRoleInfo(role).output.includes('bundle')) {
        console.warn(
          `Building ${pkg.packageJson.name} separately because it is a bundled package`,
        );
        const args = buildScript.includes('--config')
          ? []
          : configPaths.map(p => ['--config', p]).flat();
        customBuild.push({ dir: pkg.dir, name: pkg.packageJson.name, args });
        continue;
      }

      const outputs = getOutputsForRole(role);

      // No need to build and include types in the production runtime
      outputs.delete(Output.types);

      if (outputs.size > 0) {
        standardBuilds.push({
          targetDir: pkg.dir,
          packageJson: pkg.packageJson,
          outputs: outputs,
          logPrefix: `${chalk.cyan(relativePath(paths.targetRoot, pkg.dir))}: `,
          minify: options.minify,
          workspacePackages: packages,
        });
      }
    }

    await buildPackages(standardBuilds);

    if (customBuild.length > 0) {
      await runParallelWorkers({
        items: customBuild,
        worker: async ({ name, dir, args }) => {
          await run('yarn', ['run', 'build', ...(args || [])], {
            cwd: dir,
            stdoutLogFunc: prefixLogFunc(`${name}: `, 'stdout'),
            stderrLogFunc: prefixLogFunc(`${name}: `, 'stderr'),
          });
        },
      });
    }
  }

  await moveToDistWorkspace(
    targetDir,
    targets,
    Boolean(options.alwaysYarnPack),
  );

  const files: FileEntry[] = options.files ?? ['yarn.lock', 'package.json'];

  for (const file of files) {
    const src = typeof file === 'string' ? file : file.src;
    const dest = typeof file === 'string' ? file : file.dest;
    await fs.copy(paths.resolveTargetRoot(src), resolvePath(targetDir, dest));
  }

  if (options.skeleton) {
    const skeletonFiles = targets
      .map(target => {
        const dir = relativePath(paths.targetRoot, target.dir);
        return joinPath(dir, 'package.json');
      })
      .sort();

    await tar.create(
      {
        file: resolvePath(targetDir, options.skeleton),
        cwd: targetDir,
        portable: true,
        noMtime: true,
        gzip: options.skeleton.endsWith('.gz'),
      } as CreateOptions & FileOptions & { noMtime: boolean },
      skeletonFiles,
    );
  }

  return targetDir;
}

const FAST_PACK_SCRIPTS = [
  undefined,
  'backstage-cli prepack',
  'backstage-cli package prepack',
];

async function moveToDistWorkspace(
  workspaceDir: string,
  localPackages: PackageGraphNode[],
  alwaysYarnPack: boolean,
): Promise<void> {
  const [fastPackPackages, slowPackPackages] = partition(
    localPackages,
    pkg =>
      !alwaysYarnPack &&
      FAST_PACK_SCRIPTS.includes(pkg.packageJson.scripts?.prepack),
  );

  // New an improved flow where we avoid calling `yarn pack`
  await Promise.all(
    fastPackPackages.map(async target => {
      console.log(`Moving ${target.name} into dist workspace`);

      const outputDir = relativePath(paths.targetRoot, target.dir);
      const absoluteOutputPath = resolvePath(workspaceDir, outputDir);
      await productionPack({
        packageDir: target.dir,
        targetDir: absoluteOutputPath,
      });
    }),
  );

  // Old flow is below, which calls `yarn pack` and extracts the tarball

  async function pack(target: PackageGraphNode, archive: string) {
    console.log(`Repacking ${target.name} into dist workspace`);
    const archivePath = resolvePath(workspaceDir, archive);

    await run('yarn', ['pack', '--filename', archivePath], {
      cwd: target.dir,
    });

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

  const [unsafePackages, safePackages] = partition(slowPackPackages, p =>
    UNSAFE_PACKAGES.includes(p.name),
  );

  // The unsafe package are packed first one by one in order to avoid race conditions
  // where the CLI is being executed with broken dependencies.
  for (const target of unsafePackages) {
    await pack(target, `temp-package.tgz`);
  }

  // Repacking in parallel is much faster and safe for all packages outside of the Backstage repo
  // Limit concurrency to 10 to avoid resource exhaustion on larger monorepos.
  const limit = pLimit(10);
  await Promise.all(
    safePackages.map((target, index) =>
      limit(() => pack(target, `temp-package-${index}.tgz`)),
    ),
  );
}
