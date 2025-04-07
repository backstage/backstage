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
import { Command } from 'commander';
import { lazy } from '../../lib/lazy';
import { configOption } from '../config';

export function registerRepoCommands(command: Command) {
  command
    .command('start')
    .description('Starts packages in the repo for local development')
    .argument(
      '[packageNameOrPath...]',
      'Run the specified package instead of the defaults.',
    )
    .option(
      '--plugin <pluginId>',
      'Start the dev entry-point for any matching plugin package in the repo',
      (opt: string, opts: string[]) => (opts ? [...opts, opt] : [opt]),
      Array<string>(),
    )
    .option(...configOption)
    .option(
      '--inspect [host]',
      'Enable debugger in Node.js environments. Applies to backend package only',
    )
    .option(
      '--inspect-brk [host]',
      'Enable debugger in Node.js environments, breaking before code starts. Applies to backend package only',
    )
    .option(
      '--require <path...>',
      'Add a --require argument to the node process. Applies to backend package only',
    )
    .option('--link <path>', 'Link an external workspace for module resolution')
    .action(lazy(() => import('./commands/repo/start'), 'command'));
}

export function registerPackageCommands(command: Command) {
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
    .action(lazy(() => import('./commands/package/start'), 'command'));
}
