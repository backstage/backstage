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

import { Command, Option } from 'commander';
import { createCliPlugin } from '../../wiring/factory';
import { lazy } from '../../lib/lazy';
import { configOption } from '../config';

export function registerPackageCommands(command: Command) {
  command
    .command('build')
    .description('Build a package for production deployment or publishing')
    .option('--role <name>', 'Run the command with an explicit package role')
    .option(
      '--minify',
      'Minify the generated code. Does not apply to app package (app is minified by default).',
    )
    .option(
      '--skip-build-dependencies',
      'Skip the automatic building of local dependencies. Applies to backend packages only.',
    )
    .option(
      '--stats',
      'If bundle stats are available, write them to the output directory. Applies to app packages only.',
    )
    .option(
      '--config <path>',
      'Config files to load instead of app-config.yaml. Applies to app packages only.',
      (opt: string, opts: string[]) => (opts ? [...opts, opt] : [opt]),
      Array<string>(),
    )
    .action(lazy(() => import('./commands/package/build'), 'command'));
}

export const buildPlugin = createCliPlugin({
  pluginId: 'build',
  init: async reg => {
    reg.addCommand({
      path: ['package', 'build'],
      description: 'Build a package for production deployment or publishing',
      execute: async ({ args }) => {
        const command = new Command();

        const defaultCommand = command
          .option(
            '--role <name>',
            'Run the command with an explicit package role',
          )
          .option(
            '--minify',
            'Minify the generated code. Does not apply to app package (app is minified by default).',
          )
          .option(
            '--skip-build-dependencies',
            'Skip the automatic building of local dependencies. Applies to backend packages only.',
          )
          .option(
            '--stats',
            'If bundle stats are available, write them to the output directory. Applies to app packages only.',
          )
          .option(
            '--config <path>',
            'Config files to load instead of app-config.yaml. Applies to app packages only.',
            (opt: string, opts: string[]) => (opts ? [...opts, opt] : [opt]),
            Array<string>(),
          )
          .action(lazy(() => import('./commands/package/build'), 'command'));
        await defaultCommand.parseAsync(args, { from: 'user' });
      },
    });

    reg.addCommand({
      path: ['repo', 'build'],
      description:
        'Build packages in the project, excluding bundled app and backend packages.',
      execute: async ({ args }) => {
        const command = new Command();

        // This command expect `package build` to be registered, as its used to parse
        //  individual plugins' package build scripts.
        registerPackageCommands(command.command('package'));

        const defaultCommand = command
          .option(
            '--all',
            'Build all packages, including bundled app and backend packages.',
          )
          .option(
            '--since <ref>',
            'Only build packages and their dev dependents that changed since the specified ref',
          )
          .option(
            '--minify',
            'Minify the generated code. Does not apply to app package (app is minified by default).',
          )
          .action(lazy(() => import('./commands/repo/build'), 'command'));
        await defaultCommand.parseAsync(args, { from: 'user' });
      },
    });

    reg.addCommand({
      path: ['package', 'start'],
      description: 'Start a package for local development',
      execute: async ({ args }) => {
        const command = new Command();

        const defaultCommand = command
          .option(...configOption)
          .option(
            '--role <name>',
            'Run the command with an explicit package role',
          )
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
          .option(
            '--link <path>',
            'Link an external workspace for module resolution',
          )
          .action(lazy(() => import('./commands/package/start'), 'command'));

        await defaultCommand.parseAsync(args, { from: 'user' });
      },
    });

    reg.addCommand({
      path: ['repo', 'start'],
      description: 'Starts packages in the repo for local development',
      execute: async ({ args }) => {
        const command = new Command();

        const defaultCommand = command
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
          .option(
            '--link <path>',
            'Link an external workspace for module resolution',
          )
          .action(
            lazy(() => import('../build/commands/repo/start'), 'command'),
          );

        await defaultCommand.parseAsync(args, { from: 'user' });
      },
    });

    reg.addCommand({
      path: ['build-workspace'],
      description:
        'Builds a temporary dist workspace from the provided packages',
      execute: async ({ args }) => {
        const command = new Command();
        const defaultCommand = command
          .arguments('<workspace-dir> [packages...]')
          .addOption(
            new Option(
              '--alwaysYarnPack',
              'Alias for --alwaysPack for backwards compatibility.',
            )
              .implies({ alwaysPack: true })
              .hideHelp(true),
          )
          .option(
            '--alwaysPack',
            'Force workspace output to be a result of running `yarn pack` on each package (warning: very slow)',
          )
          .action(lazy(() => import('./commands/buildWorkspace'), 'default'));
        await defaultCommand.parseAsync(args, { from: 'user' });
      },
    });
  },
});

export default buildPlugin;
