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
import minimatch from 'minimatch';
import { getPackages } from '@manypkg/get-packages';
import { runPlain } from '../../lib/run';
import { NotFoundError } from '../errors';

const DEP_TYPES = [
  'dependencies',
  'devDependencies',
  'peerDependencies',
  'optionalDependencies',
] as const;

// Package data as returned by `yarn info`
export type YarnInfoInspectData = {
  name: string;
  'dist-tags': Record<string, string>;
  versions: string[];
  time: { [version: string]: string };
};

// Possible `yarn info` output
type YarnInfo = {
  type: 'inspect';
  data: YarnInfoInspectData | { type: string; data: unknown };
};

type PkgVersionInfo = {
  range: string;
  name: string;
  location: string;
};

export async function fetchPackageInfo(
  name: string,
): Promise<YarnInfoInspectData> {
  const output = await runPlain('yarn', 'info', '--json', name);

  if (!output) {
    throw new NotFoundError(`No package information found for package ${name}`);
  }

  const info = JSON.parse(output) as YarnInfo;
  if (info.type !== 'inspect') {
    throw new Error(`Received unknown yarn info for ${name}, ${output}`);
  }

  return info.data as YarnInfoInspectData;
}

/** Map all dependencies in the repo as dependency => dependents */
export async function mapDependencies(
  targetDir: string,
  pattern: string,
): Promise<Map<string, PkgVersionInfo[]>> {
  const { packages, root } = await getPackages(targetDir);

  // Include root package.json too
  packages.push(root);

  const dependencyMap = new Map<string, PkgVersionInfo[]>();
  for (const pkg of packages) {
    const deps = DEP_TYPES.flatMap(
      t => Object.entries(pkg.packageJson[t] ?? {}) as [string, string][],
    );

    for (const [name, range] of deps) {
      if (minimatch(name, pattern)) {
        dependencyMap.set(
          name,
          (dependencyMap.get(name) ?? []).concat({
            range,
            name: pkg.packageJson.name,
            location: pkg.dir,
          }),
        );
      }
    }
  }

  return dependencyMap;
}
