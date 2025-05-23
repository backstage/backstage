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
    .command('lint [directories...]')
    .option(
      '--format <format>',
      'Lint report output format',
      'eslint-formatter-friendly',
    )
    .option(
      '--output-file <path>',
      'Write the lint report to a file instead of stdout',
    )
    .option('--fix', 'Attempt to automatically fix violations')
    .option(
      '--max-warnings <number>',
      'Fail if more than this number of warnings. -1 allows warnings. (default: -1)',
    )
    .description('Lint a package')
    .action(lazy(() => import('./commands/package/lint'), 'default'));
}

export function registerRepoCommands(command: Command) {
  command
    .command('lint')
    .description('Lint all packages in the project')
    .option(
      '--format <format>',
      'Lint report output format',
      'eslint-formatter-friendly',
    )
    .option(
      '--output-file <path>',
      'Write the lint report to a file instead of stdout',
    )
    .option(
      '--since <ref>',
      'Only lint packages that changed since the specified ref',
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
      '--max-warnings <number>',
      'Fail if more than this number of warnings. -1 allows warnings. (default: -1)',
    )
    .option('--fix', 'Attempt to automatically fix violations')
    .action(lazy(() => import('./commands/repo/lint'), 'command'));
}
