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
import { CliFeature, InternalCliFeature, InternalCliPlugin } from './types';
import { CommandRegistry } from './CommandRegistry';
import { program } from 'commander';
import { version } from '../lib/version';
import chalk from 'chalk';
import { exitWithError } from '../lib/errors';
import { assertError } from '@backstage/errors';
import { isPromise } from 'util/types';

type UninitializedFeature = CliFeature | Promise<{ default: CliFeature }>;

export class CliInitializer {
  private graph = new CommandGraph();
  private commandRegistry = new CommandRegistry(this.graph);
  #uninitiazedFeatures: Promise<CliFeature>[] = [];

  add(feature: UninitializedFeature) {
    if (isPromise(feature)) {
      this.#uninitiazedFeatures.push(
        feature.then(f => unwrapFeature(f.default)),
      );
    } else {
      this.#uninitiazedFeatures.push(Promise.resolve(feature));
    }
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
    program
      .name('backstage-cli')
      .version(version)
      .allowUnknownOption(true)
      .allowExcessArguments(true);

    const queue = this.graph.atDepth(0).map(node => ({
      node,
      argParser: program,
    }));
    while (queue.length) {
      const { node, argParser } = queue.shift()!;
      if (node.$$type === '@tree/root') {
        const treeParser = argParser
          .command(`${node.name} [command]`)
          .description(node.name);

        queue.push(
          ...node.children.map(child => ({
            node: child,
            argParser: treeParser,
          })),
        );
      } else {
        argParser
          .command(node.name)
          .description(node.command.description)
          .helpOption(false)
          .allowUnknownOption(true)
          .allowExcessArguments(true)
          .action(async () => {
            try {
              await node.command.execute({
                args: program.parseOptions(process.argv).unknown,
              });
              process.exit(0);
            } catch (error) {
              assertError(error);
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
      if (rejection instanceof Error) {
        exitWithError(rejection);
      } else {
        exitWithError(new Error(`Unknown rejection: '${rejection}'`));
      }
    });

    program.parse(process.argv);
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

/** @internal */
export function unwrapFeature(
  feature: CliFeature | { default: CliFeature },
): CliFeature {
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
