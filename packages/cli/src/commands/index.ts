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

import { Command, Option } from 'commander';
import { lazy } from '../lib/lazy';
import {
  configOption,
  registerCommands as registerConfigCommands,
} from '../modules/config';

export function registerRepoCommand(program: Command) {
  const command = program
    .command('repo [command]')
    .description('Command that run across an entire Backstage project');

  command
    .command('build')
    .description(
      'Build packages in the project, excluding bundled app and backend packages.',
    )
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
    .action(lazy(() => import('./repo/build'), 'command'));

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
    .option('--fix', 'Attempt to automatically fix violations')
    .action(lazy(() => import('./repo/lint'), 'command'));

  command
    .command('fix')
    .description('Automatically fix packages in the project')
    .option(
      '--publish',
      'Enable additional fixes that only apply when publishing packages',
    )
    .option(
      '--check',
      'Fail if any packages would have been changed by the command',
    )
    .action(lazy(() => import('./repo/fix'), 'command'));

  command
    .command('clean')
    .description('Delete cache and output directories')
    .action(lazy(() => import('./repo/clean'), 'command'));

  command
    .command('list-deprecations')
    .description('List deprecations')
    .option('--json', 'Output as JSON')
    .action(lazy(() => import('./repo/list-deprecations'), 'command'));

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
    .action(lazy(() => import('./repo/test'), 'command'));
}

export function registerScriptCommand(program: Command) {
  const command = program
    .command('package [command]')
    .description('Lifecycle scripts for individual packages');

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
    .option('--require <path>', 'Add a --require argument to the node process')
    .option('--link <path>', 'Link an external workspace for module resolution')
    .action(lazy(() => import('./start'), 'command'));

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
    .action(lazy(() => import('./build'), 'command'));

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
      'Fail if more than this number of warnings. -1 allows warnings. (default: 0)',
    )
    .description('Lint a package')
    .action(lazy(() => import('./lint'), 'default'));

  command
    .command('test')
    .allowUnknownOption(true) // Allows the command to run, but we still need to parse raw args
    .helpOption(', --backstage-cli-help') // Let Jest handle help
    .description('Run tests, forwarding args to Jest, defaulting to watch mode')
    .action(lazy(() => import('./test'), 'default'));

  command
    .command('clean')
    .description('Delete cache directories')
    .action(lazy(() => import('./clean/clean'), 'default'));

  command
    .command('prepack')
    .description('Prepares a package for packaging before publishing')
    .action(lazy(() => import('./pack'), 'pre'));

  command
    .command('postpack')
    .description('Restores the changes made by the prepack command')
    .action(lazy(() => import('./pack'), 'post'));
}

export function registerMigrateCommand(program: Command) {
  const command = program
    .command('migrate [command]')
    .description('Migration utilities');

  command
    .command('package-roles')
    .description(`Add package role field to packages that don't have it`)
    .action(lazy(() => import('./migrate/packageRole'), 'default'));

  command
    .command('package-scripts')
    .description('Set package scripts according to each package role')
    .action(lazy(() => import('./migrate/packageScripts'), 'command'));

  command
    .command('package-exports')
    .description('Synchronize package subpath export definitions')
    .action(lazy(() => import('./migrate/packageExports'), 'command'));

  command
    .command('package-lint-configs')
    .description(
      'Migrates all packages to use @backstage/cli/config/eslint-factory',
    )
    .action(lazy(() => import('./migrate/packageLintConfigs'), 'command'));

  command
    .command('react-router-deps')
    .description(
      'Migrates the react-router dependencies for all packages to be peer dependencies',
    )
    .action(lazy(() => import('./migrate/reactRouterDeps'), 'command'));
}

export function registerCommands(program: Command) {
  program
    .command('new')
    .storeOptionsAsProperties(false)
    .description(
      'Open up an interactive guide to creating new things in your app',
    )
    .option(
      '--select <name>',
      'Select the thing you want to be creating upfront',
    )
    .option(
      '--option <name>=<value>',
      'Pre-fill options for the creation process',
      (opt, arr: string[]) => [...arr, opt],
      [],
    )
    .option('--scope <scope>', 'The scope to use for new packages')
    .option(
      '--npm-registry <URL>',
      'The package registry to use for new packages',
    )
    .option(
      '--baseVersion <version>',
      'The version to use for any new packages (default: 0.1.0)',
    )
    .option(
      '--license <license>',
      'The license to use for any new packages (default: Apache-2.0)',
    )
    .option('--no-private', 'Do not mark new packages as private')
    .action(lazy(() => import('./new/new'), 'default'));

  registerConfigCommands(program);
  registerRepoCommand(program);
  registerScriptCommand(program);
  registerMigrateCommand(program);

  program
    .command('versions:bump')
    .option(
      '--pattern <glob>',
      'Override glob for matching packages to upgrade',
    )
    .option(
      '--release <version|next|main>',
      'Bump to a specific Backstage release line or version',
      'main',
    )
    .option('--skip-install', 'Skips yarn install step')
    .option('--skip-migrate', 'Skips migration of any moved packages')
    .description('Bump Backstage packages to the latest versions')
    .action(lazy(() => import('./versions/bump'), 'default'));

  program
    .command('versions:migrate')
    .option(
      '--pattern <glob>',
      'Override glob for matching packages to upgrade',
    )
    .option(
      '--skip-code-changes',
      'Skip code changes and only update package.json files',
    )
    .description(
      'Migrate any plugins that have been moved to the @backstage-community namespace automatically',
    )
    .action(lazy(() => import('./versions/migrate'), 'default'));

  program
    .command('build-workspace <workspace-dir> [packages...]')
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
    .description('Builds a temporary dist workspace from the provided packages')
    .action(lazy(() => import('./buildWorkspace'), 'default'));

  program
    .command('create-github-app <github-org>')
    .description('Create new GitHub App in your organization.')
    .action(lazy(() => import('./create-github-app'), 'default'));

  program
    .command('info')
    .description('Show helpful information for debugging and reporting bugs')
    .action(lazy(() => import('./info'), 'default'));

  // Notifications for removed commands
  program
    .command('create')
    .allowUnknownOption(true)
    .action(removed("use 'backstage-cli new' instead"));
  program
    .command('create-plugin')
    .allowUnknownOption(true)
    .action(removed("use 'backstage-cli new' instead"));
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

function removed(message?: string) {
  return () => {
    console.error(
      message
        ? `This command has been removed, ${message}`
        : 'This command has been removed',
    );
    process.exit(1);
  };
}
