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

function assertStringArray(
  value: unknown,
  field: string,
): asserts value is string[] {
  if (!Array.isArray(value)) {
    throw new Error(`${field} must be an array`);
  }
  if (!value.every((item): item is string => typeof item === 'string')) {
    throw new Error(`${field} must be an array of strings`);
  }
}

/**
 * Gets the workspaces patterns from a package.json object.
 *
 * Supports both the array form (`"workspaces": ["packages/*"]`) and the object
 * form (`"workspaces": { "packages": ["packages/*"] }`) from npm/yarn.
 *
 * @param pkgJson - The package.json object. Type as `unknown` so callers must pass parsed JSON; an object type check is performed.
 * @returns The workspaces patterns (globs not resolved). Empty array if none.
 * @throws Error if `pkgJson` is not an object or workspaces/packages contain non-strings.
 * @public
 */
export function getWorkspacesPatterns(pkgJson: unknown): string[] {
  if (typeof pkgJson !== 'object' || pkgJson === null) {
    throw new Error('pkgJson must be an object');
  }
  if (!('workspaces' in pkgJson)) {
    return [];
  }

  const workspaces = pkgJson.workspaces;
  if (Array.isArray(workspaces)) {
    assertStringArray(workspaces, 'pkgJson.workspaces');
    return workspaces;
  }
  if (
    typeof workspaces === 'object' &&
    workspaces !== null &&
    'packages' in workspaces &&
    Array.isArray(workspaces.packages)
  ) {
    assertStringArray(workspaces.packages, 'pkgJson.workspaces.packages');
    return workspaces.packages;
  }
  return [];
}
