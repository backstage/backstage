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

import {
  OpaqueCliModule,
  OpaqueCommandLeafNode,
  OpaqueCommandTreeNode,
  isCommandNodeHidden,
} from '@internal/cli';
import type { CommandNode } from '@internal/cli';
import { ForwardedError, isError, stringifyError } from '@backstage/errors';
import chalk from 'chalk';
import { cli, command } from 'cleye';
import type { Renderers } from 'cleye';
import { CommandGraph } from './CommandGraph';
import type { CliCommand, CliModule } from './types';

interface HelpNode {
  id?: string;
  type: keyof Renderers;
  data: unknown;
}

interface CommandsHelpData {
  body: {
    data: {
      tableData: string[][];
    };
  };
}

function exit(message: string, code: number = 1): never {
  process.stderr.write(`\n${chalk.red(message)}\n\n`);
  process.exit(code);
}

function exitWithError(error: unknown): never {
  if (!isError(error)) {
    return exit(stringifyError(error));
  }

  switch (error.name) {
    case 'InputError':
      return exit(error.message, 74 /* input/output error */);
    case 'NotFoundError':
      return exit(error.message, 127 /* command not found */);
    case 'NotImplementedError':
      return exit(error.message, 64 /* command line usage error */);
    case 'AuthenticationError':
    case 'NotAllowedError':
      return exit(error.message, 77 /* permission denied */);
    case 'ExitCodeError':
      return exit(
        error.message,
        'code' in error && typeof error.code === 'number' ? error.code : 1,
      );
    default:
      return exit(
        stringifyError(error),
        'code' in error && typeof error.code === 'number' ? error.code : 1,
      );
  }
}

function getNodeName(node: CommandNode): string {
  if (OpaqueCommandTreeNode.isType(node)) {
    return OpaqueCommandTreeNode.toInternal(node).name;
  }
  return OpaqueCommandLeafNode.toInternal(node).name;
}

function getNodeDescription(node: CommandNode): string {
  if (OpaqueCommandTreeNode.isType(node)) {
    return OpaqueCommandTreeNode.toInternal(node).name;
  }
  return OpaqueCommandLeafNode.toInternal(node).command.description;
}

function createHelpOptions(options: {
  nodes: ReadonlyArray<CommandNode>;
  includeHelpCommand: boolean;
  version?: string;
}) {
  const { nodes, includeHelpCommand, version } = options;
  const visibleNodes = nodes.filter(node => !isCommandNodeHidden(node));

  return {
    version,
    render(nodesToRender: HelpNode[], renderers: Renderers) {
      const commandsNode = nodesToRender.find(node => node.id === 'commands');
      if (commandsNode) {
        const commandRows = visibleNodes.map(node => [
          getNodeName(node),
          getNodeDescription(node),
        ]);
        if (includeHelpCommand) {
          commandRows.push(['help', 'Display help for command']);
        }
        (commandsNode.data as CommandsHelpData).body.data.tableData =
          commandRows;
      }
      return renderers.render(nodesToRender);
    },
  };
}

async function executeCommand(
  commandToExecute: CliCommand,
  args: string[],
  programName: string,
): Promise<void> {
  const context = {
    args,
    info: {
      usage: [programName, ...commandToExecute.path].join(' '),
      name: commandToExecute.path.join(' '),
    },
  };

  if (typeof commandToExecute.execute === 'function') {
    await commandToExecute.execute(context);
  } else {
    const mod = await commandToExecute.execute.loader();
    const fn =
      typeof mod.default === 'function'
        ? mod.default
        : (mod.default as any).default;
    await fn(context);
  }
}

