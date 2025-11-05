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
  ConfiguredSharedDependencies,
  Remote,
  defaultRemoteSharedDependencies,
  getConfiguredHostSharedDependencies,
  defaultHostSharedDependencies,
  mergeSharedDependencies,
} from '@backstage/module-federation-common';
import { dirname, join as joinPath, resolve as resolvePath } from 'path';
import fs from 'fs-extra';
import chokidar from 'chokidar';
import PQueue from 'p-queue';
import { Config } from '@backstage/config';
import { z } from 'zod';
import { fromZodError } from 'zod-validation-error';

// Remote modules management utilities

export async function getModuleFederationRemoteOptions(
  packageJson: BackstagePackageJson,
  packageDir: string,
  configuredSharedDependencies:
    | ConfiguredSharedDependencies<Remote>
    | undefined,
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
    sharedDependencies: mergeSharedDependencies(
      defaultRemoteSharedDependencies(),
      configuredSharedDependencies,
      'allow-additions',
    ),
  };
}

// zod schema that corresponds to the ConfiguredSharedDependencies<Remote> type
const configuredRemoteSharedDependenciesSchema = z.record(
  z.string(),
  z.union([
    z.object({
      version: z.union([z.string(), z.literal(false)]).nullish(),
      requiredVersion: z.union([z.string(), z.literal(false)]).nullish(),
      singleton: z.boolean().optional(),
      import: z.literal(false).nullish(),
    }),
    z.literal(false),
  ]),
);

export function parseConfiguredRemoteSharedDependencies(
  json: string,
): ConfiguredSharedDependencies<Remote> {
  const parsed = configuredRemoteSharedDependenciesSchema.safeParse(
    JSON.parse(json),
  );
  if (!parsed.success) {
    throw new Error(
      `Invalid module federation shared dependencies: ${JSON.stringify(
        fromZodError(parsed.error).message,
      )}.`,
    );
  }
  return parsed.data;
}

// Module federation host management utilities

// zod schema that corresponds to the ConfiguredSharedDependencies<Host> type
const configuredHostSharedDependenciesSchema = z.record(
  z.string(),
  z.union([
    z.object({
      version: z.string().optional(),
      requiredVersion: z.union([z.string(), z.literal(false)]),
      singleton: z.boolean().optional(),
      eager: z.boolean().optional(),
    }),
    z.literal(false),
  ]),
);

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

export async function createRuntimeSharedDependeciesEntryPoint(options: {
  config: Config;
  targetPath: string;
  watch?: () => void;
}): Promise<string[]> {
  const { config, targetPath, watch } = options;

  const doWriteSharedDependenciesModule = async () => {
    const parsedConfiguredHostSharedDependencies =
      configuredHostSharedDependenciesSchema.safeParse(
        getConfiguredHostSharedDependencies(config),
      );
    if (!parsedConfiguredHostSharedDependencies.success) {
      throw new Error(
        `Invalid module federation shared dependencies in application config: ${JSON.stringify(
          fromZodError(parsedConfiguredHostSharedDependencies.error).message,
        )}.`,
      );
    }

    const sharedDependencies = mergeSharedDependencies(
      defaultHostSharedDependencies(),
      parsedConfiguredHostSharedDependencies.data,
      'allow-additions',
    );
    await writeRuntimeSharedDependenciesModule(
      targetPath,
      resolveSharedDependencyVersions(targetPath, sharedDependencies),
    );
  };

  if (watch) {
    const watcher = chokidar.watch(resolvePath(targetPath, 'package.json'));
    watcher.on('change', doWriteSharedDependenciesModule);
  }
  await doWriteSharedDependenciesModule();

  return [RUNTIME_SHARED_DEPENDENCIES_MODULE_NAME];
}
