/*
 * Copyright 2025 The Backstage Authors
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
  pluginId: 'lint',
  init: async reg => {
    reg.addCommand({
      path: ['package', 'lint'],
      description: 'Lint a package',
      execute: async ({ args }) => {
        const command = new Command();
        command.arguments('[directories...]');
        command.option('--fix', 'Attempt to automatically fix violations');
        command.option(
          '--format <format>',
          'Lint report output format',
          'eslint-formatter-friendly',
        );
        command.option(
          '--output-file <path>',
          'Write the lint report to a file instead of stdout',
        );
        command.option(
          '--max-warnings <number>',
          'Fail if more than this number of warnings. -1 allows warnings. (default: -1)',
        );
        command.description('Lint a package');
        command.action(
          lazy(() => import('./commands/package/lint'), 'default'),
        );

        await command.parseAsync(args, { from: 'user' });
      },
    });

    reg.addCommand({
      path: ['repo', 'lint'],
      description: 'Lint a repository',
      execute: async ({ args }) => {
        const command = new Command();
        command.option('--fix', 'Attempt to automatically fix violations');
        command.option(
          '--format <format>',
          'Lint report output format',
          'eslint-formatter-friendly',
        );
        command.option(
          '--output-file <path>',
          'Write the lint report to a file instead of stdout',
        );
        command.option(
          '--successCache',
          'Enable success caching, which skips running tests for unchanged packages that were successful in the previous run',
        );
        command.option(
          '--successCacheDir <path>',
          'Set the success cache location, (default: node_modules/.cache/backstage-cli)',
        );
        command.option(
          '--since <ref>',
          'Only lint packages that changed since the specified ref',
        );
        command.option(
          '--max-warnings <number>',
          'Fail if more than this number of warnings. -1 allows warnings. (default: -1)',
        );
        command.description('Lint a repository');
        command.action(lazy(() => import('./commands/repo/lint'), 'command'));

        await command.parseAsync(args, { from: 'user' });
      },
    });
  },
});
