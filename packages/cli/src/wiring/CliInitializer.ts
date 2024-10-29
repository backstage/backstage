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

import yargs from 'yargs';
import { CommandGraph } from './CommandGraph';
import { CliFeature, InternalCliFeature, InternalCliPlugin } from './types';
import { CommandRegistry } from './CommandRegistry';

type UninitializedFeature = CliFeature | Promise<CliFeature>;

function checkCommands(
  nestedYargs: yargs.Argv,
  argv: Awaited<yargs.Argv['argv']>,
  numRequired: number,
) {
  if (argv._.length < numRequired) {
    nestedYargs.showHelp();
  } else {
    // check for unknown command
  }
}

export class CliInitializer {
  private graph = new CommandGraph();
  private commandRegistry = new CommandRegistry(this.graph);
  #uninitiazedFeatures: Promise<CliFeature>[] = [];

  add(module: UninitializedFeature) {
    this.#uninitiazedFeatures.push(Promise.resolve(module));
  }

  async #register(feature: CliFeature) {
    if (isCliPlugin(feature)) {
      await feature.init(this.commandRegistry);
    } else {
      throw new Error(`Unsupported feature type: ${feature.$$type}`);
    }
  }

  async #doInit() {
    const features = await Promise.all(this.#uninitiazedFeatures);
    for (const feature of features) {
      await this.#register(feature);
    }
  }

  /**
   * Actually parse argv and pass it to the command.
   */
  async run() {
    await this.#doInit();

    const root = yargs.usage('usage: $0 <command>').wrap(null).help('help');
    const rootArgv = process.argv.slice(2);

    const queue = this.graph.atDepth(0).map(node => ({
      node,
      argParser: root,
      depth: 0,
    }));
    while (queue.length) {
      const { node, argParser, depth } = queue.shift()!;
      if (node.$$type === '@tree/root') {
        let commandYargs = undefined;
        argParser
          .recommendCommands()
          .demandCommand()
          .command(node.name, node.name, async nestedYargs => {
            commandYargs = nestedYargs;
            nestedYargs.usage(`usage: $0 ${node.name}`).wrap(null).help('help');
            checkCommands(
              nestedYargs,
              await nestedYargs.argv,
              node.children.length,
            );
          });

        queue.push(
          ...node.children.map(child => ({
            node: child,
            argParser,
            depth: depth + 1,
          })),
        );
      } else {
        argParser.command(
          node.name,
          node.command.description,
          async nestedYargs => {
            nestedYargs.help(false);
          },
          async argv => {
            await node.command.execute({
              args: process.argv.slice(2 + depth + 1),
            });
            checkCommands(argParser, argv, 1);
          },
        );
      }
    }
    const argv = await root
      .demandCommand()
      .recommendCommands()
      .strictCommands()
      .parse(rootArgv);
    checkCommands(root, argv, 1);
  }
}

function toInternalCliFeature(feature: CliFeature): InternalCliFeature {
  if (feature.$$type !== '@backstage/CliFeature') {
    throw new Error(`Invalid CliFeature, bad type '${feature.$$type}'`);
  }
  const internal = feature as InternalCliFeature;
  if (internal.version !== 'v1') {
    throw new Error(`Invalid CliFeature, bad version '${internal.version}'`);
  }
  return internal;
}

function isCliPlugin(feature: CliFeature): feature is InternalCliPlugin {
  const internal = toInternalCliFeature(feature);
  if (internal.featureType === 'plugin') {
    return true;
  }
  // Backwards compatibility for v1 registrations that use duck typing
  return 'plugin' in internal;
}
