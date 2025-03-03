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
  pluginId: 'migrate',
  init: async reg => {
    reg.addCommand({
      path: ['versions:migrate'],
      description:
        'Migrate any plugins that have been moved to the @backstage-community namespace automatically',
      execute: async ({ args }) => {
        const command = new Command();
        const defaultCommand = command
          .option(
            '--pattern <glob>',
            'Override glob for matching packages to upgrade',
          )
          .option(
            '--skip-code-changes',
            'Skip code changes and only update package.json files',
          )
          .action(lazy(() => import('./commands/versions/migrate'), 'default'));

        await defaultCommand.parseAsync(args, { from: 'user' });
      },
    });

    reg.addCommand({
      path: ['versions:bump'],
      description: 'Bump Backstage packages to the latest versions',
      execute: async ({ args }) => {
        const command = new Command();

        const defaultCommand = command
          .option(
            '--pattern <glob>',
            'Override glob for matching packages to upgrade',
          )
          .option(
            '--release <version|next|main>',
            'Bump to a specific Backstage release line or version',
            'main',
          )
          .option('--skip-install', 'Skips yarn install step')
          .option('--skip-migrate', 'Skips migration of any moved packages')
          .action(lazy(() => import('./commands/versions/bump'), 'default'));

        await defaultCommand.parseAsync(args, { from: 'user' });
      },
    });

    reg.addCommand({
      path: ['migrate', 'package-roles'],
      description: `Add package role field to packages that don't have it`,
      execute: async ({ args }) => {
        const command = new Command();
        const defaultCommand = command.action(
          lazy(() => import('./commands/packageRole'), 'default'),
        );

        await defaultCommand.parseAsync(args, { from: 'user' });
      },
    });

    reg.addCommand({
      path: ['migrate', 'package-scripts'],
      description: 'Set package scripts according to each package role',
      execute: async ({ args }) => {
        const command = new Command();
        const defaultCommand = command.action(
          lazy(() => import('./commands/packageScripts'), 'command'),
        );

        await defaultCommand.parseAsync(args, { from: 'user' });
      },
    });

    reg.addCommand({
      path: ['migrate', 'package-exports'],
      description: 'Synchronize package subpath export definitions',
      execute: async ({ args }) => {
        const command = new Command();
        const defaultCommand = command.action(
          lazy(() => import('./commands/packageExports'), 'command'),
        );

        await defaultCommand.parseAsync(args, { from: 'user' });
      },
    });

    reg.addCommand({
      path: ['migrate', 'package-lint-configs'],
      description:
        'Migrates all packages to use @backstage/cli/config/eslint-factory',
      execute: async ({ args }) => {
        const command = new Command();
        const defaultCommand = command.action(
          lazy(() => import('./commands/packageLintConfigs'), 'command'),
        );

        await defaultCommand.parseAsync(args, { from: 'user' });
      },
    });

    reg.addCommand({
      path: ['migrate', 'react-router-deps'],
      description:
        'Migrates the react-router dependencies for all packages to be peer dependencies',
      execute: async ({ args }) => {
        const command = new Command();
        const defaultCommand = command.action(
          lazy(() => import('./commands/reactRouterDeps'), 'command'),
        );

        await defaultCommand.parseAsync(args, { from: 'user' });
      },
    });
  },
});
