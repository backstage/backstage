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
import fs from 'fs';
import createPluginCommand from './commands/createPlugin';
import watch from './commands/watch-deps';
import pluginCopyAssets from './commands/plugin/copyAssets';
import pluginBuild from './commands/plugin/build';
import pluginLint from './commands/plugin/lint';
import pluginServe from './commands/plugin/serve';
import pluginTest from './commands/plugin/testCommand';

process.on('unhandledRejection', err => {
  throw err;
});

const main = (argv: string[]) => {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));

  program.name('backstage-cli').version(packageJson.version ?? '0.0.0');

  program
    .command('create-plugin')
    .description('Creates a new plugin in the current repository')
    .action(createPluginCommand);

  program
    .command('plugin:build')
    .option('--watch', 'Enable watch mode')
    .description('Build a plugin')
    .action(pluginBuild);

  program
    .command('plugin:copyAssets')
    .description('Copy assets for a plugin')
    .action(pluginCopyAssets);

  program
    .command('plugin:lint')
    .option('--fix', 'Attempt to automatically fix violations')
    .description('Lint a plugin')
    .action(pluginLint);

  program
    .command('plugin:serve')
    .description('Serves the dev/ folder of a plugin')
    .action(pluginServe);

  program
    .command('plugin:test')
    .option('--watch', 'Enable watch mode')
    .option('--coverage', 'Report test coverage')
    .description('Run all tests for a plugin')
    .action(pluginTest);

  program
    .command('watch-deps')
    .description('Watch all dependencies while running another command')
    .action(watch);

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

main(process.argv);
// main([process.argv[0], process.argv[1], '--version']);
