/*
 * Copyright 2024 The Backstage Authors
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

import { ModuleFederationRemoteOptions } from './types';
import { BackstagePackageJson } from '@backstage/cli-node';
import { readEntryPoints } from '../../../../lib/entryPoints';
import {
  createTypeDistProject,
  getEntryPointDefaultFeatureType,
} from '../../../../lib/typeDistProject';
import {
  SharedDependencies,
  Host,
  prepareRuntimeSharedDependenciesScript,
  defaultRemoteSharedDependencies,
  defaultHostSharedDependencies,
} from '@backstage/module-federation-common';
import { dirname, join as joinPath, resolve as resolvePath } from 'path';
import fs from 'fs-extra';
import chokidar from 'chokidar';
import PQueue from 'p-queue';

// Remote modules management utilities

export async function getModuleFederationRemoteOptions(
  packageJson: BackstagePackageJson,
  packageDir: string,
): Promise<ModuleFederationRemoteOptions | undefined> {
  let exposes: ModuleFederationRemoteOptions['exposes'];
  const packageRole = packageJson.backstage?.role;
  if (packageJson.exports && packageRole) {
    const project = await createTypeDistProject();
    exposes = Object.fromEntries(
      readEntryPoints(packageJson)
        .filter(ep => {
          if (ep.mount === './package.json') {
            return false;
          }
          if (ep.mount === '.') {
            return true;
          }
          // Include this additional entry point in the exposed modules
          // if it exports a feature as default export.
          return (
            getEntryPointDefaultFeatureType(
              packageRole,
              packageDir,
              project,
              ep.path,
            ) !== null
          );
        })
        .map(ep => [ep.mount, ep.path]),
    );
  }

  return {
    // The default output mode requires the name to be a usable as a code
    // symbol, there might be better options here but for now we need to
    // sanitize the name.
    name: packageJson.name
      .replaceAll('@', '')
      .replaceAll('/', '__')
      .replaceAll('-', '_'),
    exposes,
    sharedDependencies: defaultRemoteSharedDependencies(),
  };
}

// Module federation host management utilities

const RUNTIME_SHARED_DEPENDENCIES_MODULE_NAME =
  '__backstage-module-federation-runtime-shared-dependencies__';

// Make sure we're not issuing multiple writes at the same time, which can cause partial overwrites
const writeQueue = new PQueue({ concurrency: 1 });

async function writeRuntimeSharedDependenciesModule(
  targetPath: string,
  runtimeSharedDependencies: SharedDependencies<Host & { version: string }>,
) {
  const script = prepareRuntimeSharedDependenciesScript(
    runtimeSharedDependencies,
  );

  await writeQueue.add(async () => {
    const path = joinPath(
      targetPath,
      'node_modules',
      `${RUNTIME_SHARED_DEPENDENCIES_MODULE_NAME}.js`,
    );

    await fs.ensureDir(dirname(path));
    await fs.writeFile(path, script);
  });
}

function resolveSharedDependencyVersions(
  targetPath: string,
  hostSharedDependencies: SharedDependencies<Host>,
): SharedDependencies<Host & { version: string }> {
  return Object.fromEntries(
    Object.entries(hostSharedDependencies)
      .filter(([_, sharedDep]) => sharedDep !== undefined)
      .map(([name, sharedDep]) => {
        // Use require.resolve to find the package
        // For scoped modules, keep the scope and the module name, but remove any sub-folder
        const nameParts = name.split('/');
        const moduleName =
          nameParts[0].startsWith('@') && nameParts.length > 1
            ? `${nameParts[0]}/${nameParts[1]}`
            : nameParts[0];
        let packagePath: string;
        try {
          packagePath = require.resolve(`${moduleName}/package.json`, {
            paths: [targetPath],
          });
        } catch (e) {
          throw new Error(
            `Failed to resolve package.json for module federation shared dependency '${name}': ${e}`,
          );
        }
        const packageJson = require(packagePath);

        if (sharedDep.version && packageJson.version !== sharedDep.version) {
          throw new Error(
            `Version mismatch for module federation shared dependency '${name}': '${sharedDep.version}' vs '${packageJson.version}' found in '${packagePath}'.`,
          );
        }

        return [
          name,
          { ...sharedDep, version: sharedDep.version ?? packageJson.version },
        ];
      }),
  );
}

export async function createRuntimeSharedDependenciesEntryPoint(options: {
  targetPath: string;
  watch?: () => void;
}): Promise<string[]> {
  const { targetPath, watch } = options;

  const doWriteSharedDependenciesModule = async () => {
    const sharedDependencies = defaultHostSharedDependencies();
    await writeRuntimeSharedDependenciesModule(
      targetPath,
      resolveSharedDependencyVersions(targetPath, sharedDependencies),
    );
  };

  if (watch) {
    const watcher = chokidar.watch(resolvePath(targetPath, 'package.json'));
    watcher.on('change', async () => {
      await doWriteSharedDependenciesModule();
      watch();
    });
  }
  await doWriteSharedDependenciesModule();

  return [RUNTIME_SHARED_DEPENDENCIES_MODULE_NAME];
}
