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

import { BackstageCommand, CliPlugin, OpaqueCliPlugin } from './types';

export type {
  BackstageCommand,
  CliPlugin,
  CommandContext,
  CommandExecuteFn,
} from './types';

/**
 * Checks whether a value is a {@link CliPlugin}.
 *
 * @public
 */
export function isCliPlugin(value: unknown): value is CliPlugin {
  return OpaqueCliPlugin.isType(value);
}

/**
 * Initializes a CLI plugin by calling its init function with the provided
 * command registry.
 *
 * @public
 */
export async function initializeCliPlugin(
  plugin: CliPlugin,
  registry: { addCommand: (command: BackstageCommand) => void },
): Promise<void> {
  const internal = OpaqueCliPlugin.toInternal(plugin);
  await internal.init(registry);
}
