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

import { assertError } from '@backstage/errors';
import { Command } from 'commander';
import { exitWithError } from '../lib/errors';

const configOption = [
  '--config <path>',
  'Config files to load instead of app-config.yaml',
  (opt: string, opts: string[]) => (opts ? [...opts, opt] : [opt]),
  Array<string>(),
] as const;

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
    .action(lazy(() => import('./repo/build').then(m => m.command)));

  command
    .command('lint')
    .description('Lint all packages in the project')
    .option(
      '--format <format>',
      'Lint report output format',
      'eslint-formatter-friendly',
    )
    .option(
      '--since <ref>',
      'Only lint packages that changed since the specified ref',
    )
    .option('--fix', 'Attempt to automatically fix violations')
    .action(lazy(() => import('./repo/lint').then(m => m.command)));

  command
    .command('clean')
    .description('Delete cache and output directories')
    .action(lazy(() => import('./repo/clean').then(m => m.command)));

  command
    .command('list-deprecations')
    .description('List deprecations')
    .option('--json', 'Output as JSON')
    .action(
      lazy(() => import('./repo/list-deprecations').then(m => m.command)),
    );

  command
    .command('test')
    .allowUnknownOption(true) // Allows the command to run, but we still need to parse raw args
    .option(
      '--since <ref>',
      'Only test packages that changed since the specified ref',
    )
    .option(
      '--jest-help',
      'Show help for Jest CLI options, which are passed through',
    )
    .description('Run tests, forwarding args to Jest, defaulting to watch mode')
    .action(lazy(() => import('./repo/test').then(m => m.command)));
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
    .option('--inspect', 'Enable debugger in Node.js environments')
    .option(
      '--inspect-brk',
      'Enable debugger in Node.js environments, breaking before code starts',
    )
    .action(lazy(() => import('./start').then(m => m.command)));

  command
    .command('build')
    .description('Build a package for production deployment or publishing')
    .option('--role <name>', 'Run the command with an explicit package role')
    .option(
      '--minify',
      'Minify the generated code. Does not apply to app or backend packages.',
    )
    .option(
      '--experimental-type-build',
      'Enable experimental type build. Does not apply to app or backend packages. [DEPRECATED]',
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
    .action(lazy(() => import('./build').then(m => m.command)));

  command
    .command('lint [directories...]')
    .option(
      '--format <format>',
      'Lint report output format',
      'eslint-formatter-friendly',
    )
    .option('--fix', 'Attempt to automatically fix violations')
    .description('Lint a package')
    .action(lazy(() => import('./lint').then(m => m.default)));

  command
    .command('test')
    .allowUnknownOption(true) // Allows the command to run, but we still need to parse raw args
    .helpOption(', --backstage-cli-help') // Let Jest handle help
    .description('Run tests, forwarding args to Jest, defaulting to watch mode')
    .action(lazy(() => import('./test').then(m => m.default)));

  command
    .command('fix', { hidden: true })
    .description('Applies automated fixes to the package. [EXPERIMENTAL]')
    .option('--deps', 'Only fix monorepo dependencies in package.json')
    .action(lazy(() => import('./fix').then(m => m.command)));

  command
    .command('clean')
    .description('Delete cache directories')
    .action(lazy(() => import('./clean/clean').then(m => m.default)));

  command
    .command('prepack')
    .description('Prepares a package for packaging before publishing')
    .action(lazy(() => import('./pack').then(m => m.pre)));

  command
    .command('postpack')
    .description('Restores the changes made by the prepack command')
    .action(lazy(() => import('./pack').then(m => m.post)));
}

