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
import {
  findCliPackageContext,
  resolveCommandVariant,
} from './resolveCommandVariant';
import type { CliCommand, CliModule } from './types';
import { createRunCommand, mergeRunTargets } from './repoCommand/runTargets';
import type { RegisteredRunTarget } from './repoCommand/runTargets';

interface HelpNode {
  id?: string;
  type: keyof Renderers;
  data: unknown;
}

function exit(message: string, code: number = 1): never {
  process.stderr.write(`\n${chalk.red(message)}\n\n`);
  process.exit(code);
}

/**
 * Waits for any output queued on stdout and stderr to be handed off to the OS.
 * Depending on the platform and stream type (e.g. pipes on macOS), these writes
 * can be asynchronous, so exiting immediately after a large write can truncate
 * the output.
 */
async function flushStdio(): Promise<void> {
  await Promise.all(
    [process.stdout, process.stderr].map(
      stream => new Promise<void>(resolve => stream.write('', () => resolve())),
    ),
  );
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

function createGroupPreview(
  children: ReadonlyArray<CommandNode>,
  width: number,
): string {
  const entries = children
    .filter(node => !isCommandNodeHidden(node))
    .sort((a, b) => getNodeName(a).localeCompare(getNodeName(b), 'en'))
    .map(node => ({ node, path: getNodeName(node) }));
  const format = (items: typeof entries) =>
    items
      .map(
        ({ node, path }) =>
          path + (OpaqueCommandTreeNode.isType(node) ? '/' : ''),
      )
      .join(', ');

  if (format(entries).length > width) {
    while (entries.length > 0) {
      entries.pop();
      const preview = format(entries);
      if (preview.length + 3 <= width) {
        return preview ? `${preview}, …` : '…';
      }
    }
    return '…';
  }

  // Expand breadth-first, preserving every sibling before adding more detail.
  const queue = [...entries];
  for (const entry of queue) {
    if (!OpaqueCommandTreeNode.isType(entry.node)) {
      continue;
    }
    const expanded = OpaqueCommandTreeNode.toInternal(entry.node)
      .children.filter(node => !isCommandNodeHidden(node))
      .sort((a, b) => getNodeName(a).localeCompare(getNodeName(b), 'en'))
      .map(node => ({ node, path: `${entry.path} ${getNodeName(node)}` }));
    const index = entries.indexOf(entry);
    const candidate = [...entries];
    candidate.splice(index, 1, ...expanded);
    if (format(candidate).length <= width) {
      entries.splice(index, 1, ...expanded);
      queue.push(...expanded);
    }
  }
  return format(entries);
}

function createHelpOptions(options: {
  nodes: ReadonlyArray<CommandNode>;
  includeHelpCommand: boolean;
  version?: string;
}) {
  const { nodes, includeHelpCommand, version } = options;
  const visibleNodes = nodes.filter(node => !isCommandNodeHidden(node));
  const groups = visibleNodes.filter(OpaqueCommandTreeNode.isType);
  // Match the table's name column and padding, with 80 columns for piped output.
  const previewWidth = Math.max(
    1,
    (process.stdout.columns || 80) -
      Math.max(0, ...groups.map(node => getNodeName(node).length)) -
      10,
  );
  const groupRows: string[][] = [];
  const commandRows: string[][] = [];

  for (const node of visibleNodes) {
    if (OpaqueCommandTreeNode.isType(node)) {
      const { name, children } = OpaqueCommandTreeNode.toInternal(node);
      groupRows.push([name, createGroupPreview(children, previewWidth)]);
    } else {
      const { name, variants } = OpaqueCommandLeafNode.toInternal(node);
      // The fallback is the default implementation, so it describes the command
      const described = variants.find(v => !v.command.isEnabled) ?? variants[0];
      commandRows.push([name, described.command.description]);
    }
  }
  if (includeHelpCommand) {
    commandRows.push(['help', 'Display help for command']);
  }
  for (const rows of [groupRows, commandRows]) {
    rows.sort(([a], [b]) => a.localeCompare(b, 'en'));
  }

  return {
    version,
    render(nodesToRender: HelpNode[], renderers: Renderers) {
      return renderers.render(
        nodesToRender.flatMap(node => {
          if (node.id !== 'commands') {
            return [node];
          }
          return [
            { title: 'Groups:', rows: groupRows },
            { title: 'Commands:', rows: commandRows },
          ]
            .filter(section => section.rows.length > 0)
            .map(
              ({ title, rows }): HelpNode => ({
                type: 'section',
                data: {
                  title,
                  indentBody: 0,
                  body: {
                    type: 'table',
                    data: {
                      tableData: rows,
                      tableOptions: [
                        {
                          width: 'content-width',
                          paddingLeft: 2,
                          paddingRight: 8,
                        },
                      ],
                    },
                  },
                },
              }),
            );
        }),
      );
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
            const selected = await resolveCommandVariant(
              OpaqueCommandLeafNode.toInternal(node).variants,
              () => findCliPackageContext(process.cwd()),
            );
            await executeCommand(selected, commandArgs, programName);
            await flushStdio();
            process.exit(process.exitCode ?? 0);
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
        parsed.showHelp();
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
 * Multiple modules may provide the same `package` command if all but at most
 * one of them declare `isEnabled`. The variant to run is selected at invocation
 * time based on the package at the current working directory, see
 * {@link CliCommand.isEnabled}.
 *
 * Invoking the program or a command group without a subcommand displays
 * help for that level and completes successfully. Command groups and commands
 * are listed separately in alphabetical order. Group previews fit the terminal width
 * (80 columns when unavailable), expanding nested groups breadth-first when space
 * permits. Unexpanded groups have a trailing slash; truncated previews end in an ellipsis.
 *
 * When a command completes without throwing, the process exits with
 * `process.exitCode`, or `0` if it is not set. Commands can set
 * `process.exitCode` to report a failure, such as invalid input, without
 * throwing an error.
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
  const runTargets = new Array<RegisteredRunTarget>();
  let runTargetModule: CliModule | undefined;

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
    const internal = OpaqueCliModule.toInternal(module);
    for (const {
      name: targetName,
      options: targetOptions,
    } of await internal.runTargets) {
      runTargetModule ??= module;
      runTargets.push({
        name: targetName,
        options: targetOptions,
        moduleName: internal.packageName,
      });
    }
  }

  if (runTargetModule) {
    // Only added when some module provides a target, so that `repo run` does
    // not show up in CLIs that have nothing to run.
    graph.add(createRunCommand(mergeRunTargets(runTargets)), runTargetModule);
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
