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
import { removed } from '../lib/removed';
import { registerCommands as registerNewCommands } from '../modules/new';

export function registerRepoCommand(program: Command) {
  const command = program
    .command('repo [command]')
    .description('Command that run across an entire Backstage project');

  registerRepoBuildCommands(command);
  registerRepoTestCommands(command);
  registerRepoLintCommands(command);

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
    .action(lazy(() => import('./repo/fix'), 'command'));

  command
    .command('clean')
    .description('Delete cache and output directories')
    .action(lazy(() => import('./repo/clean'), 'command'));

  command
    .command('list-deprecations')
    .description('List deprecations')
    .option('--json', 'Output as JSON')
    .action(lazy(() => import('./repo/list-deprecations'), 'command'));
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
    .option('--require <path>', 'Add a --require argument to the node process')
    .option('--link <path>', 'Link an external workspace for module resolution')
    .action(lazy(() => import('./start'), 'command'));

  registerPackageBuildCommands(command);
  registerPackageTestCommands(command);

  registerPackageLintCommands(command);
  command
    .command('clean')
    .description('Delete cache directories')
    .action(lazy(() => import('./clean/clean'), 'default'));

  command
    .command('prepack')
    .description('Prepares a package for packaging before publishing')
    .action(lazy(() => import('./pack'), 'pre'));

  command
    .command('postpack')
    .description('Restores the changes made by the prepack command')
    .action(lazy(() => import('./pack'), 'post'));
}

export function registerCommands(program: Command) {
  registerConfigCommands(program);
  registerRepoCommand(program);
  registerScriptCommand(program);
  registerMigrateCommand(program);
  registerBuildCommands(program);
  registerInfoCommands(program);
  registerNewCommands(program);

  // Notifications for removed commands

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
