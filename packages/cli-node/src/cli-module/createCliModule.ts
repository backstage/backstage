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
import { CliCommand, CliModule, CliRunTargetOptions } from './types';

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
     * Registers a target for `repo run <name>`, which runs the given
     * `package` command in every package of the workspace, with support for
     * `--since`, `--include-dependents` and `--watch`.
     */
    addRunTarget: (name: string, options: CliRunTargetOptions) => void;
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
  const runTargets: Array<{ name: string; options: CliRunTargetOptions }> = [];
  const addRunTarget = (name: string, runTarget: CliRunTargetOptions) => {
    if (!name || /\s/.test(name)) {
      throw new Error(
        `Run target "${name}" from "${options.packageJson.name}" must have a non-empty name without whitespace`,
      );
    }
    if (
      runTarget.packageCommand[0] !== 'package' ||
      runTarget.packageCommand.length < 2
    ) {
      throw new Error(
        `Run target "${name}" from "${
          options.packageJson.name
        }" must target a package command, got "${runTarget.packageCommand.join(
          ' ',
        )}"`,
      );
    }
    if (runTargets.some(target => target.name === name)) {
      throw new Error(
        `Run target "${name}" is registered more than once by "${options.packageJson.name}"`,
      );
    }
    runTargets.push({ name, options: runTarget });
  };
  const initPromise = Promise.resolve().then(() =>
    options.init({ addCommand, addRunTarget }),
  );
  const commandsPromise = initPromise.then(() => commands);
  const runTargetsPromise = initPromise.then(() => runTargets);
  // Failures are reported to whoever awaits each promise, this only prevents
  // an unhandled rejection when just one of them is awaited.
  commandsPromise.catch(() => {});
  runTargetsPromise.catch(() => {});

  return OpaqueCliModule.createInstance('v1', {
    packageName: options.packageJson.name,
    commands: commandsPromise,
    runTargets: runTargetsPromise,
  });
}
