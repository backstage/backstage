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

import { BackstagePackageJson } from '@backstage/cli-node';
import { Config, ConfigReader } from '@backstage/config';
import chokidar from 'chokidar';
import fs from 'fs-extra';
import PQueue from 'p-queue';
import { join as joinPath, resolve as resolvePath } from 'path';
import { paths as cliPaths } from '../paths';

const DETECTED_MODULES_MODULE_NAME = '__backstage-autodetected-plugins__';

interface PackageDetectionConfig {
  include?: string[];
  exclude?: string[];
}

function readPackageDetectionConfig(
  config: Config,
): PackageDetectionConfig | undefined {
  const packages = config.getOptional('app.experimental.packages');
  if (packages === undefined || packages === null) {
    return undefined;
  }

  if (typeof packages === 'string') {
    if (packages !== 'all') {
      throw new Error(
        `Invalid app.experimental.packages mode, got '${packages}', expected 'all'`,
      );
    }
    return {};
  }

  if (typeof packages !== 'object' || Array.isArray(packages)) {
    throw new Error(
      "Invalid config at 'app.experimental.packages', expected object",
    );
  }
  const packagesConfig = new ConfigReader(
    packages,
    'app.experimental.packages',
  );

  return {
    include: packagesConfig.getOptionalStringArray('include'),
    exclude: packagesConfig.getOptionalStringArray('exclude'),
  };
}

async function detectPackages(
  targetPath: string,
  { include, exclude }: PackageDetectionConfig,
) {
  const pkg: BackstagePackageJson = await fs.readJson(
    resolvePath(targetPath, 'package.json'),
  );

  return Object.keys(pkg.dependencies ?? {}).flatMap(depName => {
    if (exclude?.includes(depName)) {
      return [];
    }
    if (include && !include.includes(depName)) {
      return [];
    }

    try {
      const depPackageJson: BackstagePackageJson = require(require.resolve(
        `${depName}/package.json`,
        { paths: [targetPath] },
      ));
      if (
        ['frontend-plugin', 'frontend-plugin-module'].includes(
          depPackageJson.backstage?.role ?? '',
        )
      ) {
        // Include alpha entry point if available. If there's no default export it will be ignored
        const exp = depPackageJson.exports;
        if (exp && typeof exp === 'object' && './alpha' in exp) {
          return [
            { name: depName, import: depName },
            { name: depName, export: './alpha', import: `${depName}/alpha` },
          ];
        }
        return [{ name: depName, import: depName }];
      }
    } catch {
      /* ignore packages that don't make package.json available */
    }
    return [];
  });
}

// Make sure we're not issuing multiple writes at the same time, which can cause partial overwrites
const writeQueue = new PQueue({ concurrency: 1 });

async function writeDetectedPackagesModule(
  pkgs: { name: string; export?: string; import: string }[],
) {
  const requirePackageScript = pkgs
    ?.map(
      pkg =>
        `{ name: ${JSON.stringify(pkg.name)}, export: ${JSON.stringify(
          pkg.export,
        )}, default: require('${pkg.import}').default }`,
    )
    .join(',');

  await writeQueue.add(() =>
    fs.writeFile(
      joinPath(
        cliPaths.targetRoot,
        'node_modules',
        `${DETECTED_MODULES_MODULE_NAME}.js`,
      ),
      `window['__@backstage/discovered__'] = { modules: [${requirePackageScript}] };`,
    ),
  );
}

export async function createDetectedModulesEntryPoint(options: {
  config: Config;
  targetPath: string;
  watch?: () => void;
}): Promise<string[]> {
  const { config, watch, targetPath } = options;

  const detectionConfig = readPackageDetectionConfig(config);
  if (!detectionConfig) {
    return [];
  }

  if (watch) {
    const watcher = chokidar.watch(resolvePath(targetPath, 'package.json'));

    watcher.on('change', async () => {
      await writeDetectedPackagesModule(
        await detectPackages(targetPath, detectionConfig),
      );
      watch();
    });
  }

  await writeDetectedPackagesModule(
    await detectPackages(targetPath, detectionConfig),
  );

  return [DETECTED_MODULES_MODULE_NAME];
}
