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
import { createCliPlugin } from '../../wiring/factory';

export const configOption = [
  '--config <path>',
  'Config files to load instead of app-config.yaml',
  (opt: string, opts: string[]) => (opts ? [...opts, opt] : [opt]),
  Array<string>(),
] as const;

export default createCliPlugin({
  pluginId: 'config',
  init: async reg => {
    reg.addCommand({
      path: ['config:docs'],
      description: 'Browse the configuration reference documentation',
      execute: { loader: () => import('./commands/docs') },
    });
    reg.addCommand({
      path: ['config', 'docs'],
      description: 'Browse the configuration reference documentation',
      execute: { loader: () => import('./commands/docs') },
    });
    reg.addCommand({
      path: ['config:print'],
      description: 'Print the app configuration for the current package',
      execute: { loader: () => import('./commands/print') },
    });
    reg.addCommand({
      path: ['config:check'],
      description:
        'Validate that the given configuration loads and matches schema',
      execute: { loader: () => import('./commands/validate') },
    });
    reg.addCommand({
      path: ['config:schema'],
      description: 'Print the JSON schema for the given configuration',
      execute: { loader: () => import('./commands/schema') },
    });
    reg.addCommand({
      path: ['config', 'schema'],
      description: 'Print the JSON schema for the given configuration',
      execute: { loader: () => import('./commands/schema') },
    });
  },
});
