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
import chokidar, { FSWatcher } from 'chokidar';
import fs from 'fs-extra';
import PQueue from 'p-queue';
import {
  dirname,
  join as joinPath,
  resolve as resolvePath,
  sep,
} from 'node:path';
import { targetPaths } from '@backstage/cli-common';
import {
  EntryPointAnalysis,
  FrontendPackageAnalysis,
} from '../frontendManifest/analyzeFrontendPackage';
import { readPackageManifest } from '../frontendManifest/readPackageManifest';
import { FrontendFeatureManifest } from '../frontendManifest/types';
import { WorkspaceManifestCache } from '../frontendManifest/WorkspaceManifestCache';

const DETECTED_MODULES_MODULE_NAME = '__backstage-autodetected-plugins__';

interface PackageDetectionConfig {
  include?: string[];
  exclude?: string[];
}

interface DeferredPackagesConfig {
  /** Packages that are always loaded with the app. */
  exclude: string[];
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

function readDeferredPackagesConfig(
  config: Config,
): DeferredPackagesConfig | undefined {
  const key = 'app.experimental.deferredPackages';
  const value = config.getOptional(key);
  if (value === undefined || value === false) {
    return undefined;
  }
  if (value === true) {
    return { exclude: [] };
  }
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error(
      `Invalid config at '${key}', expected a boolean or an object`,
    );
  }
  return {
    exclude:
      new ConfigReader(value, key).getOptionalStringArray('exclude') ?? [],
  };
}

type DetectedPackage = {
  name: string;
  export?: string;
  import: string;
  /** The directory of the package. */
  dir: string;
  packageJson: BackstagePackageJson;
};

function isWorkspacePackage(dir: string) {
  return !fs.realpathSync(dir).split(sep).includes('node_modules');
}

async function detectPackages(
  targetPath: string,
  { include, exclude }: PackageDetectionConfig,
): Promise<DetectedPackage[]> {
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
      const packageJsonPath = require.resolve(`${depName}/package.json`, {
        paths: [targetPath],
      });
      const depPackageJson: BackstagePackageJson = require(packageJsonPath);
      if (
        ['frontend-plugin', 'frontend-plugin-module'].includes(
          depPackageJson.backstage?.role ?? '',
        )
      ) {
        const base = {
          name: depName,
          dir: dirname(packageJsonPath),
          packageJson: depPackageJson,
        };
        // Include alpha entry point if available. If there's no default export it will be ignored
        const exp = depPackageJson.exports;
        if (exp && typeof exp === 'object' && './alpha' in exp) {
          return [
            { ...base, import: depName },
            { ...base, export: './alpha', import: `${depName}/alpha` },
          ];
        }
        return [{ ...base, import: depName }];
      }
    } catch {
      /* ignore packages that don't make package.json available */
    }
    return [];
  });
}

// Make sure we're not issuing multiple writes at the same time, which can cause partial overwrites
const writeQueue = new PQueue({ concurrency: 1 });

type DetectedEntry =
  | { pkg: DetectedPackage; mode: 'eager'; reason: string }
  | {
      pkg: DetectedPackage;
      mode: 'lazy';
      reason: string;
      manifest: FrontendFeatureManifest;
    };

/**
 * Reads the manifests of a package. Workspace packages are analyzed from
 * source, while other packages must ship a manifest from their build.
 */
async function readManifests(
  pkg: DetectedPackage,
  cache: WorkspaceManifestCache,
): Promise<FrontendPackageAnalysis | { skipped: string }> {
  if (isWorkspacePackage(pkg.dir)) {
    try {
      return await cache.analyze(pkg.dir, pkg.packageJson);
    } catch (error) {
      return { skipped: `the analysis of the package failed, ${error}` };
    }
  }
  return readPackageManifest(pkg.dir, pkg.packageJson);
}

