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
import { Command } from 'commander';
import { lazy } from '../../lib/lazy';

export default createCliPlugin({
  pluginId: 'test',
  init: async reg => {
    reg.addCommand({
      path: ['repo', 'test'],
      description:
        'Run tests, forwarding args to Jest, defaulting to watch mode',
      execute: async ({ args }) => {
        const command = new Command();
        command.allowUnknownOption(true);
        command.option(
          '--since <ref>',
          'Only test packages that changed since the specified ref',
        );
        command.option('--successCache', 'Enable success caching');
        command.option(
          '--successCacheDir <path>',
          'Set the success cache location, (default: node_modules/.cache/backstage-cli)',
        );
        command.option(
          '--jest-help',
          'Show help for Jest CLI options, which are passed through',
        );
        command.action(lazy(() => import('./commands/repo/test'), 'command'));
        await command.parseAsync(args, { from: 'user' });
      },
    });

    reg.addCommand({
      path: ['package', 'test'],
      description:
        'Run tests, forwarding args to Jest, defaulting to watch mode',
      execute: async ({ args }) => {
        const command = new Command();

        command.allowUnknownOption(true);
        command.helpOption(', --backstage-cli-help');
        command.action(
          lazy(() => import('./commands/package/test'), 'default'),
        );
        await command.parseAsync(args, { from: 'user' });
      },
    });
  },
});
