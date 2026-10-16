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

import { cli } from 'cleye';
import { parse as parseShellArgs } from 'shell-quote';
import { InputError } from '@backstage/errors';

const KNOWN_BOOLEAN_FLAGS = new Set([
  '--verbose',
  '--no-verbose',
  '--watch',
  '--no-watch',
  '--include-dependents',
  '--no-include-dependents',
  '--help',
  '-h',
]);

/** @internal */
export interface RepoCommandFlags {
  since?: string;
  /** Package names, globs or directories, from --package and positional arguments */
  packages: string[];
  /** Undefined unless explicitly set on the command line */
  includeDependents?: boolean;
  watch: boolean;
  concurrency: number;
  verbose: boolean;
}

/**
 * Parses the flags and package selectors of the repo command. Positional
 * arguments select packages, and nothing is passed on to the package command.
 *
 * @internal
 */
export function parseRepoArgs(
  allArgs: string[],
  name: string,
): RepoCommandFlags {
  if (allArgs.includes('--')) {
    throw new InputError(
      `Arguments can't be passed to the package command from "${name}", remove "--" and everything after it`,
    );
  }
  const args = allArgs;

  const { flags } = cli(
    {
      name,
      booleanFlagNegation: true,
      flags: {
        since: {
          type: String,
          description: 'Only include packages changed since the specified ref',
        },
        package: {
          type: [String],
          alias: 'p',
          description:
            'Only include the given package, as a name, a name glob or a directory, can be repeated',
        },
        includeDependents: {
          type: Boolean,
          description:
            'Also include local dependents of changed packages, overrides the command default',
        },
        concurrency: {
          type: Number,
          default: 8,
          description: 'Maximum number of packages to run at the same time',
        },
        verbose: {
          type: Boolean,
          default: false,
          description:
            'Stream the output of each package instead of a progress view',
        },
        watch: {
          type: Boolean,
          default: false,
          description: 'Re-run packages when their files change',
        },
      },
      ignoreArgv: type => type === 'unknown-flag' || type === 'argument',
    },
    undefined,
    args,
  );

  const selectors = new Array<string>();
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (
      arg === '--since' ||
      arg === '--concurrency' ||
      arg === '--package' ||
      arg === '-p'
    ) {
      i += 1;
    } else if (
      arg.startsWith('--since=') ||
      arg.startsWith('--concurrency=') ||
      arg.startsWith('--package=') ||
      KNOWN_BOOLEAN_FLAGS.has(arg)
    ) {
      // consumed
    } else if (arg.startsWith('-')) {
      throw new InputError(`Unknown option "${arg}" for "${name}"`);
    } else {
      selectors.push(arg);
    }
  }

  return {
    since: flags.since || undefined,
    packages: [...flags.package, ...selectors],
    includeDependents: flags.includeDependents,
    watch: flags.watch,
    concurrency: flags.concurrency,
    verbose: flags.verbose,
  };
}

/**
 * Returns the extra arguments of a package script if it invokes the given
 * `backstage-cli` command, or undefined if it does not.
 *
 * @internal
 */
export function parseScriptArgs(
  script: string | undefined,
  packageCommand: string[],
): string[] | undefined {
  const prefix = `backstage-cli ${packageCommand.join(' ')}`;
  if (!script || !script.startsWith(prefix)) {
    return undefined;
  }
  const rest = script.slice(prefix.length);
  if (rest && !/^\s/.test(rest)) {
    return undefined;
  }
  return parseShellArgs(rest.trim()).filter(
    (e): e is string => typeof e === 'string',
  );
}
