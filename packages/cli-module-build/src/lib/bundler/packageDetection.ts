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
import { dirname, join as joinPath, resolve as resolvePath } from 'node:path';
import { targetPaths } from '@backstage/cli-common';
import {
  ExtractedManifest,
  extractManifests,
} from './manifest/extractManifests';

const DETECTED_MODULES_MODULE_NAME = '__backstage-autodetected-plugins__';

interface PackageDetectionConfig {
  include?: string[];
  exclude?: string[];
}

function readPackageDetectionConfig(
  config: Config,
): PackageDetectionConfig | undefined {
  const packages = config.getOptional('app.packages');
  if (packages === undefined || packages === null) {
    return undefined;
  }

  if (typeof packages === 'string') {
    if (packages !== 'all') {
      throw new Error(
        `Invalid app.packages mode, got '${packages}', expected 'all'`,
      );
    }
    return {};
  }

  if (typeof packages !== 'object' || Array.isArray(packages)) {
    throw new Error("Invalid config at 'app.packages', expected object");
  }
  const packagesConfig = new ConfigReader(packages, 'app.packages');

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

type DetectedPackage = { name: string; export?: string; import: string };

const IMPORT_SCAN_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs'];

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');
}

/**
 * Finds the detected packages that are imported by the source of the app. A
 * static import stops the bundler from splitting a package into its own chunk.
 */
async function findStaticallyImportedPackages(
  targetPath: string,
  pkgs: DetectedPackage[],
): Promise<Set<string>> {
  const found = new Set<string>();
  // Matches the package itself as well as any sub-path import
  const patterns = Array.from(new Set(pkgs.map(pkg => pkg.name))).map(name => ({
    name,
    pattern: new RegExp(`['"]${escapeRegExp(name)}(?:/[^'"]*)?['"]`),
  }));

  async function scan(dir: string) {
    for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
      const path = joinPath(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name !== 'node_modules') {
          await scan(path);
        }
      } else if (
        IMPORT_SCAN_EXTENSIONS.some(ext => entry.name.endsWith(ext)) &&
        !/\.test\.[jt]sx?$/.test(entry.name)
      ) {
        const content = await fs.readFile(path, 'utf8');
        for (const { name, pattern } of patterns) {
          if (!found.has(name) && pattern.test(content)) {
            found.add(name);
          }
        }
      }
    }
  }

  const srcDir = resolvePath(targetPath, 'src');
  if (await fs.pathExists(srcDir)) {
    await scan(srcDir);
  }
  return found;
}

type DetectedEntry =
  | { pkg: DetectedPackage; mode: 'eager'; reason: string }
  | {
      pkg: DetectedPackage;
      mode: 'lazy';
      reason: string;
      manifest: ExtractedManifest;
    };

async function resolveDetectedEntries(
  targetPath: string,
  pkgs: DetectedPackage[],
): Promise<DetectedEntry[]> {
  const imported = await findStaticallyImportedPackages(targetPath, pkgs);
  const keyOf = (pkg: DetectedPackage) => `${pkg.name}${pkg.export ?? ''}`;
  const results = await extractManifests({
    appDir: targetPath,
    packages: pkgs
      .filter(pkg => !imported.has(pkg.name))
      .map(pkg => ({ key: keyOf(pkg), import: pkg.import })),
  });

  return pkgs.map((pkg): DetectedEntry => {
    if (imported.has(pkg.name)) {
      return { pkg, mode: 'eager', reason: 'statically imported by app' };
    }
    const result = results.get(keyOf(pkg));
    if (!result || 'error' in result) {
      return {
        pkg,
        mode: 'eager',
        reason: `manifest extraction failed: ${
          result && 'error' in result ? result.error : 'no result'
        }`,
      };
    }
    if ('skipped' in result) {
      return { pkg, mode: 'eager', reason: result.skipped };
    }
    if (!result.manifest.deferrable) {
      return {
        pkg,
        mode: 'eager',
        reason: result.manifest.notDeferrableReason ?? 'not deferrable',
      };
    }
    return {
      pkg,
      mode: 'lazy',
      reason: 'only provides pages',
      manifest: result.manifest,
    };
  });
}

function printDeferralReport(entries: DetectedEntry[]) {
  console.log('Deferred package detection:');
  for (const { pkg, mode, reason } of entries) {
    const name = `${pkg.name}${pkg.export ? pkg.export.slice(1) : ''}`;
    console.log(
      `  ${mode === 'lazy' ? 'deferred' : 'eager   '}  ${name} (${reason})`,
    );
  }
}

function requireEntry(pkg: DetectedPackage) {
  return `{ name: ${JSON.stringify(pkg.name)}, export: ${JSON.stringify(
    pkg.export,
  )}, default: require('${pkg.import}').default }`;
}

async function writeDetectedPackagesModule(
  targetPath: string,
  pkgs: DetectedPackage[],
  options: { deferredPackages: boolean },
) {
  let requirePackageScript: string;
  if (options.deferredPackages) {
    const entries = await resolveDetectedEntries(targetPath, pkgs);
    printDeferralReport(entries);
    requirePackageScript = entries
      .map(entry =>
        entry.mode === 'lazy'
          ? `{ name: ${JSON.stringify(
              entry.pkg.name,
            )}, export: ${JSON.stringify(
              entry.pkg.export,
            )}, manifest: ${JSON.stringify(
              entry.manifest,
            )}, load: () => import('${entry.pkg.import}') }`
          : requireEntry(entry.pkg),
      )
      .join(',');
  } else {
    requirePackageScript = pkgs.map(requireEntry).join(',');
  }

  await writeQueue.add(async () => {
    const detectedModulesPath = joinPath(
      targetPath,
      'node_modules',
      `${DETECTED_MODULES_MODULE_NAME}.js`,
    );

    await fs.ensureDir(dirname(detectedModulesPath));
    await fs.writeFile(
      detectedModulesPath,
      `window['__@backstage/discovered__'] = { modules: [${requirePackageScript}] };`,
    );
  });
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
  const writeOptions = {
    deferredPackages:
      config.getOptionalBoolean('app.experimental.deferredPackages') ?? false,
  };

  // Previous versions of the CLI would write the detected modules file to the
  // root `node_modules`, this makes sure that doesn't exist to minimize risk of conflicts
  const legacyDetectedModulesPath = joinPath(
    targetPaths.rootDir,
    'node_modules',
    `${DETECTED_MODULES_MODULE_NAME}.js`,
  );
  if (await fs.pathExists(legacyDetectedModulesPath)) {
    await fs.remove(legacyDetectedModulesPath);
  }

  if (watch) {
    const watcher = chokidar.watch(resolvePath(targetPath, 'package.json'));

    watcher.on('change', async () => {
      await writeDetectedPackagesModule(
        targetPath,
        await detectPackages(targetPath, detectionConfig),
        writeOptions,
      );
      watch();
    });
  }

  await writeDetectedPackagesModule(
    targetPath,
    await detectPackages(targetPath, detectionConfig),
    writeOptions,
  );

  return [DETECTED_MODULES_MODULE_NAME];
}
