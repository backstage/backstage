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

import { Command, OptionValues } from 'commander';
import { PackageGraph } from '../../lib/monorepo';
import { paths } from '../../lib/paths';
import { runCheck } from '../../lib/run';

function includesAnyOf(hayStack: string[], ...needles: string[]) {
  for (const needle of needles) {
    if (hayStack.includes(needle)) {
      return true;
    }
  }
  return false;
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

  // Only include our config if caller isn't passing their own config
  if (!includesAnyOf(args, '-c', '--config')) {
    args.push('--config', paths.resolveOwn('config/jest.js'));
  }

  if (!includesAnyOf(args, '--no-passWithNoTests', '--passWithNoTests=false')) {
    args.push('--passWithNoTests');
  }

  // Run in watch mode unless in CI, coverage mode, or running all tests
  if (
    !process.env.CI &&
    !args.includes('--coverage') &&
    // explicitly no watching
    !includesAnyOf(args, '--no-watch', '--watch=false', '--watchAll=false') &&
    // already watching
    !includesAnyOf(args, '--watch', '--watchAll')
  ) {
    const isGitRepo = () =>
      runCheck('git', 'rev-parse', '--is-inside-work-tree');
    const isMercurialRepo = () => runCheck('hg', '--cwd', '.', 'root');

    if ((await isGitRepo()) || (await isMercurialRepo())) {
      args.push('--watch');
    } else {
      args.push('--watchAll');
    }
  }

  if (opts.since) {
    removeOptionArg(args, '--since');
  }

  if (opts.since && !args.some(arg => arg.startsWith('--selectProjects'))) {
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
