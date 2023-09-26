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
import { Config } from '@backstage/config';
import chokidar from 'chokidar';
import fs from 'fs-extra';
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

  return {
    include: config.getOptionalStringArray('app.experimental.packages.include'),
    exclude: config.getOptionalStringArray('app.experimental.packages.exclude'),
  };
}

async function detectPackages(
  targetPath: string,
  { include, exclude }: PackageDetectionConfig,
) {
  const pkg: BackstagePackageJson = await fs.readJson(
    resolvePath(targetPath, 'package.json'),
  );

  return Object.keys(pkg.dependencies ?? {})
    .flatMap(depName => {
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
          return [depName, `${depName}/alpha`];
        }
        return [depName];
      }
      return [];
    })
    .filter(name => {
      if (exclude?.includes(name)) {
        return false;
      }
      if (include && !include.includes(name)) {
        return false;
      }
      return true;
    });
}

async function writeDetectedPackagesModule(packageNames: string[]) {
  const requirePackageScript = packageNames
    ?.map(pkg => `{ name: '${pkg}', default: require('${pkg}').default }`)
    .join(',');

  await fs.writeFile(
    joinPath(
      cliPaths.targetRoot,
      'node_modules',
      `${DETECTED_MODULES_MODULE_NAME}.js`,
    ),
    `window['__@backstage/discovered__'] = { modules: [${requirePackageScript}] };`,
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
