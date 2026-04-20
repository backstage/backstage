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

import { CommandGraph } from './CommandGraph';
import {
  OpaqueCliModule,
  OpaqueCommandTreeNode,
  OpaqueCommandLeafNode,
  isCommandNodeHidden,
} from '@internal/cli';
import type { CliModule } from '@backstage/cli-node';
import { Command } from 'commander';
import { version } from './version';
import chalk from 'chalk';
import { exitWithError } from './errors';
import { ForwardedError } from '@backstage/errors';
import { isPromise } from 'node:util/types';

type UninitializedFeature =
  | CliModule
  | CliModule[]
  | Promise<{ default: CliModule | CliModule[] }>;

interface TaggedFeature {
  feature: CliModule;
  /**
   * Whether this module was sourced from an array (e.g. cli-defaults).
   * Array-sourced modules are silently skipped when any of their commands
   * overlap with an individually-added module, allowing explicit module
   * additions to take precedence without causing conflicts.
   */
  fromArray: boolean;
}

export class CliInitializer {
  private graph = new CommandGraph();
  #uninitiazedFeatures: Promise<TaggedFeature[]>[] = [];

  add(feature: UninitializedFeature) {
    if (isPromise(feature)) {
      this.#uninitiazedFeatures.push(
        feature.then(f => {
          const unwrapped = unwrapFeature(f.default);
          if (Array.isArray(unwrapped)) {
            return unwrapped.map(m => ({ feature: m, fromArray: true }));
          }
          return [{ feature: unwrapped, fromArray: false }];
        }),
      );
    } else if (Array.isArray(feature)) {
      this.#uninitiazedFeatures.push(
        Promise.resolve(feature.map(m => ({ feature: m, fromArray: true }))),
      );
    } else {
      this.#uninitiazedFeatures.push(
        Promise.resolve([{ feature, fromArray: false }]),
      );
    }
  }

  async #register(feature: CliModule) {
    if (OpaqueCliModule.isType(feature)) {
      for (const command of await OpaqueCliModule.toInternal(feature)
        .commands) {
        this.graph.add(command, feature);
      }
    } else {
      throw new Error(`Unsupported feature type: ${(feature as any).$$type}`);
    }
  }

  async #doInit() {
    const resolvedGroups = await Promise.all(this.#uninitiazedFeatures);
    const allFeatures = resolvedGroups.flat();

    // Collect command paths from individually-added modules
    const individualPaths = new Set<string>();
    for (const { feature, fromArray } of allFeatures) {
      if (!fromArray && OpaqueCliModule.isType(feature)) {
        const cmds = await OpaqueCliModule.toInternal(feature).commands;
        for (const cmd of cmds) {
          individualPaths.add(cmd.path.join(' '));
        }
      }
    }

    for (const { feature, fromArray } of allFeatures) {
      if (fromArray && OpaqueCliModule.isType(feature)) {
        const cmds = await OpaqueCliModule.toInternal(feature).commands;
        if (cmds.some(cmd => individualPaths.has(cmd.path.join(' ')))) {
          continue;
        }
      }
      await this.#register(feature);
    }
  }

  /**
   * Actually parse argv and pass it to the command.
   */
  async run() {
    await this.#doInit();

    const programName = 'backstage-cli';

    const program = new Command();
    program
      .name(programName)
      .version(version)
      .allowUnknownOption(true)
      .allowExcessArguments(true);

    const queue = this.graph.atDepth(0).map(node => ({
      node,
      argParser: program,
    }));
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
                // Skip the command name
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
                // Handle CJS double-wrapping of default exports
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
    program.on('command:*', () => {
      console.log();
      console.log(chalk.red(`Invalid command: ${program.args.join(' ')}`));
      console.log();
      program.outputHelp();
      process.exit(1);
    });

    process.on('unhandledRejection', rejection => {
      exitWithError(new ForwardedError('Unhandled rejection', rejection));
    });

    await program.parseAsync(process.argv);
  }
}

/** @internal */
export function unwrapFeature(
  feature: CliModule | CliModule[] | { default: CliModule | CliModule[] },
): CliModule | CliModule[] {
  if (Array.isArray(feature)) {
    return feature;
  }

  if ('$$type' in feature) {
    return feature;
  }

  // This is a workaround where default exports get transpiled to `exports['default'] = ...`
  // in CommonJS modules, which in turn results in a double `{ default: { default: ... } }` nesting
  // when importing using a dynamic import.
  // TODO: This is a broader issue than just this piece of code, and should move away from CommonJS.
  if ('default' in feature) {
    return feature.default;
  }

  return feature;
}
