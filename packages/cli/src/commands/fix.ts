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

import { paths } from '../lib/paths';
import { ESLint } from 'eslint';
import { join as joinPath, basename } from 'path';
import fs from 'fs-extra';
import { isChildPath } from '@backstage/cli-common';
import { PackageGraph } from '../lib/monorepo';

function isTestPath(filePath: string) {
  if (!isChildPath(joinPath(paths.targetDir, 'src'), filePath)) {
    return true;
  }
  const name = basename(filePath);
  return (
    name.startsWith('setupTests.') ||
    name.includes('.test.') ||
    name.includes('.stories.')
  );
}

export async function command() {
  const pkgJsonPath = paths.resolveTarget('package.json');
  const pkg = await fs.readJson(pkgJsonPath);
  if (pkg.workspaces) {
    throw new Error(
      'Adding dependencies to the workspace root is not supported',
    );
  }

  const packages = await PackageGraph.listTargetPackages();
  const localPackageVersions = new Map(
    packages.map(p => [p.packageJson.name, p.packageJson.version]),
  );

  const eslint = new ESLint({
    cwd: paths.targetDir,
    overrideConfig: {
      plugins: ['monorepo'],
      rules: {
        'import/no-extraneous-dependencies': [
          'error',
          {
            devDependencies: [
              `!${joinPath(paths.targetDir, 'src/**')}`,
              joinPath(paths.targetDir, 'src/**/*.test.*'),
              joinPath(paths.targetDir, 'src/**/*.stories.*'),
              joinPath(paths.targetDir, 'src/setupTests.*'),
            ],
            optionalDependencies: true,
            peerDependencies: true,
            bundledDependencies: true,
          },
        ],
      },
    },
    extensions: ['jsx', 'ts', 'tsx', 'mjs', 'cjs'],
  });

  const results = await eslint.lintFiles(['.']);

  const addedDeps = new Set<string>();
  const addedDevDeps = new Set<string>();
  const removedDevDeps = new Set<string>();

  for (const result of results) {
    for (const message of result.messages) {
      // Just in case
      if (message.ruleId !== 'import/no-extraneous-dependencies') {
        continue;
      }

      const match = message.message.match(/^'([^']*)' should be listed/);
      if (!match) {
        continue;
      }
      const packageName = match[1];
      if (!localPackageVersions.has(packageName)) {
        continue;
      }

      if (message.message.endsWith('not devDependencies.')) {
        addedDeps.add(packageName);
        removedDevDeps.add(packageName);
      } else if (isTestPath(result.filePath)) {
        addedDevDeps.add(packageName);
      } else {
        addedDeps.add(packageName);
      }
    }
  }

  if (addedDeps.size || addedDevDeps.size || removedDevDeps.size) {
    for (const name of addedDeps) {
      if (!pkg.dependencies) {
        pkg.dependencies = {};
      }
      pkg.dependencies[name] = `^${localPackageVersions.get(name)}`;
    }
    for (const name of addedDevDeps) {
      if (!pkg.devDependencies) {
        pkg.devDependencies = {};
      }
      pkg.devDependencies[name] = `^${localPackageVersions.get(name)}`;
    }
    for (const name of removedDevDeps) {
      delete pkg.devDependencies[name];
    }
    if (Object.keys(pkg.devDependencies).length === 0) {
      delete pkg.devDependencies;
    }

    if (pkg.dependencies) {
      pkg.dependencies = Object.fromEntries(
        Object.entries(pkg.dependencies).sort(([a], [b]) => a.localeCompare(b)),
      );
    }
    if (pkg.devDependencies) {
      pkg.devDependencies = Object.fromEntries(
        Object.entries(pkg.devDependencies).sort(([a], [b]) =>
          a.localeCompare(b),
        ),
      );
    }

    await fs.writeJson(pkgJsonPath, pkg, { spaces: 2 });
  }
}
