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
import { Command, Option } from 'commander';
import { createCliPlugin } from '../../wiring/factory';
import { lazy } from '../../lib/lazy';

export default createCliPlugin({
  pluginId: 'info',
  init: async reg => {
    reg.addCommand({
      path: ['info'],
      description: 'Show helpful information for debugging and reporting bugs',
      execute: async ({ args }) => {
        const command = new Command();
        const defaultCommand = command
          .addOption(
            new Option(
              '--include <pattern>',
              'Glob patterns for additional packages to include (e.g., @spotify/backstage*)',
            )
              .argParser((opt: string, opts: string[]) =>
                opts ? [...opts, opt] : [opt],
              )
              .default([]),
          )
          .addOption(
            new Option('--format <type>', 'Output format (text or json)')
              .choices(['text', 'json'])
              .default('text'),
          )
          .action(lazy(() => import('./commands/info'), 'default'));

        await defaultCommand.parseAsync(args, { from: 'user' });
      },
    });
  },
});
