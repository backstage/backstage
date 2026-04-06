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

import crypto from 'node:crypto';
import { cli } from 'cleye';
import { relative as relativePath } from 'node:path';
import { Lockfile, PackageGraph, SuccessCache } from '@backstage/cli-node';

import {
  runCheck,
  runOutput,
  targetPaths,
  isChildPath,
} from '@backstage/cli-common';
import type { CliCommandContext } from '@backstage/cli-node';

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

async function readPackageTreeHashes(graph: PackageGraph) {
  const pkgs = Array.from(graph.values()).map(pkg => ({
    ...pkg,
    path: relativePath(targetPaths.rootDir, pkg.dir),
  }));
  const output = await runOutput([
    'git',
    'ls-tree',
    '--format=%(objectname)=%(path)',
    'HEAD',
    '--',
    ...pkgs.map(pkg => pkg.path),
  ]);

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

export default async ({ args, info }: CliCommandContext) => {
  for (const flag of ['successCache', 'successCacheDir']) {
    if (args.some(a => a === `--${flag}` || a.startsWith(`--${flag}=`))) {
      process.stderr.write(
        `DEPRECATION WARNING: --${flag} is deprecated, use the kebab-case form instead\n`,
      );
    }
  }

  // Parse Backstage-specific flags; unknown flags and arguments are left in
  // args so they can be forwarded to Vitest.
  const { flags: opts } = cli(
    {
      help: info,
      booleanFlagNegation: true,
      flags: {
        since: {
          type: String,
          description:
            'Only include test packages changed since the specified ref',
        },
        successCache: {
          type: Boolean,
          description: 'Cache and skip tests for unchanged packages',
        },
        successCacheDir: {
          type: String,
          description: 'Directory for the success cache',
        },
      },
      ignoreArgv: type => type === 'unknown-flag' || type === 'argument',
    },
    undefined,
    args,
  );

  const hasFlags = createFlagFinder(args);
  const sinceRef = opts.since || undefined;
  const fileFilters = args.filter(a => !a.startsWith('-'));

  // Run in watch mode unless in CI, coverage mode, or already specified
  let watchMode = args.includes('--watch');
  if (
    !sinceRef &&
    !process.env.CI &&
    !hasFlags('--coverage', '--coverage.enabled', '--watch', '--run')
  ) {
    const isGitRepo = () =>
      runCheck(['git', 'rev-parse', '--is-inside-work-tree']);
    const isMercurialRepo = () => runCheck(['hg', '--cwd', '.', 'root']);

    if ((await isGitRepo()) || (await isMercurialRepo())) {
      watchMode = true;
      args.push('--watch');
    }
  }

  if (!process.env.NODE_ENV) {
    (process.env as any).NODE_ENV = 'test';
  }

  if (!process.env.TZ) {
    process.env.TZ = 'UTC';
  }

  if (!process.env.NODE_OPTIONS?.includes('--node-snapshot')) {
    process.env.NODE_OPTIONS = `${
      process.env.NODE_OPTIONS ? `${process.env.NODE_OPTIONS} ` : ''
    }--no-node-snapshot`;
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

  let selectedPackages: string[] | undefined = undefined;
  if (sinceRef) {
    const graph = await getPackageGraph();
    const changedPackages = await graph.listChangedPackages({
      ref: sinceRef,
      analyzeLockfile: true,
    });

    selectedPackages = Array.from(
      graph.collectPackageNames(
        changedPackages.map(pkg => pkg.name),
        pkg => pkg.allLocalDependents.keys(),
      ),
    );

    if (selectedPackages.length === 0) {
      console.log(`No packages changed since ${opts.since}`);
      return;
    }
  }

  // Success cache — filter out packages that haven't changed
  let successCacheState:
    | {
        cache: SuccessCache;
        projectHashes: Map<string, string>;
        outputSuccessCache: string[];
      }
    | undefined;

  if (opts.successCache) {
    if (fileFilters.length > 0) {
      throw new Error(
        `The --success-cache flag can not be combined with the following arguments: ${fileFilters.join(
          ', ',
        )}`,
      );
    }

    const cache = SuccessCache.create({
      name: 'test',
      basePath: opts.successCacheDir,
    });
    const graph = await getPackageGraph();
    const cacheEntries = await cache.read();
    const lockfile = await Lockfile.load(targetPaths.resolveRoot('yarn.lock'));
    const getPackageTreeHash = await readPackageTreeHashes(graph);

    const baseHash = crypto.createHash('sha1');
    baseHash.update('v1-vitest');
    baseHash.update('\0');
    baseHash.update(process.version);
    const baseSha = baseHash.digest('hex');

    const projectHashes = new Map<string, string>();
    const outputSuccessCache: string[] = [];
    const skippedPackages = new Set<string>();

    for (const [pkgName, pkg] of graph) {
      const hash = crypto.createHash('sha1');
      hash.update(baseSha);

      try {
        const packageTreeSha = getPackageTreeHash(pkgName);
        hash.update(packageTreeSha);
      } catch {
        continue;
      }

      for (const [depName, depPkg] of pkg.allLocalDependencies) {
        try {
          const depHash = getPackageTreeHash(depPkg.name);
          hash.update(`${depName}:${depHash}`);
        } catch {
          // Skip missing deps
        }
      }

      hash.update(lockfile.getDependencyTreeHash(pkgName));
      const sha = hash.digest('hex');
      projectHashes.set(pkgName, sha);

      if (cacheEntries.has(sha)) {
        if (!selectedPackages || selectedPackages.includes(pkgName)) {
          console.log(`Skipped ${pkgName} due to cache hit`);
        }
        outputSuccessCache.push(sha);
        skippedPackages.add(pkgName);
      }
    }

    if (selectedPackages) {
      selectedPackages = selectedPackages.filter(p => !skippedPackages.has(p));
    }

    successCacheState = { cache, projectHashes, outputSuccessCache };
  }

  try {
    require.resolve('vitest');
  } catch {
    console.error(
      [
        'No Vitest installation found in this project.',
        '',
        'The Backstage CLI expects Vitest to be installed as a devDependency.',
        'Run: yarn add --dev vitest',
      ].join('\n'),
    );
    process.exit(1);
  }

  // eslint-disable-next-line @backstage/no-undeclared-imports
  const { parseCLI, startVitest } = await import('vitest/node');

  const vitestArgs = args.filter(
    a =>
      a !== '--watch' &&
      !a.startsWith('--since') &&
      !a.startsWith('--success-cache') &&
      !a.startsWith('--successCache'),
  );

  if (watchMode) {
    vitestArgs.push('--watch');
  }

  const { options, filter } = parseCLI(['vitest', ...vitestArgs]);

  const vitestOptions: Record<string, unknown> = {
    passWithNoTests: true,
    ...options,
  };
  if (selectedPackages) {
    const graph = await getPackageGraph();
    vitestOptions.projects = selectedPackages
      .map(name => {
        const pkg = graph.get(name);
        return pkg ? relativePath(targetPaths.rootDir, pkg.dir) : undefined;
      })
      .filter((p): p is string => Boolean(p));
  }

  const vitest = await startVitest(
    'test',
    [...filter, ...fileFilters],
    vitestOptions,
  );

  if (vitest && successCacheState) {
    const graph = await getPackageGraph();
    const testModules = vitest.state.getTestModules();
    const successful = new Set<string>();
    const failed = new Set<string>();

    for (const mod of testModules) {
      const filePath = mod.moduleId;
      for (const [pkgName, pkg] of graph) {
        if (isChildPath(pkg.dir, filePath)) {
          const state = mod.state();
          if (state === 'failed') {
            failed.add(pkgName);
            successful.delete(pkgName);
          } else if (state === 'passed' && !failed.has(pkgName)) {
            successful.add(pkgName);
          }
          break;
        }
      }
    }

    for (const pkgName of successful) {
      const sha = successCacheState.projectHashes.get(pkgName);
      if (sha) {
        successCacheState.outputSuccessCache.push(sha);
      }
    }

    await successCacheState.cache.write(successCacheState.outputSuccessCache);
  }

  if (vitest) {
    await vitest.close();
  }
};
