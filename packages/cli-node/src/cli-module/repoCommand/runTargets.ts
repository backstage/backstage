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

import { isDeepStrictEqual } from 'node:util';
import { InputError } from '@backstage/errors';
import type {
  CliCommand,
  CliCommandContext,
  CliRunTargetOptions,
} from '../types';

/** @internal */
export interface RegisteredRunTarget {
  name: string;
  options: CliRunTargetOptions;
  /** The name of the package that registered the target */
  moduleName: string;
}

/**
 * Merges the run targets of all modules. A target name may be registered by
 * several modules only if the options are identical.
 *
 * @internal
 */
export function mergeRunTargets(
  targets: ReadonlyArray<RegisteredRunTarget>,
): Map<string, RegisteredRunTarget> {
  const merged = new Map<string, RegisteredRunTarget>();
  for (const target of targets) {
    const existing = merged.get(target.name);
    if (!existing) {
      merged.set(target.name, target);
    } else if (!isDeepStrictEqual(existing.options, target.options)) {
      throw new Error(
        `Conflicting run target "${target.name}" registered by "${existing.moduleName}" and "${target.moduleName}" with different options`,
      );
    }
  }
  return merged;
}

function formatTargets(targets: Map<string, RegisteredRunTarget>): string[] {
  const width = Math.max(...Array.from(targets.keys(), name => name.length));
  return Array.from(targets.values())
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(
      ({ name, options }) => `  ${name.padEnd(width)}  ${options.description}`,
    );
}

async function loadRunner() {
  const mod = await import('./runRepoCommand');
  // Native dynamic imports of CommonJS only expose the exports object
  // as the default export, same as for command loaders in runCli.
  return typeof mod.runRepoCommand === 'function'
    ? mod.runRepoCommand
    : (mod as unknown as { default: typeof mod }).default.runRepoCommand;
}

/**
 * Creates the `repo run` command that dispatches to the registered targets.
 *
 * @internal
 */
export function createRunCommand(
  targets: Map<string, RegisteredRunTarget>,
  /** Overrides the lazily loaded implementation, for testing */
  runner?: (
    options: CliRunTargetOptions,
    context: CliCommandContext,
  ) => Promise<void>,
): CliCommand {
  return {
    path: ['repo', 'run'],
    description: 'Run a package command in every package of the repository',
    execute: async context => {
      const [name, ...args] = context.args;
      if (!name || name === '--help' || name === '-h') {
        process.stdout.write(
          [
            `${context.info.usage} <target> [options]`,
            '',
            'Run a package command in every package of the repository.',
            '',
            // The CLI report extraction only understands this section name
            'Commands:',
            ...formatTargets(targets),
            '',
            `Use "${context.info.usage} <target> --help" for the options of a target.`,
            '',
          ].join('\n'),
        );
        return;
      }
      const target = targets.get(name);
      if (!target) {
        throw new InputError(
          `Unknown run target "${name}", available targets are: ${Array.from(
            targets.keys(),
          )
            .sort()
            .join(', ')}`,
        );
      }
      const run = runner ?? (await loadRunner());
      await run(target.options, {
        args,
        info: {
          usage: `${context.info.usage} ${name}`,
          name: `${context.info.name} ${name}`,
        },
      });
    },
  };
}
