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
import { packageFunctionality, type PackageSnapshot } from './manifest';

const PACKAGE_ROLE_SUFFIXES = ['backend', 'common', 'node', 'react'] as const;

// Most published packages don't declare `backstage.role` in their
// package.json, so `packageFunctionality` (sourced from `npm.backstageRole`)
// is undefined far more often than not. Fall back to the same
// `<primary>[-backend|-common|-node|-react]` / `<primary>-[backend-]module-<x>`
// naming convention the canonical backstage/backstage repo uses, relative to
// the plugin's own npmPackageName, so Frontend/Backend grouping keeps working
// without that field.
export function inferFunctionalityFromName(
  npmPackageName: string,
  primaryNpmPackageName: string,
): string | undefined {
  if (npmPackageName === primaryNpmPackageName) {
    return 'frontend';
  }
  const prefix = `${primaryNpmPackageName}-`;
  if (!npmPackageName.startsWith(prefix)) {
    return undefined;
  }
  const suffix = npmPackageName.slice(prefix.length);
  if (/^backend-module-.+$/.test(suffix)) {
    return 'backend-module';
  }
  if (/^module-.+$/.test(suffix)) {
    return 'module';
  }
  return (PACKAGE_ROLE_SUFFIXES as readonly string[]).includes(suffix)
    ? suffix
    : undefined;
}

export function resolveFunctionality(
  packageSnapshot: PackageSnapshot,
  primaryNpmPackageName: string,
): string | undefined {
  return (
    packageFunctionality(packageSnapshot) ??
    inferFunctionalityFromName(
      packageSnapshot.npmPackageName,
      primaryNpmPackageName,
    )
  );
}

// `functionality` is either a package's raw `backstage.role` (e.g.
// `'frontend-plugin'`, `'backend-plugin'`) or, when that's unavailable, the
// canonical short form inferred from its name (e.g. `'frontend'`,
// `'backend'`) — see resolveFunctionality above. Recognize both forms so the
// merge doesn't silently stop firing depending on which source populated it.
//
// This must be an exact match, not a `${role}-` prefix check: modules use
// `${role}-plugin-module` (raw form) or `${role}-module` (short form), both
// of which would otherwise also match (`'backend-module'.startsWith('backend-')`
// is true), causing a module package to be mistaken for the plugin's actual
// frontend/backend package.
export function matchesRole(
  functionality: string | undefined,
  role: 'frontend' | 'backend',
): boolean {
  return functionality === role || functionality === `${role}-plugin`;
}
