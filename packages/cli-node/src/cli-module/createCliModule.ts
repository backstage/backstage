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
import { CliCommand, CliModule, CliRepoCommandOptions } from './types';

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
    /**
     * Registers a `repo` command that runs the given `package` command in
     * every package of the workspace, with support for `--since`,
     * `--include-dependents` and `--watch`.
     */
    addRepoCommand: (options: CliRepoCommandOptions) => void;
  }) => Promise<void>;
}): CliModule {
  if (!options.packageJson.name) {
    throw new Error(
      'The packageJson provided to createCliModule must have a name',
    );
  }

  const commands: CliCommand[] = [];
  const addCommand = (command: CliCommand) => {
    if (command.isEnabled && command.path[0] !== 'package') {
      throw new Error(
        `Command "${command.path.join(' ')}" from "${
          options.packageJson.name
        }" sets isEnabled, which is only supported for commands under "package"`,
      );
    }
    commands.push(command);
  };
  const addRepoCommand = (repoOptions: CliRepoCommandOptions) => {
    const { path, packageCommand, ...rest } = repoOptions;
    if (path[0] !== 'repo' || path.length < 2) {
      throw new Error(
        `Repo command "${path.join(' ')}" from "${
          options.packageJson.name
        }" must have a path that starts with "repo"`,
      );
    }
    if (packageCommand[0] !== 'package' || packageCommand.length < 2) {
      throw new Error(
        `Repo command "${path.join(' ')}" from "${
          options.packageJson.name
        }" must target a package command, got "${packageCommand.join(' ')}"`,
      );
    }
    addCommand({
      path,
      description: rest.description,
      deprecated: rest.deprecated,
      experimental: rest.experimental,
      execute: async context => {
        const mod = await import('./repoCommand/runRepoCommand');
        // Native dynamic imports of CommonJS only expose the exports object
        // as the default export, same as for command loaders in runCli.
        const { runRepoCommand } =
          typeof mod.runRepoCommand === 'function'
            ? mod
            : (mod as unknown as { default: typeof mod }).default;
        await runRepoCommand({ ...repoOptions }, context);
      },
    });
  };
  const commandsPromise = Promise.resolve()
    .then(() => options.init({ addCommand, addRepoCommand }))
    .then(() => commands);

  return OpaqueCliModule.createInstance('v1', {
    packageName: options.packageJson.name,
    commands: commandsPromise,
  });
}
