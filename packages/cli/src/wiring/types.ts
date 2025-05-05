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
import { OpaqueType } from '@internal/opaque';

export interface BackstageCommand {
  path: string[];
  description: string;
  deprecated?: boolean;
  execute: (context: {
    args: string[];
    info: {
      /**
       * The usage string of the current command, for example: "backstage-cli repo test"
       */
      usage: string;
      /**
       * The description provided for the command
       */
      description: string;
    };
  }) => Promise<void>;
}

export type CliFeature = CliPlugin;

export interface CliPlugin {
  readonly pluginId: string;
  readonly $$type: '@backstage/CliPlugin';
}

export const OpaqueCliPlugin = OpaqueType.create<{
  public: CliPlugin;
  versions: {
    readonly version: 'v1';
    readonly description: string;
    init: (registry: {
      addCommand: (command: BackstageCommand) => void;
    }) => Promise<void>;
  };
}>({
  type: '@backstage/CliPlugin',
  versions: ['v1'],
});
