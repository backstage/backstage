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

import os from 'os';
import crypto from 'node:crypto';
import yargs from 'yargs';
import { run as runJest, yargsOptions as jestYargsOptions } from 'jest-cli';
import { relative as relativePath } from 'path';
import { Command, OptionValues } from 'commander';
import { Lockfile, PackageGraph } from '@backstage/cli-node';
import { paths } from '../../lib/paths';
import { runCheck, runPlain } from '../../lib/run';
import { isChildPath } from '@backstage/cli-common';
import { SuccessCache } from '../../lib/cache/SuccessCache';

type JestProject = {
  displayName: string;
  rootDir: string;
};

interface TestGlobal extends Global {
  __backstageCli_jestSuccessCache?: {
    filterConfigs(
      projectConfigs: JestProject[],
      globalConfig: unknown,
    ): Promise<JestProject[]>;
    reportResults(results: {
      testResults: Array<{
        displayName?: { name: string };
        numFailingTests: number;
        testFilePath: string;
        testExecError: {
          message: string;
          stack: string;
        };
        failureMessage: string;
      }>;
    }): Promise<void>;
  };
  __backstageCli_watchProjectFilter?: {
    filter(projectConfigs: JestProject[]): Promise<JestProject[]>;
  };
}

/**
 * Use git to get the HEAD tree hashes of each package in the project.
 */
async function readPackageTreeHashes(graph: PackageGraph) {
  const pkgs = Array.from(graph.values()).map(pkg => ({
    ...pkg,
    path: relativePath(paths.targetRoot, pkg.dir),
  }));
  const output = await runPlain(
    'git',
    'ls-tree',
    '--format="%(objectname)=%(path)"',
    'HEAD',
    '--',
    ...pkgs.map(pkg => pkg.path),
  );

  const map = new Map(
    output
      .trim()
      .split(/\r?\n/)
      .map(line => {
        const [itemSha, ...itemPathParts] = line.split('=');
        const itemPath = itemPathParts.join('=');
        const pkg = pkgs.find(p => p.path === itemPath);
        if (!pkg) {
          throw new Error(
            `Unexpectedly missing tree sha entry for path ${itemPath}`,
          );
        }
        return [pkg.packageJson.name, itemSha];
      }),
  );

  return (pkgName: string) => {
    const sha = map.get(pkgName);
    if (!sha) {
      throw new Error(`Tree sha not found for ${pkgName}`);
    }
    return sha;
  };
}

export function createFlagFinder(args: string[]) {
  const flags = new Set<string>();

  for (const arg of args) {
    if (arg.startsWith('--no-')) {
      flags.add(`--${arg.slice('--no-'.length)}`);
    } else if (arg.startsWith('--')) {
      flags.add(arg.split('=')[0]);
    } else if (arg.startsWith('-')) {
      const shortFlags = arg.slice(1).split('');
      for (const shortFlag of shortFlags) {
        flags.add(`-${shortFlag}`);
      }
    }
  }

  return (...findFlags: string[]) => {
    for (const flag of findFlags) {
      if (flags.has(flag)) {
        return true;
      }
    }
    return false;
  };
}

function removeOptionArg(args: string[], option: string, size: number = 2) {
  let changed = false;
  do {
    changed = false;

    const index = args.indexOf(option);
    if (index >= 0) {
      changed = true;
      args.splice(index, size);
    }
    const indexEq = args.findIndex(arg => arg.startsWith(`${option}=`));
    if (indexEq >= 0) {
      changed = true;
      args.splice(indexEq, 1);
    }
  } while (changed);
}

