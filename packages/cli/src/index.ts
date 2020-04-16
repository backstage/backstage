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
import { exitWithError } from 'helpers/errors';
import { version } from 'helpers/version';

const main = (argv: string[]) => {
  program.name('backstage-cli').version(version);

  program
    .command('create-app')
    .description('Creates a new app in a new directory')
    .action(actionHandler(() => require('commands/create-app/createApp')));

  program
    .command('app:build')
    .description('Build an app for a production release')
    .action(actionHandler(() => require('commands/app/build')));

  program
    .command('app:serve')
    .description('Serve an app for local development')
    .action(actionHandler(() => require('commands/app/serve')));

  program
    .command('create-plugin')
    .description('Creates a new plugin in the current repository')
    .action(
      actionHandler(() => require('commands/create-plugin/createPlugin')),
    );

  program
    .command('remove-plugin')
    .description('Removes plugin in the current repository')
    .action(
      actionHandler(() => require('commands/remove-plugin/removePlugin')),
    );

  program
    .command('plugin:build')
    .option('--watch', 'Enable watch mode')
    .description('Build a plugin')
    .action(actionHandler(() => require('commands/plugin/build')));

  program
    .command('plugin:serve')
    .description('Serves the dev/ folder of a plugin')
    .action(actionHandler(() => require('commands/plugin/serve')));

  program
    .command('lint')
    .option('--fix', 'Attempt to automatically fix violations')
    .description('Lint a package')
    .action(actionHandler(() => require('commands/lint')));

  program
    .command('test')
    .option('--watch', 'Enable watch mode')
    .option('--coverage', 'Report test coverage')
    .description('Run all tests for package')
    .action(actionHandler(() => require('commands/testCommand')));

  program
    .command('watch-deps')
    .option('--build', 'Build all dependencies on startup')
    .description('Watch all dependencies while running another command')
    .action(actionHandler(() => require('commands/watch-deps')));

  program
    .command('build-cache')
    .description('Wrap build command with a cache')
    .option(
      '--input <dirs>',
      'List of input directories that invalidate the cache [.]',
      (value, acc) => acc.concat(value),
      [],
    )
    .option('--output <dir>', 'Output directory to cache', 'dist')
    .option(
      '--cache-dir <dir>',
      'Cache dir',
      '<repoRoot>/node_modules/.cache/backstage-builds',
    )
    .action(actionHandler(() => require('commands/build-cache')));

  program
    .command('clean')
    .description('Delete cache directories')
    .action(actionHandler(() => require('commands/clean/clean')));

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
function actionHandler<T extends readonly any[]>(
  actionRequireFunc: () => { default(...args: T): Promise<any> },
): (...args: T) => Promise<never> {
  return async (...args: T) => {
    try {
      const actionFunc = actionRequireFunc().default;
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
