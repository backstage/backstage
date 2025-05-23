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
import { registerCommands as registerConfigCommands } from '../modules/config';
import {
  registerPackageCommands as registerPackageBuildCommands,
  registerRepoCommands as registerRepoBuildCommands,
  registerCommands as registerBuildCommands,
} from '../modules/build';
import {
  registerPackageCommands as registerPackageStartCommands,
  registerRepoCommands as registerRepoStartCommands,
} from '../modules/start';
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
import { removed } from '../lib/removed';
import { registerCommands as registerNewCommands } from '../modules/new';
import { registerCommands as registerCreateGithubAppCommands } from '../modules/create-github-app';

export function registerRepoCommand(program: Command) {
  const command = program
    .command('repo [command]')
    .description('Command that run across an entire Backstage project');

  registerRepoStartCommands(command);
  registerRepoBuildCommands(command);
  registerRepoTestCommands(command);
  registerRepoLintCommands(command);
  registerMaintenanceRepoCommands(command);
}

export function registerScriptCommand(program: Command) {
  const command = program
    .command('package [command]')
    .description('Lifecycle scripts for individual packages');

  registerPackageStartCommands(command);
  registerPackageBuildCommands(command);
  registerPackageTestCommands(command);
  registerMaintenancePackageCommands(command);
  registerPackageLintCommands(command);
}

export function registerCommands(program: Command) {
  registerConfigCommands(program);
  registerRepoCommand(program);
  registerScriptCommand(program);
  registerMigrateCommand(program);
  registerBuildCommands(program);
  registerInfoCommands(program);
  registerNewCommands(program);
  registerCreateGithubAppCommands(program);
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
