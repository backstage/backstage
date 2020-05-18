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
    .command('create-app')
    .description('Creates a new app in a new directory')
    .action(actionHandler(() => require('./commands/create-app/createApp')));

  program
    .command('app:build')
    .description('Build an app for a production release')
    .option('--stats', 'Write bundle stats to output directory')
    .action(actionHandler(() => require('./commands/app/build')));

  program
    .command('app:serve')
    .description('Serve an app for local development')
    .option('--check', 'Enable type checking and linting')
    .action(actionHandler(() => require('./commands/app/serve')));

  program
    .command('create-plugin')
    .description('Creates a new plugin in the current repository')
    .action(
      actionHandler(() => require('./commands/create-plugin/createPlugin')),
    );

  program
    .command('remove-plugin')
    .description('Removes plugin in the current repository')
    .action(
      actionHandler(() => require('./commands/remove-plugin/removePlugin')),
    );

  program
    .command('plugin:build')
    .description('Build a plugin')
    .action(actionHandler(() => require('./commands/plugin/build')));

  program
    .command('plugin:serve')
    .description('Serves the dev/ folder of a plugin')
    .option('--check', 'Enable type checking and linting')
    .action(actionHandler(() => require('./commands/plugin/serve')));

  program
    .command('plugin:diff')
    .option('--check', 'Fail if changes are required')
    .option('--yes', 'Apply all changes')
    .description('Diff an existing plugin with the creation template')
    .action(actionHandler(() => require('./commands/plugin/diff')));

  program
    .command('lint')
    .option('--fix', 'Attempt to automatically fix violations')
    .description('Lint a package')
    .action(actionHandler(() => require('./commands/lint')));

  program
    .command('test')
    .allowUnknownOption(true) // Allows the command to run, but we still need to parse raw args
    .helpOption(', --backstage-cli-help') // Let Jest handle help
    .description('Run tests, forwarding args to Jest, defaulting to watch mode')
    .action(actionHandler(() => require('./commands/testCommand')));

  program
    .command('prepack')
    .description('Prepares a package for packaging before publishing')
    .action(actionHandler(() => require('./commands/pack').pre));

  program
    .command('postpack')
    .description('Restores the changes made by the prepack command')
    .action(actionHandler(() => require('./commands/pack').post));

  program
    .command('watch-deps')
    .option('--build', 'Build all dependencies on startup')
    .description('Watch all dependencies while running another command')
    .action(actionHandler(() => require('./commands/watch-deps')));

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
    .action(actionHandler(() => require('./commands/build-cache')));

  program
    .command('clean')
    .description('Delete cache directories')
    .action(actionHandler(() => require('./commands/clean/clean')));

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
  actionRequireFunc:
    | (() => { default(...args: T): Promise<any> })
    | (() => (...args: T) => Promise<any>),
): (...args: T) => Promise<never> {
  return async (...args: T) => {
    try {
      const ret = actionRequireFunc();
      const actionFunc = typeof ret === 'function' ? ret : ret.default;
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
