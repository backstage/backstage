/*
 * Copyright 2024 The Backstage Authors
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

import {
  OpaqueCliModule,
  OpaqueCommandTreeNode,
  OpaqueCommandLeafNode,
  isCommandNodeHidden,
} from '@internal/cli';
import type { CommandNode } from '@internal/cli';
import { Command } from 'commander';
import chalk from 'chalk';
import { isError, stringifyError } from '@backstage/errors';
import type { CliModule, CliCommand } from './types';

function buildCommandGraph(commands: ReadonlyArray<CliCommand>): CommandNode[] {
  const graph: CommandNode[] = [];

  for (const command of commands) {
    const { path } = command;
    let current = graph;

    for (let i = 0; i < path.length - 1; i++) {
      const name = path[i];
      let next = current.find(
        n =>
          OpaqueCommandTreeNode.isType(n) &&
          OpaqueCommandTreeNode.toInternal(n).name === name,
      );
      if (!next) {
        next = OpaqueCommandTreeNode.createInstance('v1', {
          name,
          children: [],
        });
        current.push(next);
      }
      current = OpaqueCommandTreeNode.toInternal(next).children;
    }

    current.push(
      OpaqueCommandLeafNode.createInstance('v1', {
        name: path[path.length - 1],
        command,
      }),
    );
  }

  return graph;
}

function exitWithError(error: unknown): never {
  process.stderr.write(`\n${chalk.red(stringifyError(error))}\n\n`);
  process.exit(
    isError(error) && 'code' in error && typeof error.code === 'number'
      ? error.code
      : 1,
  );
}

function registerCommands(
  graph: CommandNode[],
  program: Command,
  programName: string,
): void {
  const queue = graph.map(node => ({ node, argParser: program }));

  while (queue.length) {
    const { node, argParser } = queue.shift()!;

    if (OpaqueCommandTreeNode.isType(node)) {
      const internal = OpaqueCommandTreeNode.toInternal(node);
      const treeParser = argParser
        .command(`${internal.name} [command]`, {
          hidden: isCommandNodeHidden(node),
        })
        .description(internal.name);

      queue.push(
        ...internal.children.map(child => ({
          node: child,
          argParser: treeParser,
        })),
      );
    } else {
      const internal = OpaqueCommandLeafNode.toInternal(node);
      argParser
        .command(internal.name, {
          hidden:
            !!internal.command.deprecated || !!internal.command.experimental,
        })
        .description(internal.command.description)
        .helpOption(false)
        .allowUnknownOption(true)
        .allowExcessArguments(true)
        .action(async () => {
          try {
            const args = program.parseOptions(process.argv);

            const nonProcessArgs = args.operands.slice(2);
            const positionalArgs = [];
            let index = 0;
            for (
              let argIndex = 0;
              argIndex < nonProcessArgs.length;
              argIndex++
            ) {
              if (
                argIndex === index &&
                internal.command.path[argIndex] === nonProcessArgs[argIndex]
              ) {
                index += 1;
                continue;
              }
              positionalArgs.push(nonProcessArgs[argIndex]);
            }
            const context = {
              args: [...positionalArgs, ...args.unknown],
              info: {
                usage: [programName, ...internal.command.path].join(' '),
                name: internal.command.path.join(' '),
              },
            };

            if (typeof internal.command.execute === 'function') {
              await internal.command.execute(context);
            } else {
              const mod = await internal.command.execute.loader();
              const fn =
                typeof mod.default === 'function'
                  ? mod.default
                  : (mod.default as any).default;
              await fn(context);
            }
            process.exit(0);
          } catch (error: unknown) {
            exitWithError(error);
          }
        });
    }
  }
}

/**
 * Runs a CLI module as a standalone program.
 *
 * This helper extracts the commands from a {@link CliModule} and exposes
 * them as a fully functional CLI with help output and argument parsing.
 * It is intended to be called from a module package's `bin` entry point
 * so that the module can be executed directly without being wired into
 * a larger CLI host.
 *
 * @example
 * ```ts
 * #!/usr/bin/env node
 * import { runCliModule } from '@backstage/cli-node';
 * import cliModule from './index';
 *
 * runCliModule({
 *   module: cliModule,
 *   name: 'backstage-auth',
 *   version: require('../package.json').version,
 * });
 * ```
 *
 * @public
 */
export async function runCliModule(options: {
  /** The CLI module to run. */
  module: CliModule;
  /** The program name shown in help output and usage strings. */
  name: string;
  /** The version string shown when `--version` is passed. */
  version?: string;
}): Promise<void> {
  const { module: cliModule, name, version } = options;

  if (!OpaqueCliModule.isType(cliModule)) {
    throw new Error(
      `Invalid CLI module: expected a module created with createCliModule`,
    );
  }

  const internal = OpaqueCliModule.toInternal(cliModule);
  const commands = await internal.commands;
  const graph = buildCommandGraph(commands);

  const program = new Command();
  program.name(name).allowUnknownOption(true).allowExcessArguments(true);

  if (version) {
    program.version(version);
  }

  registerCommands(graph, program, name);

  program.on('command:*', () => {
    console.log();
    console.log(chalk.red(`Invalid command: ${program.args.join(' ')}`));
    console.log();
    program.outputHelp();
    process.exit(1);
  });

  process.on('unhandledRejection', rejection => {
    exitWithError(rejection);
  });

  await program.parseAsync(process.argv);
}