async function runCommandLevel(options: {
  nodes: ReadonlyArray<CommandNode>;
  argv: string[];
  programName: string;
  commandPath?: string[];
  version?: string;
}): Promise<void> {
  const { nodes, argv, programName, commandPath = [], version } = options;
  const name = [programName, ...commandPath].join(' ');
  const commandArgs = argv.slice(1);
  const commands = nodes.map(node =>
    command(
      {
        name: getNodeName(node),
        help: false,
      },
      async () => {
        try {
          if (OpaqueCommandTreeNode.isType(node)) {
            await runCommandLevel({
              nodes: OpaqueCommandTreeNode.toInternal(node).children,
              argv: commandArgs,
              programName,
              commandPath: [...commandPath, getNodeName(node)],
              version,
            });
          } else {
            await executeCommand(
              OpaqueCommandLeafNode.toInternal(node).command,
              commandArgs,
              programName,
            );
            process.exit(0);
          }
        } catch (error: unknown) {
          exitWithError(error);
        }
      },
    ),
  );
  const includeHelpCommand = !nodes.some(node => getNodeName(node) === 'help');
  if (includeHelpCommand && nodes.length > 0) {
    commands.push(
      command(
        {
          name: 'help',
          parameters: ['[command...]'],
          help: false,
        },
        async () => {
          await runCommandLevel({
            nodes,
            argv: [...commandArgs, '--help'],
            programName,
            commandPath,
            version,
          });
        },
      ),
    );
  }

  await cli(
    {
      name,
      flags: version
        ? {
            version: {
              type: Boolean,
              alias: 'V',
              description: 'Show version',
            },
          }
        : undefined,
      commands,
      help: createHelpOptions({
        nodes,
        includeHelpCommand: includeHelpCommand && nodes.length > 0,
        version,
      }),
    },
    parsed => {
      if (version && parsed.flags.version) {
        console.log(version);
        process.exit(0);
        return;
      }

      if (argv.length === 0) {
        return;
      }

      console.log();
      console.log(
        chalk.red(`Invalid command: ${[...commandPath, ...argv].join(' ')}`),
      );
      console.log();
      parsed.showHelp();
      process.exit(1);
    },
    [...argv],
  );
}

function handleUnhandledRejection(rejection: unknown): void {
  exitWithError(new ForwardedError('Unhandled rejection', rejection));
}

function hasVersionFlag(args: string[]): boolean {
  const separatorIndex = args.indexOf('--');
  const options = separatorIndex === -1 ? args : args.slice(0, separatorIndex);
  return options.includes('-V') || options.includes('--version');
}

/**
 * Runs a collection of CLI modules as an executable program.
 *
 * This is intended for creating custom CLI packages from a fixed set of
 * directly imported modules. Module discovery and override behavior are left
 * to the caller.
 *
 * @example
 * ```ts
 * import { runCli } from '@backstage/cli-node';
 * import buildModule from '@backstage/cli-module-build';
 * import testModule from '@backstage/cli-module-test-jest';
 * import packageJson from '../package.json';
 *
 * runCli({
 *   modules: [buildModule, testModule],
 *   name: packageJson.name,
 *   version: packageJson.version,
 * });
 * ```
 *
 * @public
 */
export async function runCli(options: {
  /** The CLI modules whose commands are included in the program. */
  modules: ReadonlyArray<CliModule>;
  /** The program name shown in help output and usage strings. */
  name: string;
  /** The version string shown when `--version` is passed. */
  version?: string;
}): Promise<void> {
  const { modules, name, version } = options;
  const graph = new CommandGraph();

  for (const module of modules) {
    if (!OpaqueCliModule.isType(module)) {
      throw new Error(
        `Invalid CLI module: expected a module created with createCliModule`,
      );
    }

    for (const commandToAdd of await OpaqueCliModule.toInternal(module)
      .commands) {
      graph.add(commandToAdd, module);
    }
  }

  if (
    !process.listeners('unhandledRejection').includes(handleUnhandledRejection)
  ) {
    process.on('unhandledRejection', handleUnhandledRejection);
  }

  const args = process.argv.slice(2);
  if (version && hasVersionFlag(args)) {
    console.log(version);
    process.exit(0);
    return;
  }

  await runCommandLevel({
    nodes: graph.roots,
    argv: args,
    programName: name,
    version,
  });
}
