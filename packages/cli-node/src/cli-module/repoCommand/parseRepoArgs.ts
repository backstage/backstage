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

/** @internal */
export interface RepoCommandFlags {
  since?: string;
  /** Undefined unless explicitly set on the command line */
  includeDependents?: boolean;
  watch: boolean;
  /** Arguments that are not consumed by the repo command itself */
  forwarded: string[];
}

/**
 * Parses the flags owned by the repo command. Anything else, including
 * unknown flags and positional arguments, is forwarded to each package.
 *
 * @internal
 */
export function parseRepoArgs(args: string[], name: string): RepoCommandFlags {
  const { flags } = cli(
    {
      name,
      booleanFlagNegation: true,
      flags: {
        since: {
          type: String,
          description: 'Only include packages changed since the specified ref',
        },
        includeDependents: {
          type: Boolean,
          description:
            'Also include local dependents of changed packages, overrides the command default',
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

  const forwarded: string[] = [];
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--since') {
      i += 1;
    } else if (
      arg.startsWith('--since=') ||
      arg === '--watch' ||
      arg === '--no-watch' ||
      arg === '--include-dependents' ||
      arg === '--no-include-dependents'
    ) {
      // consumed
    } else {
      forwarded.push(arg);
    }
  }

  return {
    since: flags.since || undefined,
    includeDependents: flags.includeDependents,
    watch: flags.watch,
    forwarded,
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