async function resolveDetectedEntries(
  pkgs: DetectedPackage[],
  options: {
    deferredPackages: DeferredPackagesConfig;
    cache: WorkspaceManifestCache;
  },
): Promise<DetectedEntry[]> {
  const manifestsByPackage = new Map<
    string,
    Promise<FrontendPackageAnalysis | { skipped: string }>
  >();

  return Promise.all(
    pkgs.map(async (pkg): Promise<DetectedEntry> => {
      if (options.deferredPackages.exclude.includes(pkg.name)) {
        return {
          pkg,
          mode: 'eager',
          reason: 'excluded in app.experimental.deferredPackages',
        };
      }

      let manifests = manifestsByPackage.get(pkg.name);
      if (!manifests) {
        manifests = readManifests(pkg, options.cache);
        manifestsByPackage.set(pkg.name, manifests);
      }
      const result = await manifests;
      if ('skipped' in result) {
        return { pkg, mode: 'eager', reason: result.skipped };
      }
      const entry: EntryPointAnalysis | undefined =
        result.entryPoints[pkg.export ?? '.'];
      if (!entry) {
        return {
          pkg,
          mode: 'eager',
          reason: 'no manifest for the entry point',
        };
      }
      if ('skipped' in entry) {
        return { pkg, mode: 'eager', reason: entry.skipped };
      }
      const { manifest } = entry;
      if (manifest.type !== 'plugin' || !manifest.deferrable) {
        return {
          pkg,
          mode: 'eager',
          reason: manifest.notDeferrableReason ?? 'not deferrable',
        };
      }
      return {
        pkg,
        mode: 'lazy',
        reason: 'loaded on first use',
        manifest,
      };
    }),
  );
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

/** The name of the chunk that holds the code of a deferred entry point. */
function chunkNameOf(pkg: DetectedPackage) {
  const name = `${pkg.name}${pkg.export ? pkg.export.slice(1) : ''}`;
  return `deferred-${name.replace(/[^a-zA-Z0-9_-]+/g, '-').replace(/^-/, '')}`;
}

function lazyEntry(pkg: DetectedPackage, manifest: FrontendFeatureManifest) {
  return `{ name: ${JSON.stringify(pkg.name)}, export: ${JSON.stringify(
    pkg.export,
  )}, manifest: ${JSON.stringify(
    manifest,
  )}, load: () => import(/* webpackChunkName: ${JSON.stringify(
    chunkNameOf(pkg),
  )} */ '${pkg.import}') }`;
}

async function createDetectedPackagesScript(
  pkgs: DetectedPackage[],
  options: {
    deferredPackages?: DeferredPackagesConfig;
    cache: WorkspaceManifestCache;
  },
): Promise<string> {
  const { deferredPackages, cache } = options;
  if (!deferredPackages) {
    return pkgs.map(requireEntry).join(',');
  }

  const entries = await resolveDetectedEntries(pkgs, {
    deferredPackages,
    cache,
  });
  printDeferralReport(entries);
  return entries
    .map(entry =>
      entry.mode === 'lazy'
        ? lazyEntry(entry.pkg, entry.manifest)
        : requireEntry(entry.pkg),
    )
    .join(',');
}

/**
 * Writes the module with the detected packages, and returns whether its
 * content changed.
 */
async function writeDetectedPackagesModule(
  targetPath: string,
  script: string,
): Promise<boolean> {
  return writeQueue.add(async () => {
    const detectedModulesPath = joinPath(
      targetPath,
      'node_modules',
      `${DETECTED_MODULES_MODULE_NAME}.js`,
    );
    const content = `window['__@backstage/discovered__'] = { modules: [${script}] };`;

    if (
      (await fs.pathExists(detectedModulesPath)) &&
      (await fs.readFile(detectedModulesPath, 'utf8')) === content
    ) {
      return false;
    }
    await fs.ensureDir(dirname(detectedModulesPath));
    await fs.writeFile(detectedModulesPath, content);
    return true;
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
  const deferredPackages = readDeferredPackagesConfig(config);
  const cache = new WorkspaceManifestCache(
    joinPath(
      targetPath,
      'node_modules',
      '.cache',
      'backstage-frontend-manifests',
    ),
  );

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

  // The source of each workspace package that can be deferred is watched,
  // so that its manifest is updated when it changes
  const sourceWatchers = new Map<string, FSWatcher>();
  let pkgs = await detectPackages(targetPath, detectionConfig);

  async function update() {
    const script = await createDetectedPackagesScript(pkgs, {
      deferredPackages,
      cache,
    });
    const changed = await writeDetectedPackagesModule(targetPath, script);
    if (watch && deferredPackages) {
      watchSources();
    }
    return changed;
  }

  function watchSources() {
    const dirs = new Set(
      pkgs.filter(pkg => isWorkspacePackage(pkg.dir)).map(pkg => pkg.dir),
    );
    for (const [dir, watcher] of sourceWatchers) {
      if (!dirs.has(dir)) {
        watcher.close();
        sourceWatchers.delete(dir);
      }
    }
    for (const dir of dirs) {
      if (sourceWatchers.has(dir)) {
        continue;
      }
      const watcher = chokidar.watch(resolvePath(dir, 'src'), {
        ignoreInitial: true,
      });
      watcher.on('all', async () => {
        cache.invalidate(dir);
        if (await update()) {
          watch?.();
        }
      });
      sourceWatchers.set(dir, watcher);
    }
  }

  if (watch) {
    const watcher = chokidar.watch(resolvePath(targetPath, 'package.json'));

    watcher.on('change', async () => {
      pkgs = await detectPackages(targetPath, detectionConfig);
      await update();
      watch();
    });
  }

  await update();

  return [DETECTED_MODULES_MODULE_NAME];
}
