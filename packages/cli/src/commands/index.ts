/*
 * Copyright 2020 The Backstage Authors
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
import { lazy } from '../lib/lazy';
import {
  configOption,
  registerCommands as registerConfigCommands,
} from '../modules/config';
import {
  registerPackageCommands as registerPackageBuildCommands,
  registerRepoCommands as registerRepoBuildCommands,
  registerCommands as registerBuildCommands,
} from '../modules/build';
import { registerCommands as registerInfoCommands } from '../modules/info';
import { registerCommands as registerMigrateCommand } from '../modules/migrate';
import {
  registerRepoCommands as registerRepoTestCommands,
  registerPackageCommands as registerPackageTestCommands,
} from '../modules/test';
import {
  registerPackageCommands as registerPackageLintCommands,
  registerRepoCommands as registerRepoLintCommands,
} from '../modules/lint';
import {
  registerPackageCommands as registerMaintenancePackageCommands,
  registerRepoCommands as registerMaintenanceRepoCommands,
} from '../modules/maintenance';

export function registerRepoCommand(program: Command) {
  const command = program
    .command('repo [command]')
    .description('Command that run across an entire Backstage project');

  registerRepoBuildCommands(command);
  registerRepoTestCommands(command);
  registerRepoLintCommands(command);
  registerMaintenanceRepoCommands(command);
}

export function registerScriptCommand(program: Command) {
  const command = program
    .command('package [command]')
    .description('Lifecycle scripts for individual packages');

  command
    .command('start')
    .description('Start a package for local development')
    .option(...configOption)
    .option('--role <name>', 'Run the command with an explicit package role')
    .option('--check', 'Enable type checking and linting if available')
    .option('--inspect [host]', 'Enable debugger in Node.js environments')
    .option(
      '--inspect-brk [host]',
      'Enable debugger in Node.js environments, breaking before code starts',
    )
    .option(
      '--require <path...>',
      'Add a --require argument to the node process',
    )
    .option('--link <path>', 'Link an external workspace for module resolution')
    .action(lazy(() => import('./start'), 'command'));

  registerPackageBuildCommands(command);
  registerPackageTestCommands(command);
  registerMaintenancePackageCommands(command);
  registerPackageLintCommands(command);
}

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
    .action(lazy(() => import('./new/new'), 'default'));

  registerConfigCommands(program);
  registerRepoCommand(program);
  registerScriptCommand(program);
  registerMigrateCommand(program);
  registerBuildCommands(program);
  registerInfoCommands(program);
  program
    .command('create-github-app <github-org>')
    .description('Create new GitHub App in your organization.')
    .action(lazy(() => import('./create-github-app'), 'default'));

  // Notifications for removed commands
  program
    .command('create')
    .allowUnknownOption(true)
    .action(removed("use 'backstage-cli new' instead"));
  program
    .command('create-plugin')
    .allowUnknownOption(true)
    .action(removed("use 'backstage-cli new' instead"));
  program
    .command('plugin:diff')
    .allowUnknownOption(true)
    .action(removed("use 'backstage-cli fix' instead"));
  program
    .command('test')
    .allowUnknownOption(true)
    .action(
      removed(
        "use 'backstage-cli repo test' or 'backstage-cli package test' instead",
      ),
    );
  program
    .command('clean')
    .allowUnknownOption(true)
    .action(removed("use 'backstage-cli package clean' instead"));
  program
    .command('versions:check')
    .allowUnknownOption(true)
    .action(removed("use 'yarn dedupe' or 'yarn-deduplicate' instead"));
  program.command('install').allowUnknownOption(true).action(removed());
  program.command('onboard').allowUnknownOption(true).action(removed());
}

function removed(message?: string) {
  return () => {
    console.error(
      message
        ? `This command has been removed, ${message}`
        : 'This command has been removed',
    );
    process.exit(1);
  };
}
