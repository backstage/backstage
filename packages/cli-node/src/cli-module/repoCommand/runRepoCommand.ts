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
import { ExitCodeError, run, targetPaths } from '@backstage/cli-common';
import { Lockfile, PackageGraph } from '../../monorepo';
import { SuccessCache } from '../../cache';
import { createPackageHasher } from './packageHash';
import { InputError } from '@backstage/errors';
import type { CliCommandContext, CliRunTargetOptions } from '../types';
import { RunInterrupt } from './interrupt';
import { createReporter } from './reporter';
import type { PackageStatus } from './reporter';
import { parseRepoArgs } from './parseRepoArgs';
import { buildInvocation } from './buildInvocation';
import {
  filterByChanged,
  matchPackages,
  mapFilesToPackages,
  selectPackages,
  SelectedPackage,
} from './selectPackages';

const DEBOUNCE_MS = 200;

interface RunSettings {
  concurrency: number;
  verbose: boolean;
  successCache?: {
    cache: SuccessCache;
    lockfile: Lockfile;
    graph: PackageGraph;
    targetName: string;
  };
}

async function runPackages(
  selected: SelectedPackage[],
  options: CliRunTargetOptions,
  settings: RunSettings,
  interrupt: RunInterrupt,
): Promise<string[]> {
  const failed = new Array<string>();
  const reporter = createReporter({
    verbose: settings.verbose,
    isTTY: Boolean(process.stdout.isTTY),
    write: text => process.stdout.write(text),
  });
  const cacheSettings = settings.successCache;
  const cacheEntries = cacheSettings
    ? await cacheSettings.cache.read()
    : undefined;
  const hashPackage = cacheSettings
    ? createPackageHasher({
        graph: cacheSettings.graph,
        lockfile: cacheSettings.lockfile,
        target: {
          name: cacheSettings.targetName,
          packageCommand: options.packageCommand,
        },
      })
    : undefined;
  reporter.begin(selected.map(item => item.pkg.packageJson.name));
  const stopListening = interrupt.onInterrupt(() => reporter.interrupt());

  const runOne = async (item: SelectedPackage) => {
    const name = item.pkg.packageJson.name;
    const push = (data: Buffer) => reporter.onOutput(name, data);
    let error: Error | undefined;
    let untrack = () => {};
    const hash = await hashPackage?.(item, options.packageArgs ?? []);
    if (hash && cacheEntries?.has(hash)) {
      reporter.onSkipped(name);
      return;
    }
    reporter.onStart(name);
    try {
      const child = run(
        buildInvocation({
          execPath: process.execPath,
          cliPath: process.argv[1],
          packageCommand: options.packageCommand,
          selected: item,
          packageArgs: options.packageArgs,
        }),
        {
          cwd: item.pkg.dir,
          onStdout: push,
          onStderr: push,
          // Gives each package its own process group, so that it and any
          // workers it spawns can be killed together on interrupt
          detached: true,
          stdio: ['ignore', 'pipe', 'pipe'],
        },
      );
      untrack = interrupt.track(child);
      await child.waitForExit();
    } catch (e) {
      error = e;
      if (!interrupt.interrupted) {
        failed.push(name);
      }
    }
    // A child that was killed by a signal resolves as a success, so the
    // result is not trustworthy once an interrupt has been received.
    let status: PackageStatus = 'PASS';
    if (interrupt.interrupted) {
      status = 'INTERRUPTED';
    } else if (error) {
      status = 'FAIL';
    }
    if (error && !interrupt.interrupted && !(error instanceof ExitCodeError)) {
      reporter.message(`${name}: ${error.stack ?? error}`);
    }
    reporter.onFinish(name, status);
    untrack();
    // Written right away so that progress is kept if the run is interrupted
    if (hash && status === 'PASS') {
      await cacheSettings?.cache.write([hash]);
    }
  };

  // A simple pool where each worker takes the next package until none are left
  const queue = [...selected];
  const workers = Array.from(
    { length: Math.max(1, Math.min(settings.concurrency, queue.length)) },
    async () => {
      while (!interrupt.interrupted) {
        const item = queue.shift();
        if (!item) {
          return;
        }
        await runOne(item);
      }
    },
  );
  try {
    await Promise.all(workers);
  } finally {
    stopListening();
    if (!interrupt.interrupted) {
      reporter.end();
    }
  }

  return failed;
}

function reportFailures(failed: string[], verbose: boolean) {
  if (failed.length > 0) {
    process.stdout.write(
      `\n${failed.length} package(s) failed:\n${failed
        .sort()
        .map(name => `  ${name}\n`)
        .join('')}`,
    );
    if (!verbose) {
      process.stdout.write(
        '\nRe-run with --verbose to see the output of each package.\n',
      );
    }
  }
}

/** @internal */
export interface RunRepoOptions extends CliRunTargetOptions {
  /** The name of the run target, used in cache keys */
  name: string;
}

/** @internal */
export async function runRepoCommand(
  options: RunRepoOptions,
  context: CliCommandContext,
  interrupt: RunInterrupt = new RunInterrupt(),
): Promise<void> {
  const dispose = interrupt.install();
  try {
    await runRepoCommandInternal(options, context, interrupt);
  } finally {
    dispose();
  }
}

async function runRepoCommandInternal(
  options: RunRepoOptions,
  context: CliCommandContext,
  interrupt: RunInterrupt,
): Promise<void> {
  const flags = parseRepoArgs(context.args, context.info.usage);
  if (!Number.isInteger(flags.concurrency) || flags.concurrency < 1) {
    throw new InputError(
      `Invalid --concurrency value, expected a positive integer but got ${flags.concurrency}`,
    );
  }
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

  if (flags.packages.length > 0) {
    const { matched, unmatched } = matchPackages({
      selected,
      values: flags.packages,
      cwd: process.cwd(),
    });
    if (unmatched.length > 0) {
      throw new InputError(
        `No package with a "${scriptName}" script that runs "backstage-cli ${options.packageCommand.join(
          ' ',
        )}" matches ${unmatched.map(value => `"${value}"`).join(', ')}`,
      );
    }
    // Dependents of named packages are only included when explicitly asked for
    selected =
      flags.includeDependents === true
        ? filterByChanged({
            selected,
            graph,
            changedNames: matched.map(({ pkg }) => pkg.packageJson.name),
            includeDependents: true,
          })
        : matched;
  }

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

  const settings: RunSettings = {
    concurrency: flags.concurrency,
    verbose: flags.verbose,
    successCache: flags.successCache
      ? {
          cache: SuccessCache.create({
            name: `run-${options.name}`,
            basePath: flags.successCacheDir,
          }),
          lockfile: await Lockfile.load(targetPaths.resolveRoot('yarn.lock')),
          graph,
          targetName: options.name,
        }
      : undefined,
  };
  const failed = await runPackages(selected, options, settings, interrupt);
  reportFailures(failed, flags.verbose);

  if (!flags.watch) {
    if (failed.length > 0) {
      throw new ExitCodeError(1, context.info.name);
    }
    return;
  }

  await watchPackages(
    selected,
    graph,
    options,
    flags,
    settings,
    includeDependents,
    interrupt,
  );
}

async function watchPackages(
  selected: SelectedPackage[],
  graph: PackageGraph,
  options: RunRepoOptions,
  flags: ReturnType<typeof parseRepoArgs>,
  settings: RunSettings,
  includeDependents: boolean,
  interrupt: RunInterrupt,
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
        reportFailures(
          await runPackages(toRun, options, settings, interrupt),
          flags.verbose,
        );
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

  return new Promise<never>(() => {});
}
