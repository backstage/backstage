import { resolve as resolvePath } from 'path';

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
  const project = new LernaProject(resolvePath('.'));
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
