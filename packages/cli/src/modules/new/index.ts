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
import { removed } from '../../lib/removed';

export function registerCommands(program: Command) {
  program
    .command('new')
    .storeOptionsAsProperties(false)
    .description(
      'Open up an interactive guide to creating new things in your app',
    )
    .option(
      '--select <name>',
      'Select the thing you want to be creating upfront',
    )
    .option(
      '--option <name>=<value>',
      'Pre-fill options for the creation process',
      (opt, arr: string[]) => [...arr, opt],
      [],
    )
    .option(
      '--skip-install',
      `Skips running 'yarn install' and 'yarn lint --fix'`,
    )
    .option('--scope <scope>', 'The scope to use for new packages')
    .option(
      '--npm-registry <URL>',
      'The package registry to use for new packages',
    )
    .option(
      '--baseVersion <version>',
      'The version to use for any new packages (default: 0.1.0)',
    )
    .option(
      '--license <license>',
      'The license to use for any new packages (default: Apache-2.0)',
    )
    .option('--no-private', 'Do not mark new packages as private')
    .action(lazy(() => import('./commands/new'), 'default'));

  program
    .command('create-github-app <github-org>')
    .description('Create new GitHub App in your organization.')
    .action(lazy(() => import('./commands/create-github-app'), 'default'));

  program
    .command('create')
    .allowUnknownOption(true)
    .action(removed("use 'backstage-cli new' instead"));
  program
    .command('create-plugin')
    .allowUnknownOption(true)
    .action(removed("use 'backstage-cli new' instead"));
}
