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

  const isDirectDependency = Boolean(
    targetPackage.dependencies?.[packageName] ??
      targetPackage.devDependencies?.[packageName],
  );
  if (!isDirectDependency) {
    throw new Error(
      `The legacy "${legacyPath}" path requires "${packageName}" to be installed ` +
        `directly in the target repository. Add it to dependencies or devDependencies ` +
        `in the root package.json.`,
    );
  }

  try {
    return createRequire(packageJsonPath).resolve(request);
  } catch (error) {
    throw new Error(
      `Failed to resolve explicitly installed package "${packageName}" from the target repository. ` +
        `Run your package manager's install command and verify the dependency can be resolved.`,
      { cause: error },
    );
  }
}

function requirePackagePath(request, packageName, legacyPath) {
  return require(resolvePackagePath(request, packageName, legacyPath));
}

module.exports = { requirePackagePath, resolvePackagePath };
