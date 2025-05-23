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
import { lazy } from '../../lib/lazy';

export function registerPackageCommands(command: Command) {
  command
    .command('clean')
    .description('Delete cache directories')
    .action(lazy(() => import('./commands/package/clean'), 'default'));

  command
    .command('prepack')
    .description('Prepares a package for packaging before publishing')
    .action(lazy(() => import('./commands/package/pack'), 'pre'));

  command
    .command('postpack')
    .description('Restores the changes made by the prepack command')
    .action(lazy(() => import('./commands/package/pack'), 'post'));
}

export function registerRepoCommands(command: Command) {
  command
    .command('fix')
    .description('Automatically fix packages in the project')
    .option(
      '--publish',
      'Enable additional fixes that only apply when publishing packages',
    )
    .option(
      '--check',
      'Fail if any packages would have been changed by the command',
    )
    .action(lazy(() => import('./commands/repo/fix'), 'command'));

  command
    .command('clean')
    .description('Delete cache and output directories')
    .action(lazy(() => import('./commands/repo/clean'), 'command'));

  command
    .command('list-deprecations')
    .description('List deprecations')
    .option('--json', 'Output as JSON')
    .action(lazy(() => import('./commands/repo/list-deprecations'), 'command'));
}
