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

import chokidar from 'chokidar';
import { ExitCodeError, run } from '@backstage/cli-common';
import { PackageGraph } from '../../monorepo';
import { runConcurrentTasks } from '../../concurrency';
import type { CliCommandContext, CliRepoCommandOptions } from '../types';
import { parseRepoArgs } from './parseRepoArgs';
import { buildInvocation } from './buildInvocation';
import {
  filterByChanged,
  mapFilesToPackages,
  selectPackages,
  SelectedPackage,
} from './selectPackages';

const DEBOUNCE_MS = 200;

async function runPackages(
  selected: SelectedPackage[],
  options: CliRepoCommandOptions,
  forwarded: string[],
): Promise<string[]> {
  const failed = new Array<string>();

  await runConcurrentTasks({
    items: selected,
    worker: async item => {
      const name = item.pkg.packageJson.name;
      const chunks = new Array<Buffer>();
      const push = (data: Buffer) => chunks.push(data);
      let error: Error | undefined;
      try {
        await run(
          buildInvocation({
            execPath: process.execPath,
            cliPath: process.argv[1],
            packageCommand: options.packageCommand,
            selected: item,
            packageArgs: options.packageArgs,
            forwarded,
          }),
          { cwd: item.pkg.dir, onStdout: push, onStderr: push },
        ).waitForExit();
      } catch (e) {
        error = e;
        failed.push(name);
      }
      process.stdout.write(
        `${error ? 'FAIL' : 'PASS'} ${name}\n${Buffer.concat(chunks)}`,
      );
      if (error && !(error instanceof ExitCodeError)) {
        process.stdout.write(`${error.stack ?? error}\n`);
      }
    },
  });

  return failed;
}

function reportFailures(failed: string[]) {
  if (failed.length > 0) {
    process.stdout.write(
      `\n${failed.length} package(s) failed:\n${failed
        .sort()
        .map(name => `  ${name}\n`)
        .join('')}`,
    );
  }
}

/** @internal */
export async function runRepoCommand(
  options: CliRepoCommandOptions,
  context: CliCommandContext,
): Promise<void> {
  const flags = parseRepoArgs(context.args, context.info.usage);
  const includeDependents =
    flags.includeDependents ?? options.includeDependents ?? true;
  const scriptName =
    options.scriptName ??
    options.packageCommand[options.packageCommand.length - 1];

  const packages = await PackageGraph.listTargetPackages();
  const graph = PackageGraph.fromPackages(packages);
  let selected = selectPackages({
    packages,
    packageCommand: options.packageCommand,
    scriptName,
  });

  if (flags.since) {
    const changed = await graph.listChangedPackages({
      ref: flags.since,
      analyzeLockfile: true,
    });
    selected = filterByChanged({
      selected,
      graph,
      changedNames: changed.map(pkg => pkg.name),
      includeDependents,
    });
    if (selected.length === 0) {
      console.log(`No packages changed since ${flags.since}`);
      return;
    }
  }

  if (selected.length === 0) {
    console.log(
      `No packages have a "${scriptName}" script that runs "backstage-cli ${options.packageCommand.join(
        ' ',
      )}"`,
    );
    return;
  }

  const failed = await runPackages(selected, options, flags.forwarded);
  reportFailures(failed);

  if (!flags.watch) {
    if (failed.length > 0) {
      throw new ExitCodeError(1, context.info.name);
    }
    return;
  }

  await watchPackages(selected, graph, options, flags, includeDependents);
}

async function watchPackages(
  selected: SelectedPackage[],
  graph: PackageGraph,
  options: CliRepoCommandOptions,
  flags: ReturnType<typeof parseRepoArgs>,
  includeDependents: boolean,
): Promise<never> {
  const pending = new Set<string>();
  let timer: NodeJS.Timeout | undefined;
  let running = false;

  const flush = async () => {
    timer = undefined;
    if (running) {
      return; // re-triggered when the current run finishes
    }
    running = true;
    try {
      while (pending.size > 0) {
        const changedNames = Array.from(pending);
        pending.clear();
        const toRun = filterByChanged({
          selected,
          graph,
          changedNames,
          includeDependents,
        });
        reportFailures(await runPackages(toRun, options, flags.forwarded));
      }
    } finally {
      running = false;
    }
  };

  const watcher = chokidar.watch(
    selected.map(({ pkg }) => pkg.dir),
    {
      ignored: /(^|[/\\])(node_modules|dist|\.git)([/\\]|$)/,
      ignoreInitial: true,
    },
  );
  watcher.on('all', (_event, file) => {
    for (const name of mapFilesToPackages([file], selected)) {
      pending.add(name);
    }
    if (pending.size > 0) {
      clearTimeout(timer);
      timer = setTimeout(flush, DEBOUNCE_MS);
    }
  });

  process.once('SIGINT', () => {
    watcher.close().finally(() => process.exit(0));
  });
  return new Promise<never>(() => {});
}
