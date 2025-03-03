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

export function registerRepoCommands(command: Command) {
  command
    .command('test')
    .allowUnknownOption(true) // Allows the command to run, but we still need to parse raw args
    .option(
      '--since <ref>',
      'Only test packages that changed since the specified ref',
    )
    .option(
      '--successCache',
      'Enable success caching, which skips running tests for unchanged packages that were successful in the previous run',
    )
    .option(
      '--successCacheDir <path>',
      'Set the success cache location, (default: node_modules/.cache/backstage-cli)',
    )
    .option(
      '--jest-help',
      'Show help for Jest CLI options, which are passed through',
    )
    .description('Run tests, forwarding args to Jest, defaulting to watch mode')
    .action(lazy(() => import('./commands/repo/test'), 'command'));
}

export function registerPackageCommands(command: Command) {
  command
    .command('test')
    .allowUnknownOption(true) // Allows the command to run, but we still need to parse raw args
    .helpOption(', --backstage-cli-help') // Let Jest handle help
    .description('Run tests, forwarding args to Jest, defaulting to watch mode')
    .action(lazy(() => import('./commands/package/test'), 'default'));
}
