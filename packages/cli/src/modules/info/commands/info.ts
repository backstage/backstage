/*
 * Copyright 2025 The Backstage Authors
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

import { version as cliVersion } from '../../../../package.json';
import os from 'os';
import { runOutput } from '@backstage/cli-common';
import { paths } from '../../../lib/paths';
import { Lockfile } from '../../../lib/versioning';
import { BackstagePackageJson, PackageGraph } from '@backstage/cli-node';
import { minimatch } from 'minimatch';
import fs from 'fs-extra';

interface InfoOptions {
  include: string[];
}

/**
 * Attempts to read package.json from node_modules for a given package name.
 * Returns undefined if the package.json cannot be read.
 */
function tryReadPackageJson(
  packageName: string,
  targetPath: string,
): BackstagePackageJson | undefined {
  try {
    return require(require.resolve(`${packageName}/package.json`, {
      paths: [targetPath],
    }));
  } catch {
    return undefined;
  }
}

/**
 * Checks if a package has a backstage field in its package.json
 */
function hasBackstageField(
  packageName: string,
  targetPath: string,
): boolean {
  const pkg = tryReadPackageJson(packageName, targetPath);
  return pkg?.backstage !== undefined;
}

export default async (options: InfoOptions) => {
  await new Promise(async () => {
    const yarnVersion = await runOutput(['yarn', '--version']);
    const isLocal = fs.existsSync(paths.resolveOwn('./src'));

    const backstageFile = paths.resolveTargetRoot('backstage.json');
    let backstageVersion = 'N/A';
    if (fs.existsSync(backstageFile)) {
      try {
        const backstageJson = await fs.readJSON(backstageFile);
        backstageVersion = backstageJson.version ?? 'N/A';
      } catch (error) {
        console.warn('The "backstage.json" file is not in the expected format');
        console.log();
      }
    }

    console.log(`OS:   ${os.type} ${os.release} - ${os.platform}/${os.arch}`);
    console.log(`node: ${process.version}`);
    console.log(`yarn: ${yarnVersion}`);
    console.log(`cli:  ${cliVersion} (${isLocal ? 'local' : 'installed'})`);
    console.log(`backstage:  ${backstageVersion}`);
    console.log();

    const lockfilePath = paths.resolveTargetRoot('yarn.lock');
    const lockfile = await Lockfile.load(lockfilePath);
    const targetPath = paths.targetRoot;

    // Get workspace package names and their versions
    const workspacePackages = new Map<string, string>();
    try {
      const packages = await PackageGraph.listTargetPackages();
      for (const pkg of packages) {
        workspacePackages.set(pkg.packageJson.name, pkg.packageJson.version);
      }
    } catch {
      // If we can't list workspace packages, continue without them
    }

    // Collect all package names from lockfile
    const allPackages = [...lockfile.keys()];
    const includePatterns = options.include || [];

    // Collect installed (non-local) packages
    const installedDeps = new Set<string>();
    // Collect local workspace packages
    const localDeps = new Set<string>();

    // Process @backstage/* packages
    for (const pkg of allPackages) {
      if (pkg.startsWith('@backstage/')) {
        if (workspacePackages.has(pkg)) {
          localDeps.add(pkg);
        } else {
          installedDeps.add(pkg);
        }
      }
    }

    // Process packages matching --include patterns
    for (const pattern of includePatterns) {
      for (const pkg of allPackages) {
        if (minimatch(pkg, pattern)) {
          if (workspacePackages.has(pkg)) {
            localDeps.add(pkg);
          } else {
            installedDeps.add(pkg);
          }
        }
      }
    }

    // Process packages with backstage field in their package.json
    for (const pkg of allPackages) {
      // Skip @backstage/* packages (already processed above)
      if (pkg.startsWith('@backstage/')) {
        continue;
      }
      if (workspacePackages.has(pkg)) {
        // Check if local package has backstage field
        if (hasBackstageField(pkg, targetPath)) {
          localDeps.add(pkg);
        }
      } else if (hasBackstageField(pkg, targetPath)) {
        installedDeps.add(pkg);
      }
    }

    // Helper to get version string for a package
    const getVersions = (dep: string): string => {
      const entries = lockfile.get(dep);
      if (!entries) {
        return 'unknown';
      }
      const versions = [...new Set(entries.map(i => i.version))];
      return versions.join(', ');
    };

    // Print installed dependencies
    console.log('Dependencies:');
    const sortedInstalled = [...installedDeps].sort();
    if (sortedInstalled.length > 0) {
      const maxLength = Math.max(...sortedInstalled.map(d => d.length));
      for (const dep of sortedInstalled) {
        const versions = getVersions(dep);
        console.log(`  ${dep.padEnd(maxLength)} ${versions}`);
      }
    } else {
      console.log('  (no installed Backstage packages found)');
    }

    // Print local workspace packages
    if (localDeps.size > 0) {
      console.log();
      console.log('Local:');
      const sortedLocal = [...localDeps].sort();
      const maxLength = Math.max(...sortedLocal.map(d => d.length));
      for (const dep of sortedLocal) {
        const version = workspacePackages.get(dep) ?? 'unknown';
        console.log(`  ${dep.padEnd(maxLength)} ${version}`);
      }
    }
  });
};
