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
import chalk from 'chalk';

type UninitializedFeature = CliFeature | Promise<CliFeature>;

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

    const {
      _: commandName,
      $0: binaryName,
      ...options
    } = await yargs(process.argv.slice(2)).parse();
    const command = this.graph.find(commandName.map(String));
    if (!command) {
      console.error(chalk.red(`Command not found: "${commandName.join(' ')}"`));
      const possibleCommands = this.graph.atDepth(commandName.length - 1);
      if (possibleCommands.length > 0) {
        console.log('Available commands:');
        for (const node of possibleCommands) {
          let text = `\t${node.name}`;
          if (node.$$type === '@tree/root') {
            text += ' [command]';
          } else {
            text += ` [options]\t\t${node.command.description}`;
          }
          console.log(text);
        }
      }
      process.exit(1);
    }
    const parsedOptions = command.schema.parse(options);
    await command?.execute(parsedOptions);
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
