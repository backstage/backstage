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

import { OpaqueCliModule } from '@internal/cli';
import { CliCommand, CliModule } from './types';

/**
 * Creates a new CLI plugin that provides commands to the Backstage CLI.
 *
 * The `init` callback is invoked immediately at creation time and is used
 * to register commands via the provided registry. The commands are then
 * made available to the CLI host once the returned promise resolves.
 *
 * @example
 * ```
 * import { createCliModule } from '@backstage/cli-node';
 * import packageJson from '../package.json';
 *
 * export default createCliModule({
 *   packageJson,
 *   init: async reg => {
 *     reg.addCommand({
 *       path: ['repo', 'test'],
 *       description: 'Run tests across the repository',
 *       execute: { loader: () => import('./commands/test') },
 *     });
 *   },
 * });
 * ```
 *
 * @public
 */
export function createCliModule(options: {
  /** The `package.json` contents of the plugin package, used to identify the plugin. */
  packageJson: { name: string };
  /**
   * An initialization callback that registers commands with the CLI.
   * Called immediately when the plugin is created.
   */
  init: (registry: {
    /** Registers a new command with the CLI. */
    addCommand: (command: CliCommand) => void;
  }) => Promise<void>;
}): CliModule {
  if (!options.packageJson.name) {
    throw new Error(
      'The packageJson provided to createCliModule must have a name',
    );
  }

  const commands: CliCommand[] = [];
  const commandsPromise = Promise.resolve()
    .then(() => options.init({ addCommand: command => commands.push(command) }))
    .then(() => commands);

  return OpaqueCliModule.createInstance('v1', {
    packageName: options.packageJson.name,
    commands: commandsPromise,
  });
}
