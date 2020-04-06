/*
 * Copyright 2020 Spotify AB
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

import { paths } from 'helpers/paths';

const LernaProject = require('@lerna/project');
const PackageGraph = require('@lerna/package-graph');

export type Package = {
  name: string;
  location: string;
  scripts: { [name in string]: string };
};

// Uses lerna to find all local deps of the root package, excluding itself or any package in the blacklist
export async function findAllDeps(
  rootPackageName: string,
  blacklist: string[],
): Promise<Package[]> {
  const project = new LernaProject(paths.targetDir);
  const packages = await project.getPackages();
  const graph = new PackageGraph(packages);

  const deps = new Map<string, any>();
  const searchNames = [rootPackageName];

  while (searchNames.length) {
    const name = searchNames.pop()!;

    if (deps.has(name)) {
      continue;
    }

    const node = graph.get(name);
    if (!node) {
      throw new Error(`Package '${name}' not found`);
    }

    searchNames.push(...node.localDependencies.keys());
    deps.set(name, node.pkg);
  }

  deps.delete(rootPackageName);
  for (const name of blacklist) {
    deps.delete(name);
  }

  return [...deps.values()];
}
