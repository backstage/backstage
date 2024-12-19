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

import { CommandGraph } from './commands/CommandGraph';
import { InternalFeature } from './types';
import { program } from 'commander';
import { version } from '../lib/version';
import chalk from 'chalk';
import { exitWithError } from '../lib/errors';
import { assertError } from '@backstage/errors';
import { ServiceRegistry } from './services/ServiceRegistry';
import { CliFeature } from './features/types';
import { createServiceFactory, InternalServiceFactory } from './services/types';
import { InternalPlugin } from './plugins/types';
import { FeatureRegistry } from './FeatureRegistry';
import { cliServiceRef, DefaultCli } from './services/cli';

type UninitializedFeature = CliFeature | Promise<CliFeature>;

export class CliInitializer {
  private graph = new CommandGraph();
  private serviceRegistry = new ServiceRegistry();
  private featureRegistry = new FeatureRegistry(this.serviceRegistry);
  #uninitializedFeatures: Promise<CliFeature>[] = [
    Promise.resolve(
      createServiceFactory({
        service: cliServiceRef,
        deps: {},
        factory: async () => {
          return new DefaultCli(this.graph);
        },
      }),
    ),
  ];

  add(module: UninitializedFeature) {
    this.#uninitializedFeatures.push(Promise.resolve(module));
  }

  async #register(feature: CliFeature) {
    if (isCliPlugin(feature)) {
      await this.featureRegistry.register(feature);
    } else if (isCliService(feature)) {
      this.serviceRegistry.register(feature);
    } else {
      throw new Error(`Unsupported feature type: ${feature.$$type}`);
    }
  }

  async #initialize() {
    await this.serviceRegistry.initializeScope('root');
    await this.featureRegistry.initialize();
  }

  async #doInit() {
    const features = await Promise.all(this.#uninitializedFeatures);
    for (const feature of features) {
      await this.#register(feature);
    }
    await this.#initialize();
  }

  /**
   * Actually parse argv and pass it to the command.
   */
  async run() {
    await this.#doInit();
    console.log('!!!Running CLI!!!');
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

function toInternalCliFeature(feature: CliFeature): InternalFeature {
  if (feature.$$type !== '@backstage/CliFeature') {
    throw new Error(`Invalid CliFeature, bad type '${feature.$$type}'`);
  }
  const internal = feature as InternalFeature;
  if (internal.version !== 'v1') {
    throw new Error(`Invalid CliFeature, bad version '${internal.version}'`);
  }
  return internal;
}

function isCliPlugin(feature: CliFeature): feature is InternalPlugin {
  const internal = toInternalCliFeature(feature);
  return internal.featureType === 'plugin';
}

function isCliService(feature: CliFeature): feature is InternalServiceFactory {
  const internal = toInternalCliFeature(feature);
  return internal.featureType === 'service';
}
