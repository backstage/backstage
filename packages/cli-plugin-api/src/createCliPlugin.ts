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

import { OpaqueCliPlugin } from '@internal/cli';
import { BackstageCommand, CliPlugin } from './types';

/**
 * Creates a new CLI plugin that provides commands to the Backstage CLI.
 *
 * @public
 */
export function createCliPlugin(options: {
  packageJson: { name: string };
  init: (registry: {
    addCommand: (command: BackstageCommand) => void;
  }) => Promise<void>;
}): CliPlugin {
  const commands: BackstageCommand[] = [];
  const commandsPromise = options
    .init({ addCommand: command => commands.push(command) })
    .then(() => commands);

  return OpaqueCliPlugin.createInstance('v1', {
    packageName: options.packageJson.name,
    commands: commandsPromise,
  });
}