export async function command(opts: OptionValues, cmd: Command): Promise<void> {
  const testGlobal = global as TestGlobal;

  // all args are forwarded to jest
  let parent = cmd;
  while (parent.parent) {
    parent = parent.parent;
  }
  const allArgs = parent.args as string[];
  const args = allArgs.slice(allArgs.indexOf('test') + 1);

  const hasFlags = createFlagFinder(args);

  // Parse the args to ensure that no file filters are provided, in which case we refuse to run
  const { _: parsedArgs } = await yargs(args).options(jestYargsOptions).argv;

  // Only include our config if caller isn't passing their own config
  if (!hasFlags('-c', '--config')) {
    args.push('--config', paths.resolveOwn('config/jest.js'));
  }

  if (!hasFlags('--passWithNoTests')) {
    args.push('--passWithNoTests');
  }

  // Run in watch mode unless in CI, coverage mode, or running all tests
  let isSingleWatchMode = args.includes('--watch');
  if (
    !opts.since &&
    !process.env.CI &&
    !hasFlags('--coverage', '--watch', '--watchAll')
  ) {
    const isGitRepo = () =>
      runCheck('git', 'rev-parse', '--is-inside-work-tree');
    const isMercurialRepo = () => runCheck('hg', '--cwd', '.', 'root');

    if ((await isGitRepo()) || (await isMercurialRepo())) {
      isSingleWatchMode = true;
      args.push('--watch');
    } else {
      args.push('--watchAll');
    }
  }

  // Due to our monorepo Jest project setup watch mode can be quite slow as it
  // will always scan all projects for matches. This is an optimization where if
  // the only provides filter paths from the repo root as args, we filter the
  // projects to only run tests for those.
  //
  // This does mean you're not able to edit the watch filters during the watch
  // session to point outside of the selected packages, but we consider that a
  // worthwhile tradeoff, and you can always avoid providing paths upfront.
  if (isSingleWatchMode && parsedArgs.length > 0) {
    testGlobal.__backstageCli_watchProjectFilter = {
      async filter(projectConfigs) {
        const selectedProjects = [];
        const usedArgs = new Set();

        for (const project of projectConfigs) {
          for (const arg of parsedArgs) {
            if (isChildPath(project.rootDir, String(arg))) {
              selectedProjects.push(project);
              usedArgs.add(arg);
            }
          }
        }

        // If we didn't end up using all args in the filtering we need to bail
        // and let Jest do the full filtering instead.
        if (usedArgs.size !== parsedArgs.length) {
          return projectConfigs;
        }

        return selectedProjects;
      },
    };
  }

  // When running tests from the repo root in large repos you can easily hit the heap limit.
  // This is because Jest workers leak a lot of memory, and the workaround is to limit worker memory.
  // We set a default memory limit, but if an explicit one is supplied it will be used instead
  if (!hasFlags('--workerIdleMemoryLimit')) {
    args.push('--workerIdleMemoryLimit=1000M');
  }

  // In order for the above worker memory limit to work we need to make sure the worker
  // count is set to at least 2, as the tests will otherwise run in-band.
  // Depending on the mode tests are run with the default count is either cpus-1, or cpus/2.
  // This means that if we've got at 4 or more cores we'll always get at least 2 workers, but
  // otherwise we need to set the worker count explicitly unless already done.
  if (
    os.cpus().length <= 3 &&
    !hasFlags('-i', '--runInBand', '-w', '--maxWorkers')
  ) {
    args.push('--maxWorkers=2');
  }

  if (opts.since) {
    removeOptionArg(args, '--since');
  }

  let packageGraph: PackageGraph | undefined;
  async function getPackageGraph() {
    if (packageGraph) {
      return packageGraph;
    }
    const packages = await PackageGraph.listTargetPackages();
    packageGraph = PackageGraph.fromPackages(packages);
    return packageGraph;
  }

  let selectedProjects: string[] | undefined = undefined;
  if (opts.since && !hasFlags('--selectProjects')) {
    const graph = await getPackageGraph();
    const changedPackages = await graph.listChangedPackages({
      ref: opts.since,
      analyzeLockfile: true,
    });

    selectedProjects = Array.from(
      graph.collectPackageNames(
        changedPackages.map(pkg => pkg.name),
        pkg => pkg.allLocalDependents.keys(),
      ),
    );

    if (selectedProjects.length === 0) {
      console.log(`No packages changed since ${opts.since}`);
      return;
    }

    args.push('--selectProjects', ...selectedProjects);
  }

  // This is the only thing that is not implemented by jest.run(), so we do it here instead
  // https://github.com/facebook/jest/blob/cd8828f7bbec6e55b4df5e41e853a5133c4a3ee1/packages/jest-cli/bin/jest.js#L12
  if (!process.env.NODE_ENV) {
    (process.env as any).NODE_ENV = 'test';
  }

  // This is to have a consistent timezone for when running tests that involve checking
  // the formatting of date/times.
  // https://stackoverflow.com/questions/56261381/how-do-i-set-a-timezone-in-my-jest-config
  if (!process.env.TZ) {
    process.env.TZ = 'UTC';
  }

  // This ensures that the process doesn't exit too early before stdout is flushed
  if (args.includes('--jest-help')) {
    removeOptionArg(args, '--jest-help');
    args.push('--help');
    (process.stdout as any)._handle.setBlocking(true);
  }

  // This code path is enabled by the --successCache flag, which is specific to
  // the `repo test` command in the Backstage CLI.
  if (opts.successCache) {
    removeOptionArg(args, '--successCache', 1);
    removeOptionArg(args, '--successCacheDir');

    // Refuse to run if file filters are provided
    if (parsedArgs.length > 0) {
      throw new Error(
        `The --successCache flag can not be combined with the following arguments: ${parsedArgs.join(
          ', ',
        )}`,
      );
    }
    // Likewise, it's not possible to combine sharding and the success cache
    if (args.includes('--shard')) {
      throw new Error(
        `The --successCache flag can not be combined with the --shard flag`,
      );
    }

    const cache = new SuccessCache('test', opts.successCacheDir);
    const graph = await getPackageGraph();

    // Shared state for the bridge
    const projectHashes = new Map<string, string>();
    const outputSuccessCache = new Array<string>();

    // Set up a bridge with the @backstage/cli/config/jest configuration file. These methods
    // are picked up by the config script itself, as well as the custom result processor.
    testGlobal.__backstageCli_jestSuccessCache = {
      // This is called by `config/jest.js` after the project configs have been gathered
      async filterConfigs(projectConfigs, globalRootConfig) {
        const cacheEntries = await cache.read();
        const lockfile = await Lockfile.load(
          paths.resolveTargetRoot('yarn.lock'),
        );
        const getPackageTreeHash = await readPackageTreeHashes(graph);

        // Base hash shared by all projects
        const baseHash = crypto.createHash('sha1');
        baseHash.update('v1'); // The version of this implementation
        baseHash.update('\0');
        baseHash.update(process.version); // Node.js version
        baseHash.update('\0');
        baseHash.update(
          SuccessCache.trimPaths(JSON.stringify(globalRootConfig)),
        ); // Variable global jest config
        const baseSha = baseHash.digest('hex');

        return projectConfigs.filter(project => {
          const packageName = project.displayName;
          const pkg = graph.get(packageName);
          if (!pkg) {
            throw new Error(
              `Package ${packageName} not found in package graph`,
            );
          }

          const hash = crypto.createHash('sha1');

          hash.update(baseSha); // Global base hash

          const packageTreeSha = getPackageTreeHash(packageName);
          hash.update(packageTreeSha); // Hash for target package contents

          for (const [depName, depPkg] of pkg.allLocalDependencies) {
            const depHash = getPackageTreeHash(depPkg.name);
            hash.update(`${depName}:${depHash}`); // Hash for each local monorepo dependency contents
          }

          // The project ID is a hash of the transform configuration, which helps
          // us bust the cache when any changes are made to the transform implementation.
          hash.update(SuccessCache.trimPaths(JSON.stringify(project)));
          hash.update(lockfile.getDependencyTreeHash(packageName));

          const sha = hash.digest('hex');

          projectHashes.set(packageName, sha);

          if (cacheEntries.has(sha)) {
            if (!selectedProjects || selectedProjects.includes(packageName)) {
              console.log(`Skipped ${packageName} due to cache hit`);
            }
            outputSuccessCache.push(sha);
            return undefined;
          }

          return project;
        });
      },
      // This is called by `config/jestCacheResultProcess.cjs` after all tests have run
      async reportResults(results) {
        const successful = new Set<string>();
        const failed = new Set<string>();

        for (const testResult of results.testResults) {
          for (const [pkgName, pkg] of graph) {
            if (isChildPath(pkg.dir, testResult.testFilePath)) {
              if (
                testResult.testExecError ||
                testResult.failureMessage ||
                testResult.numFailingTests > 0
              ) {
                failed.add(pkgName);
                successful.delete(pkgName);
              } else if (!failed.has(pkgName)) {
                successful.add(pkgName);
              }
              break;
            }
          }
        }

        for (const pkgName of successful) {
          const sha = projectHashes.get(pkgName);
          if (sha) {
            outputSuccessCache.push(sha);
          }
        }

        await cache.write(outputSuccessCache);
      },
    };
  }

  await runJest(args);
}
