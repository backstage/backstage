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
import {
  dirname,
  join as joinPath,
  resolve as resolvePath,
  sep,
} from 'node:path';
import { targetPaths } from '@backstage/cli-common';
import {
  analyzeFrontendPackage,
  FrontendPackageAnalysis,
} from '../frontendManifest/analyzeFrontendPackage';
import { readPackageManifest } from '../frontendManifest/readPackageManifest';
import { FrontendFeatureManifest } from '../frontendManifest/types';
import { readEntryPoints } from '../entryPoints';

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

/**
 * A package that is built as a module federation remote of the app, rather
 * than being included in the app bundle. The app loads it through the
 * remotes endpoint of the dynamic features backend, and defers its plugins.
 */
export type DeferredPackage = {
  name: string;
  /** The directory of the package. */
  dir: string;
  packageJson: BackstagePackageJson;
  /**
   * The entry points to expose from the remote, keyed by their mount, for
   * example "." or "./alpha", with the module to expose and its manifest.
   */
  entryPoints: {
    [mount: string]: { import: string; manifest: FrontendFeatureManifest };
  };
};

type PackageResolution =
  | { pkg: DetectedPackage; mode: 'eager'; reason: string }
  | {
      pkg: DetectedPackage;
      mode: 'deferred';
      manifest: FrontendFeatureManifest;
    };

/**
 * Reads the manifests of a package. Workspace packages are analyzed from
 * source, while other packages must ship the Backstage manifest that is
 * written when they are packed for publishing.
 */
async function readManifests(
  pkg: DetectedPackage,
): Promise<FrontendPackageAnalysis | { skipped: string }> {
  if (isWorkspacePackage(pkg.dir)) {
    try {
      return analyzeFrontendPackage({
        packageDir: pkg.dir,
        entryPoints: readEntryPoints(pkg.packageJson).filter(entry =>
          ['.', './alpha'].includes(entry.mount),
        ),
      });
    } catch (error) {
      return { skipped: `the analysis of the package failed, ${error}` };
    }
  }
  return readPackageManifest(pkg.dir);
}

function resolveEntry(
  pkg: DetectedPackage,
  analysis: FrontendPackageAnalysis | { skipped: string },
): PackageResolution {
  if ('skipped' in analysis) {
    return { pkg, mode: 'eager', reason: analysis.skipped };
  }
  const entry = analysis.entryPoints[pkg.export ?? '.'];
  if (!entry) {
    return { pkg, mode: 'eager', reason: 'no manifest for the entry point' };
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
  return { pkg, mode: 'deferred', manifest };
}

/**
 * Decides which detected entry points are bundled with the app, and which
 * packages are built as remotes instead.
 *
 * @remarks
 *
 * A package is only built as a remote if each of its entry points that
 * provides a feature can be deferred, so that the code of a package is never
 * split between the app bundle and a remote.
 */
async function resolveDeferredPackages(
  pkgs: DetectedPackage[],
  deferredPackages: DeferredPackagesConfig,
): Promise<{ eager: DetectedPackage[]; deferred: DeferredPackage[] }> {
  const byName = new Map<string, DetectedPackage[]>();
  for (const pkg of pkgs) {
    byName.set(pkg.name, [...(byName.get(pkg.name) ?? []), pkg]);
  }

  const eager = new Array<DetectedPackage>();
  const deferred = new Array<DeferredPackage>();
  const report = new Array<{ name: string; mode: string; reason: string }>();
  const nameOf = (pkg: DetectedPackage) =>
    `${pkg.name}${pkg.export ? pkg.export.slice(1) : ''}`;

  for (const [name, entries] of byName) {
    if (deferredPackages.exclude.includes(name)) {
      eager.push(...entries);
      for (const pkg of entries) {
        report.push({
          name: nameOf(pkg),
          mode: 'eager',
          reason: 'excluded in app.experimental.deferredPackages',
        });
      }
      continue;
    }

    const analysis = await readManifests(entries[0]);
    const resolutions = entries.map(pkg => resolveEntry(pkg, analysis));
    const deferrable = resolutions.filter(r => r.mode === 'deferred');
    // Entry points without a manifest don't provide a feature, for example
    // the legacy entry point of a package with a new frontend system plugin
    // in its alpha entry point.
    const blocking = resolutions.filter(
      r =>
        r.mode === 'eager' &&
        'entryPoints' in analysis &&
        'manifest' in (analysis.entryPoints[r.pkg.export ?? '.'] ?? {}),
    );

    if (deferrable.length === 0 || blocking.length > 0) {
      eager.push(...entries);
      for (const r of resolutions) {
        report.push({
          name: nameOf(r.pkg),
          mode: 'eager',
          reason:
            r.mode === 'eager'
              ? r.reason
              : 'another entry point of the package is loaded with the app',
        });
      }
      continue;
    }

    deferred.push({
      name,
      dir: entries[0].dir,
      packageJson: entries[0].packageJson,
      entryPoints: Object.fromEntries(
        deferrable.map(r => [
          r.pkg.export ?? '.',
          {
            import: r.pkg.import,
            manifest: (r as { manifest: FrontendFeatureManifest }).manifest,
          },
        ]),
      ),
    });
    for (const r of resolutions) {
      report.push({
        name: nameOf(r.pkg),
        mode: r.mode === 'deferred' ? 'remote' : 'skipped',
        reason:
          r.mode === 'deferred'
            ? 'built as a remote and loaded on first use'
            : r.reason,
      });
    }
  }

  console.log('Deferred package detection:');
  for (const { name, mode, reason } of report) {
    console.log(`  ${mode.padEnd(8)}  ${name} (${reason})`);
  }

  return { eager, deferred };
}

/**
 * Writes the module with the detected packages, and returns whether its
 * content changed.
 */
async function writeDetectedPackagesModule(
  targetPath: string,
  pkgs: DetectedPackage[],
): Promise<boolean> {
  const requirePackageScript = pkgs
    .map(
      pkg =>
        `{ name: ${JSON.stringify(pkg.name)}, export: ${JSON.stringify(
          pkg.export,
        )}, default: require('${pkg.import}').default }`,
    )
    .join(',');

  return writeQueue.add(async () => {
    const detectedModulesPath = joinPath(
      targetPath,
      'node_modules',
      `${DETECTED_MODULES_MODULE_NAME}.js`,
    );
    const content = `window['__@backstage/discovered__'] = { modules: [${requirePackageScript}] };`;

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
  /**
   * Called with the packages that are built as remotes rather than included
   * in the bundle, each time the detected packages change. Only called when
   * `app.experimental.deferredPackages` is enabled.
   */
  onDeferredPackages?: (packages: DeferredPackage[]) => Promise<void>;
}): Promise<string[]> {
  const { config, watch, targetPath, onDeferredPackages } = options;

  const detectionConfig = readPackageDetectionConfig(config);
  if (!detectionConfig) {
    return [];
  }
  const deferredPackages = readDeferredPackagesConfig(config);

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

  async function update() {
    const pkgs = await detectPackages(targetPath, detectionConfig!);
    if (!deferredPackages) {
      await writeDetectedPackagesModule(targetPath, pkgs);
      return;
    }
    const { eager, deferred } = await resolveDeferredPackages(
      pkgs,
      deferredPackages,
    );
    await onDeferredPackages?.(deferred);
    await writeDetectedPackagesModule(targetPath, eager);
  }

  if (watch) {
    const watcher = chokidar.watch(resolvePath(targetPath, 'package.json'));

    watcher.on('change', async () => {
      await update();
      watch();
    });
  }

  await update();

  return [DETECTED_MODULES_MODULE_NAME];
}
