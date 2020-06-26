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
    .action(
      lazyAction(() => import('./commands/create-app/createApp'), 'default'),
    );

  program
    .command('app:build')
    .description('Build an app for a production release')
    .option('--stats', 'Write bundle stats to output directory')
    .action(lazyAction(() => import('./commands/app/build'), 'default'));

  program
    .command('app:serve')
    .description('Serve an app for local development')
    .option('--check', 'Enable type checking and linting')
    .action(lazyAction(() => import('./commands/app/serve'), 'default'));

  program
    .command('backend:build')
    .description('Build a backend plugin')
    .action(lazyAction(() => import('./commands/backend/build'), 'default'));

  program
    .command('backend:build-image <image-tag>')
    .description(
      'Builds a docker image from the package, with all local deps included',
    )
    .action(
      lazyAction(() => import('./commands/backend/buildImage'), 'default'),
    );

  program
    .command('backend:dev')
    .description('Start local development server with HMR for the backend')
    .option('--check', 'Enable type checking and linting')
    .action(lazyAction(() => import('./commands/backend/dev'), 'default'));

  program
    .command('app:diff')
    .option('--check', 'Fail if changes are required')
    .option('--yes', 'Apply all changes')
    .description('Diff an existing app with the creation template')
    .action(lazyAction(() => import('./commands/app/diff'), 'default'));

  program
    .command('create-plugin')
    .description('Creates a new plugin in the current repository')
    .action(
      lazyAction(
        () => import('./commands/create-plugin/createPlugin'),
        'default',
      ),
    );

  program
    .command('remove-plugin')
    .description('Removes plugin in the current repository')
    .action(
      lazyAction(
        () => import('./commands/remove-plugin/removePlugin'),
        'default',
      ),
    );

  program
    .command('plugin:build')
    .description('Build a plugin')
    .action(lazyAction(() => import('./commands/plugin/build'), 'default'));

  program
    .command('plugin:serve')
    .description('Serves the dev/ folder of a plugin')
    .option('--check', 'Enable type checking and linting')
    .action(lazyAction(() => import('./commands/plugin/serve'), 'default'));

  program
    .command('plugin:diff')
    .option('--check', 'Fail if changes are required')
    .option('--yes', 'Apply all changes')
    .description('Diff an existing plugin with the creation template')
    .action(lazyAction(() => import('./commands/plugin/diff'), 'default'));

  program
    .command('build')
    .description('Build a package for publishing')
    .option('--outputs <formats>', 'List of formats to output [types,cjs,esm]')
    .action(lazyAction(() => import('./commands/build'), 'default'));

  program
    .command('lint')
    .option('--fix', 'Attempt to automatically fix violations')
    .description('Lint a package')
    .action(lazyAction(() => import('./commands/lint'), 'default'));

  program
    .command('test')
    .allowUnknownOption(true) // Allows the command to run, but we still need to parse raw args
    .helpOption(', --backstage-cli-help') // Let Jest handle help
    .description('Run tests, forwarding args to Jest, defaulting to watch mode')
    .action(lazyAction(() => import('./commands/testCommand'), 'default'));

  program
    .command('prepack')
    .description('Prepares a package for packaging before publishing')
    .action(lazyAction(() => import('./commands/pack'), 'pre'));

  program
    .command('postpack')
    .description('Restores the changes made by the prepack command')
    .action(lazyAction(() => import('./commands/pack'), 'post'));

  program
    .command('clean')
    .description('Delete cache directories')
    .action(lazyAction(() => import('./commands/clean/clean'), 'default'));

  program
    .command('build-workspace <workspace-dir> ...<packages>')
    .description('Builds a temporary dist workspace from the provided packages')
    .action(lazyAction(() => import('./commands/buildWorkspace'), 'default'));

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
function lazyAction<T extends readonly any[], Export extends string>(
  actionRequireFunc: () => Promise<
    { [name in Export]: (...args: T) => Promise<any> }
  >,
  exportName: Export,
): (...args: T) => Promise<never> {
  return async (...args: T) => {
    try {
      const module = await actionRequireFunc();
      const actionFunc = module[exportName];
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
