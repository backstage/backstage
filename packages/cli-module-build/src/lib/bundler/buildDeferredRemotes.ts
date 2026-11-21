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

import { AppConfig, Config } from '@backstage/config';
import { defaultRemoteSharedDependencies } from '@backstage/module-federation-common';
import chalk from 'chalk';
import fs from 'fs-extra';
import { resolve as resolvePath } from 'node:path';
import {
  BACKSTAGE_MANIFEST_VERSION,
  BackstageManifest,
} from '../frontendManifest/types';
import { buildBundle } from './bundle';
import type { DeferredPackage } from './packageDetection';

/**
 * The directory in the output directory of the app that holds the remotes of
 * deferred packages, one directory for each package. The dynamic features
 * backend serves the remotes in this directory.
 */
export const DEFERRED_REMOTES_DIR = 'remotes';

/** The name of a remote, which must be usable as a code symbol. */
export function getRemoteName(packageName: string) {
  return packageName
    .replaceAll('@', '')
    .replaceAll('/', '__')
    .replaceAll('-', '_');
}

/** The name of the directory of the remote of a package. */
export function getRemoteDirName(packageName: string) {
  return packageName.replace(/^@/, '').replace(/[^a-zA-Z0-9_.-]+/g, '-');
}

/**
 * Creates the exposed modules of the remote of a package. Each module is
 * resolved from the app the same way that the app bundle would import it.
 */
export function getDeferredRemoteExposes(
  pkg: DeferredPackage,
  appDir: string,
): { [mount: string]: string } {
  return Object.fromEntries(
    Object.entries(pkg.entryPoints).map(([mount, entry]) => [
      mount,
      require.resolve(entry.import, { paths: [appDir] }),
    ]),
  );
}

/**
 * Builds each deferred package as a module federation remote in its own
 * directory of the target directory, with a Backstage manifest that lists
 * the manifests of the exposed plugins. The target directory is emptied
 * first, so that it only holds the remotes of the current packages.
 */
export async function buildDeferredRemotes(options: {
  packages: DeferredPackage[];
  /** The directory to write the remotes to. */
  targetDir: string;
  /** The directory of the app, which the exposed modules are resolved from. */
  appDir: string;
  frontendConfig: Config;
  frontendAppConfigs: AppConfig[];
  fullConfig: Config;
  webpack?: typeof import('webpack');
}): Promise<void> {
  const { packages, targetDir, appDir } = options;

  await fs.emptyDir(targetDir);
  for (const pkg of packages) {
    console.log(chalk.cyan(`Building ${pkg.name} as a deferred remote`));

    const role = pkg.packageJson.backstage?.role;
    if (!role) {
      throw new Error(
        `Unable to build ${pkg.name} as a deferred remote, its package.json has no backstage.role`,
      );
    }
    const backstageManifest: BackstageManifest = {
      manifestVersion: BACKSTAGE_MANIFEST_VERSION,
      packageName: pkg.name,
      role,
      frontend: {
        exposedModules: Object.fromEntries(
          Object.entries(pkg.entryPoints).map(([mount, entry]) => [
            mount,
            entry.manifest,
          ]),
        ),
      },
    };

    await buildBundle({
      targetDir: pkg.dir,
      entry: 'src/index',
      dist: resolvePath(targetDir, getRemoteDirName(pkg.name)),
      statsJsonEnabled: false,
      frontendConfig: options.frontendConfig,
      frontendAppConfigs: options.frontendAppConfigs,
      fullConfig: options.fullConfig,
      webpack: options.webpack,
      moduleFederationRemote: {
        name: getRemoteName(pkg.name),
        exposes: getDeferredRemoteExposes(pkg, appDir),
        sharedDependencies: defaultRemoteSharedDependencies(),
        backstageManifest,
      },
    });
  }
}
