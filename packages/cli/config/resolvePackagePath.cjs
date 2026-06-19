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

const fs = require('node:fs');
const { createRequire } = require('node:module');
const path = require('node:path');
const { targetPaths } = require('@backstage/cli-common');

function hasDependency(targetPackage, packageName) {
  return Boolean(
    targetPackage.dependencies?.[packageName] ??
      targetPackage.devDependencies?.[packageName],
  );
}

function resolvePackagePath(request, packageName, legacyPath) {
  const packageJsonPath = path.resolve(targetPaths.rootDir, 'package.json');
  let targetPackage;
  try {
    targetPackage = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  } catch (error) {
    throw new Error(
      `Failed to read the target repository package.json at "${packageJsonPath}"`,
      { cause: error },
    );
  }

  const targetRequire = createRequire(packageJsonPath);
  let packageRequire = targetRequire;
  if (!hasDependency(targetPackage, packageName)) {
    if (!hasDependency(targetPackage, '@backstage/cli-defaults')) {
      throw new Error(
        `The legacy "${legacyPath}" path requires "${packageName}" or ` +
          `"@backstage/cli-defaults" to be installed directly in the target repository. ` +
          `Add one of them to dependencies or devDependencies in the root package.json.`,
      );
    }

    let defaultsPackageJsonPath;
    let defaultsPackage;
    try {
      defaultsPackageJsonPath = targetRequire.resolve(
        '@backstage/cli-defaults/package.json',
      );
      defaultsPackage = JSON.parse(
        fs.readFileSync(defaultsPackageJsonPath, 'utf8'),
      );
    } catch (error) {
      throw new Error(
        `Failed to resolve explicitly installed package "@backstage/cli-defaults" from the target repository. ` +
          `Run your package manager's install command and verify the dependency can be resolved.`,
        { cause: error },
      );
    }
    if (!hasDependency(defaultsPackage, packageName)) {
      throw new Error(
        `The legacy "${legacyPath}" path requires "${packageName}", which is not included in ` +
          `the installed "@backstage/cli-defaults" package. Install "${packageName}" directly instead.`,
      );
    }
    packageRequire = createRequire(defaultsPackageJsonPath);
  }

  try {
    return packageRequire.resolve(request);
  } catch (error) {
    throw new Error(
      `Failed to resolve package "${packageName}" from the CLI modules installed in the target repository. ` +
        `Run your package manager's install command and verify the dependency can be resolved.`,
      { cause: error },
    );
  }
}

function requirePackagePath(request, packageName, legacyPath) {
  return require(resolvePackagePath(request, packageName, legacyPath));
}

module.exports = { requirePackagePath, resolvePackagePath };
