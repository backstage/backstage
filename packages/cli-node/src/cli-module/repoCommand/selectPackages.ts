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

import path from 'node:path';
import type { BackstagePackage, PackageGraph } from '../../monorepo';
import { parseScriptArgs } from './parseRepoArgs';

/** @internal */
export interface SelectedPackage {
  pkg: BackstagePackage;
  /** Extra arguments taken from the package script */
  scriptArgs: string[];
}

/**
 * Selects the packages that have opted in to a repo command through their
 * package.json scripts.
 *
 * @internal
 */
export function selectPackages(options: {
  packages: BackstagePackage[];
  packageCommand: string[];
  scriptName: string;
}): SelectedPackage[] {
  const result = new Array<SelectedPackage>();
  for (const pkg of options.packages) {
    const scriptArgs = parseScriptArgs(
      pkg.packageJson.scripts?.[options.scriptName],
      options.packageCommand,
    );
    if (scriptArgs) {
      result.push({ pkg, scriptArgs });
    }
  }
  return result;
}

/**
 * Narrows a selection to the given changed package names, optionally
 * including their local dependents. Only selected packages are returned.
 *
 * @internal
 */
export function filterByChanged(options: {
  selected: SelectedPackage[];
  graph: PackageGraph;
  changedNames: string[];
  includeDependents: boolean;
}): SelectedPackage[] {
  const { selected, graph, changedNames, includeDependents } = options;
  const names = includeDependents
    ? graph.collectPackageNames(changedNames, pkg =>
        pkg.allLocalDependents.keys(),
      )
    : new Set(changedNames);
  return selected.filter(({ pkg }) => names.has(pkg.packageJson.name));
}

/**
 * Maps changed files to the package that owns them, which is the package with
 * the longest matching directory. Files outside of all packages are ignored.
 *
 * @internal
 */
export function mapFilesToPackages(
  files: string[],
  packages: SelectedPackage[],
): Set<string> {
  const dirs = packages
    .map(({ pkg }) => ({ name: pkg.packageJson.name, dir: pkg.dir }))
    .sort((a, b) => b.dir.length - a.dir.length);

  const result = new Set<string>();
  for (const file of files) {
    const owner = dirs.find(
      ({ dir }) => file === dir || file.startsWith(dir + path.sep),
    );
    if (owner) {
      result.add(owner.name);
    }
  }
  return result;
}
