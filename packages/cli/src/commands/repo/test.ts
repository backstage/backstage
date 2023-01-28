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
import { Command, OptionValues } from 'commander';
import { PackageGraph } from '../../lib/monorepo';
import { paths } from '../../lib/paths';
import { runCheck } from '../../lib/run';

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

function removeOptionArg(args: string[], option: string) {
  let changed = false;
  do {
    changed = false;

    const index = args.indexOf(option);
    if (index >= 0) {
      changed = true;
      args.splice(index, 2);
    }
    const indexEq = args.findIndex(arg => arg.startsWith(`${option}=`));
    if (indexEq >= 0) {
      changed = true;
      args.splice(indexEq, 1);
    }
  } while (changed);
}

export async function command(opts: OptionValues, cmd: Command): Promise<void> {
  // all args are forwarded to jest
  let parent = cmd;
  while (parent.parent) {
    parent = parent.parent;
  }
  const allArgs = parent.args as string[];
  const args = allArgs.slice(allArgs.indexOf('test') + 1);

  const hasFlags = createFlagFinder(args);

  // Only include our config if caller isn't passing their own config
  if (!hasFlags('-c', '--config')) {
    args.push('--config', paths.resolveOwn('config/jest.js'));
  }

  if (!hasFlags('--passWithNoTests')) {
    args.push('--passWithNoTests');
  }

  // Run in watch mode unless in CI, coverage mode, or running all tests
  if (!process.env.CI && !hasFlags('--coverage', '--watch', '--watchAll')) {
    const isGitRepo = () =>
      runCheck('git', 'rev-parse', '--is-inside-work-tree');
    const isMercurialRepo = () => runCheck('hg', '--cwd', '.', 'root');

    if ((await isGitRepo()) || (await isMercurialRepo())) {
      args.push('--watch');
    } else {
      args.push('--watchAll');
    }
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

  if (opts.since && !hasFlags('--selectProjects')) {
    const packages = await PackageGraph.listTargetPackages();
    const graph = PackageGraph.fromPackages(packages);
    const changedPackages = await graph.listChangedPackages({
      ref: opts.since,
      analyzeLockfile: true,
    });

    const packageNames = Array.from(
      graph.collectPackageNames(
        changedPackages.map(pkg => pkg.name),
        pkg => pkg.allLocalDependents.keys(),
      ),
    );

    if (packageNames.length === 0) {
      console.log(`No packages changed since ${opts.since}`);
      return;
    }

    args.push('--selectProjects', ...packageNames);
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

  await require('jest').run(args);
}
