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
import { Command } from 'commander';
import { createCliPlugin } from '../../wiring/factory';
import { lazy } from '../../lib/lazy';

export default createCliPlugin({
  pluginId: 'maintenance',
  init: async reg => {
    reg.addCommand({
      path: ['package', 'clean'],
      description: 'Delete cache directories',
      execute: async ({ args }) => {
        const command = new Command();
        const defaultCommand = command.action(
          lazy(() => import('./commands/package/clean'), 'default'),
        );

        await defaultCommand.parseAsync(args, { from: 'user' });
      },
    });

    reg.addCommand({
      path: ['package', 'prepack'],
      description: 'Prepares a package for packaging before publishing',
      execute: async ({ args }) => {
        const command = new Command();
        const defaultCommand = command.action(
          lazy(() => import('./commands/package/pack'), 'pre'),
        );

        await defaultCommand.parseAsync(args, { from: 'user' });
      },
    });

    reg.addCommand({
      path: ['package', 'postpack'],
      description: 'Restores the changes made by the prepack command',
      execute: async ({ args }) => {
        const command = new Command();
        const defaultCommand = command.action(
          lazy(() => import('./commands/package/pack'), 'post'),
        );

        await defaultCommand.parseAsync(args, { from: 'user' });
      },
    });

    reg.addCommand({
      path: ['repo', 'fix'],
      description: 'Automatically fix packages in the project',
      execute: async ({ args }) => {
        const command = new Command();
        const defaultCommand = command
          .option(
            '--publish',
            'Enable additional fixes that only apply when publishing packages',
          )
          .option(
            '--check',
            'Fail if any packages would have been changed by the command',
          )
          .action(lazy(() => import('./commands/repo/fix'), 'command'));

        await defaultCommand.parseAsync(args, { from: 'user' });
      },
    });

    reg.addCommand({
      path: ['repo', 'clean'],
      description: 'Delete cache and output directories',
      execute: async ({ args }) => {
        const command = new Command();
        const defaultCommand = command.action(
          lazy(() => import('./commands/repo/clean'), 'command'),
        );

        await defaultCommand.parseAsync(args, { from: 'user' });
      },
    });

    reg.addCommand({
      path: ['repo', 'list-deprecations'],
      description: 'List deprecations',
      execute: async ({ args }) => {
        const command = new Command();
        const defaultCommand = command
          .option('--json', 'Output as JSON')
          .action(
            lazy(() => import('./commands/repo/list-deprecations'), 'command'),
          );

        await defaultCommand.parseAsync(args, { from: 'user' });
      },
    });
  },
});