export function registerMigrateCommand(program: Command) {
  const command = program
    .command('migrate [command]')
    .description('Migration utilities');

  command
    .command('package-roles')
    .description(`Add package role field to packages that don't have it`)
    .action(lazy(() => import('./migrate/packageRole').then(m => m.default)));

  command
    .command('package-scripts')
    .description('Set package scripts according to each package role')
    .action(
      lazy(() => import('./migrate/packageScripts').then(m => m.command)),
    );

  command
    .command('package-exports')
    .description('Synchronize package subpath export definitions')
    .action(
      lazy(() => import('./migrate/packageExports').then(m => m.command)),
    );

  command
    .command('package-lint-configs')
    .description(
      'Migrates all packages to use @backstage/cli/config/eslint-factory',
    )
    .action(
      lazy(() => import('./migrate/packageLintConfigs').then(m => m.command)),
    );

  command
    .command('react-router-deps')
    .description(
      'Migrates the react-router dependencies for all packages to be peer dependencies',
    )
    .action(
      lazy(() => import('./migrate/reactRouterDeps').then(m => m.command)),
    );
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
    .option('--no-private', 'Do not mark new packages as private')
    .action(lazy(() => import('./new/new').then(m => m.default)));

  program
    .command('create', { hidden: true })
    .storeOptionsAsProperties(false)
    .description(
      'Open up an interactive guide to creating new things in your app [DEPRECATED]',
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
    .option('--no-private', 'Do not mark new packages as private')
    .action(lazy(() => import('./new/new').then(m => m.default)));

  program
    .command('create-plugin', { hidden: true })
    .option(
      '--backend',
      'Create plugin with the backend dependencies as default',
    )
    .description('Creates a new plugin in the current repository [DEPRECATED]')
    .option('--scope <scope>', 'npm scope')
    .option('--npm-registry <URL>', 'npm registry URL')
    .option('--no-private', 'Public npm package')
    .action(
      lazy(() => import('./create-plugin/createPlugin').then(m => m.default)),
    );

  program
    .command('plugin:diff', { hidden: true })
    .option('--check', 'Fail if changes are required')
    .option('--yes', 'Apply all changes')
    .description(
      'Diff an existing plugin with the creation template [DEPRECATED]',
    )
    .action(lazy(() => import('./plugin/diff').then(m => m.default)));

  // TODO(Rugvip): Deprecate in favor of package variant
  program
    .command('test')
    .allowUnknownOption(true) // Allows the command to run, but we still need to parse raw args
    .helpOption(', --backstage-cli-help') // Let Jest handle help
    .description(
      'Run tests, forwarding args to Jest, defaulting to watch mode [DEPRECATED]',
    )
    .action(lazy(() => import('./test').then(m => m.default)));

  program
    .command('config:docs')
    .option(
      '--package <name>',
      'Only include the schema that applies to the given package',
    )
    .description('Browse the configuration reference documentation')
    .action(lazy(() => import('./config/docs').then(m => m.default)));

  program
    .command('config:print')
    .option(
      '--package <name>',
      'Only load config schema that applies to the given package',
    )
    .option('--lax', 'Do not require environment variables to be set')
    .option('--frontend', 'Print only the frontend configuration')
    .option('--with-secrets', 'Include secrets in the printed configuration')
    .option(
      '--format <format>',
      'Format to print the configuration in, either json or yaml [yaml]',
    )
    .option(...configOption)
    .description('Print the app configuration for the current package')
    .action(lazy(() => import('./config/print').then(m => m.default)));

  program
    .command('config:check')
    .option(
      '--package <name>',
      'Only load config schema that applies to the given package',
    )
    .option('--lax', 'Do not require environment variables to be set')
    .option('--frontend', 'Only validate the frontend configuration')
    .option('--deprecated', 'Output deprecated configuration settings')
    .option(...configOption)
    .description(
      'Validate that the given configuration loads and matches schema',
    )
    .action(lazy(() => import('./config/validate').then(m => m.default)));

  program
    .command('config:schema')
    .option(
      '--package <name>',
      'Only output config schema that applies to the given package',
    )
    .option(
      '--format <format>',
      'Format to print the schema in, either json or yaml [yaml]',
    )
    .description('Print configuration schema')
    .action(lazy(() => import('./config/schema').then(m => m.default)));

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
    .description('Bump Backstage packages to the latest versions')
    .action(lazy(() => import('./versions/bump').then(m => m.default)));

  program
    .command('versions:check')
    .option('--fix', 'Fix any auto-fixable versioning problems')
    .description('Check Backstage package versioning')
    .action(lazy(() => import('./versions/lint').then(m => m.default)));

  // TODO(Rugvip): Deprecate in favor of package variant
  program
    .command('clean')
    .description('Delete cache directories [DEPRECATED]')
    .action(lazy(() => import('./clean/clean').then(m => m.default)));

  program
    .command('build-workspace <workspace-dir> [packages...]')
    .description('Builds a temporary dist workspace from the provided packages')
    .action(lazy(() => import('./buildWorkspace').then(m => m.default)));

  program
    .command('create-github-app <github-org>')
    .description('Create new GitHub App in your organization.')
    .action(lazy(() => import('./create-github-app').then(m => m.default)));

  program
    .command('info')
    .description('Show helpful information for debugging and reporting bugs')
    .action(lazy(() => import('./info').then(m => m.default)));

  program
    .command('install [plugin-id]', { hidden: true })
    .option(
      '--from <packageJsonFilePath>',
      'Install from a local package.json containing the installation recipe',
    )
    .description('Install a Backstage plugin [EXPERIMENTAL]')
    .action(lazy(() => import('./install/install').then(m => m.default)));
}

// Wraps an action function so that it always exits and handles errors
function lazy(
  getActionFunc: () => Promise<(...args: any[]) => Promise<void>>,
): (...args: any[]) => Promise<never> {
  return async (...args: any[]) => {
    try {
      const actionFunc = await getActionFunc();
      await actionFunc(...args);

      process.exit(0);
    } catch (error) {
      assertError(error);
      exitWithError(error);
    }
  };
}
