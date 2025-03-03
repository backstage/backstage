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

import { lazy } from '../../lib/lazy';
import { Command } from 'commander';

export function registerCommands(program: Command) {
  program
    .command('versions:bump')
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
    .description('Bump Backstage packages to the latest versions')
    .action(lazy(() => import('./commands/versions/bump'), 'default'));

  program
    .command('versions:migrate')
    .option(
      '--pattern <glob>',
      'Override glob for matching packages to upgrade',
    )
    .option(
      '--skip-code-changes',
      'Skip code changes and only update package.json files',
    )
    .description(
      'Migrate any plugins that have been moved to the @backstage-community namespace automatically',
    )
    .action(lazy(() => import('./commands/versions/migrate'), 'default'));

  const command = program
    .command('migrate [command]')
    .description('Migration utilities');

  command
    .command('package-roles')
    .description(`Add package role field to packages that don't have it`)
    .action(lazy(() => import('./commands/packageRole'), 'default'));

  command
    .command('package-scripts')
    .description('Set package scripts according to each package role')
    .action(lazy(() => import('./commands/packageScripts'), 'command'));

  command
    .command('package-exports')
    .description('Synchronize package subpath export definitions')
    .action(lazy(() => import('./commands/packageExports'), 'command'));

  command
    .command('package-lint-configs')
    .description(
      'Migrates all packages to use @backstage/cli/config/eslint-factory',
    )
    .action(lazy(() => import('./commands/packageLintConfigs'), 'command'));

  command
    .command('react-router-deps')
    .description(
      'Migrates the react-router dependencies for all packages to be peer dependencies',
    )
    .action(lazy(() => import('./commands/reactRouterDeps'), 'command'));
}
