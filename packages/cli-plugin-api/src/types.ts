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

/**
 * The context provided to a CLI command when it is executed.
 *
 * @public
 */
export interface CommandContext {
  args: string[];
  info: {
    /**
     * The usage string of the current command, for example: "backstage-cli repo test"
     */
    usage: string;
    /**
     * The name of the command, for example: "repo test"
     */
    name: string;
  };
}

/**
 * A command definition for a Backstage CLI plugin.
 *
 * @public
 */
export interface BackstageCommand {
  path: string[];
  description: string;
  deprecated?: boolean;
  experimental?: boolean;
  execute:
    | ((context: CommandContext) => Promise<void>)
    | {
        loader: () => Promise<{
          default: (context: CommandContext) => Promise<void>;
        }>;
      };
}

/**
 * A CLI feature, currently always a CLI plugin.
 *
 * @public
 */
export type CliFeature = CliPlugin;

/**
 * A Backstage CLI plugin.
 *
 * @public
 */
export interface CliPlugin {
  readonly $$type: '@backstage/CliPlugin';
}
