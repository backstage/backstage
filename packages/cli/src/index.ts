/*
 * Copyright 2020 Spotify AB
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

import program from 'commander';
import chalk from 'chalk';
import { exitWithError } from './lib/errors';
import { version } from './lib/version';

const main = (argv: string[]) => {
  program.name('backstage-cli').version(version);

  program
    .command('app:build')
    .description('Build an app for a production release')
    .option('--stats', 'Write bundle stats to output directory')
    .action(run(() => import('./commands/app/build').then(m => m.default)));

  program
    .command('app:serve')
    .description('Serve an app for local development')
    .option('--check', 'Enable type checking and linting')
    .action(run(() => import('./commands/app/serve').then(m => m.default)));

  program
    .command('backend:build')
    .description('Build a backend plugin')
    .action(run(() => import('./commands/backend/build').then(m => m.default)));

  program
    .command('backend:build-image <image-tag>')
    .description(
      'Builds a docker image from the package, with all local deps included',
    )
    .action(
      run(() => import('./commands/backend/buildImage').then(m => m.default)),
    );

  program
    .command('backend:dev')
    .description('Start local development server with HMR for the backend')
    .option('--check', 'Enable type checking and linting')
    .option('--inspect', 'Enable debugger')
    .action(run(() => import('./commands/backend/dev').then(m => m.default)));

  program
    .command('app:diff')
    .option('--check', 'Fail if changes are required')
    .option('--yes', 'Apply all changes')
    .description('Diff an existing app with the creation template')
    .action(run(() => import('./commands/app/diff').then(m => m.default)));

  program
    .command('create-plugin')
    .description('Creates a new plugin in the current repository')
    .action(
      run(() =>
        import('./commands/create-plugin/createPlugin').then(m => m.default),
      ),
    );

  program
    .command('remove-plugin')
    .description('Removes plugin in the current repository')
    .action(
      run(() =>
        import('./commands/remove-plugin/removePlugin').then(m => m.default),
      ),
    );

  program
    .command('plugin:build')
    .description('Build a plugin')
    .action(run(() => import('./commands/plugin/build').then(m => m.default)));

  program
    .command('plugin:serve')
    .description('Serves the dev/ folder of a plugin')
    .option('--check', 'Enable type checking and linting')
    .action(run(() => import('./commands/plugin/serve').then(m => m.default)));

  program
    .command('plugin:export')
    .description('Exports the dev/ folder of a plugin')
    .option('--stats', 'Write bundle stats to output directory')
    .action(run(() => import('./commands/plugin/export').then(m => m.default)));

  program
    .command('plugin:diff')
    .option('--check', 'Fail if changes are required')
    .option('--yes', 'Apply all changes')
    .description('Diff an existing plugin with the creation template')
    .action(run(() => import('./commands/plugin/diff').then(m => m.default)));

  program
    .command('build')
    .description('Build a package for publishing')
    .option('--outputs <formats>', 'List of formats to output [types,cjs,esm]')
    .action(run(() => import('./commands/build').then(m => m.default)));

  program
    .command('lint')
    .option(
      '--format <format>',
      'Lint report output format',
      'eslint-formatter-friendly',
    )
    .option('--fix', 'Attempt to automatically fix violations')
    .description('Lint a package')
    .action(run(() => import('./commands/lint').then(m => m.default)));

  program
    .command('test')
    .allowUnknownOption(true) // Allows the command to run, but we still need to parse raw args
    .helpOption(', --backstage-cli-help') // Let Jest handle help
    .description('Run tests, forwarding args to Jest, defaulting to watch mode')
    .action(run(() => import('./commands/testCommand').then(m => m.default)));

  program
    .command('config:print')
    .option('--with-secrets', 'Include secrets in the printed configuration')
    .option(
      '--env <env>',
      'The environment to print configuration for [NODE_ENV or development]',
    )
    .option(
      '--format <format>',
      'Format to print the configuration in, either json or yaml [yaml]',
    )
    .description('Print the app configuration for the current package')
    .action(run(() => import('./commands/config/print').then(m => m.default)));

  program
    .command('prepack')
    .description('Prepares a package for packaging before publishing')
    .action(run(() => import('./commands/pack').then(m => m.pre)));

  program
    .command('postpack')
    .description('Restores the changes made by the prepack command')
    .action(run(() => import('./commands/pack').then(m => m.post)));

  program
    .command('clean')
    .description('Delete cache directories')
    .action(run(() => import('./commands/clean/clean').then(m => m.default)));

  program
    .command('build-workspace <workspace-dir> ...<packages>')
    .description('Builds a temporary dist workspace from the provided packages')
    .action(
      run(() => import('./commands/buildWorkspace').then(m => m.default)),
    );

  program.on('command:*', () => {
    console.log();
    console.log(
      chalk.red(`Invalid command: ${chalk.cyan(program.args.join(' '))}`),
    );
    console.log(chalk.red('See --help for a list of available commands.'));
    console.log();
    process.exit(1);
  });

  if (!process.argv.slice(2).length) {
    program.outputHelp(chalk.yellow);
  }

  program.parse(argv);
};

// Wraps an action function so that it always exits and handles errors
function run(
  getActionFunc: () => Promise<(...args: any[]) => Promise<void>>,
): (...args: any[]) => Promise<never> {
  return async (...args: any[]) => {
    try {
      const actionFunc = await getActionFunc();
      await actionFunc(...args);
      process.exit(0);
    } catch (error) {
      exitWithError(error);
    }
  };
}

process.on('unhandledRejection', rejection => {
  if (rejection instanceof Error) {
    exitWithError(rejection);
  } else {
    exitWithError(new Error(`Unknown rejection: '${rejection}'`));
  }
});

main(process.argv);
