/*
 * Copyright 2022 The Backstage Authors
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

function registerPackageCommand(program: Command) {
  const command = program
    .command('package [command]')
    .description('Various tools for working with specific packages.');

  const schemaCommand = command
    .command('schema [command]')
    .description(
      "Various tools for working with specific packages' API schema",
    );

  const openApiCommand = schemaCommand
    .command('openapi [command]')
    .description('Tooling for OpenAPI schema');

  openApiCommand
    .command('init')
    .description(
      'Initialize any required files to use the OpenAPI tooling for this package.',
    )
    .action(
      lazy(() => import('./package/schema/openapi/init'), 'singleCommand'),
    );

  openApiCommand
    .command('generate')
    .option(
      '--client-package [package]',
      'Top-level path to where the client should be generated, ie packages/catalog-client.',
    )
    .option('--server')
    .description(
      'Command to generate a client and/or a server stub from an OpenAPI spec.',
    )
    .option('--client-additional-properties [properties]')
    .description(
      'Additional properties that can be passed to @openapitools/openapi-generator-cli',
    )
    .option('--watch')
    .description('Watch the OpenAPI spec for changes and regenerate on save.')
    .action(lazy(() => import('./package/schema/openapi/generate'), 'command'));

  openApiCommand
    .command('fuzz')
    .description(
      'Fuzz an OpenAPI schema by generating random data and sending it to the server.',
    )
    .option('--limit <limit>', 'Maximum number of requests to send.')
    .option('--workers <workers>', 'Number of workers to use', '2')
    .option(
      '--debug',
      `Enable debug mode, which will save cassettes to '.cassettes/{pluginId}.yml'`,
    )
    .option(
      '--exclude-checks <excludeChecks>',
      'Exclude checks from schemathesis run',
    )
    .action(lazy(() => import('./package/schema/openapi/fuzz'), 'command'));

  openApiCommand
    .command('diff')
    .option('--ignore', 'Ignore linting failures and only log the results.')
    .option('--json', 'Output the results as JSON')
    .option('--since <ref>', 'Diff the API against a specific ref')
    .action(lazy(() => import('./package/schema/openapi/diff'), 'command'));
}

function registerRepoCommand(program: Command) {
  const command = program
    .command('repo [command]')
    .description('Tools for working across your entire repository.');

  const schemaCommand = command
    .command('schema [command]')
    .description('Various tools for working with API schema');

  const openApiCommand = schemaCommand
    .command('openapi [command]')
    .description('Tooling for OpenApi schema');

  openApiCommand
    .command('verify [paths...]')
    .description(
      'Verify that all OpenAPI schemas are valid and set up correctly.',
    )
    .action(lazy(() => import('./repo/schema/openapi/verify'), 'bulkCommand'));

  openApiCommand
    .command('lint [paths...]')
    .description('Lint OpenAPI schemas.')
    .option(
      '--strict',
      'Fail on any linting severity messages, not just errors.',
    )
    .action(lazy(() => import('./repo/schema/openapi/lint'), 'bulkCommand'));

  openApiCommand
    .command('test [paths...]')
    .description('Test OpenAPI schemas against written tests')
    .option('--update', 'Update the spec on failure.')
    .action(lazy(() => import('./repo/schema/openapi/test'), 'bulkCommand'));

  openApiCommand
    .command('fuzz')
    .description('Fuzz all packages')
    .option(
      '--since <ref>',
      'Only fuzz packages that have changed since the given ref',
    )
    .action(lazy(() => import('./repo/schema/openapi/fuzz'), 'command'));

  openApiCommand
    .command('diff')
    .description(
      'Diff the repository against a specific ref, will run all package `diff` scripts.',
    )
    .option(
      '--since <ref>',
      'Diff the API against a specific ref',
      'origin/master',
    )
    .action(lazy(() => import('./repo/schema/openapi/diff'), 'command'));
}

function registerLintCommand(program: Command) {
  const lintCommand = program
    .command('lint [command]')
    .description('Tools for linting repository.');
  lintCommand
    .command('legacy-backend-exports [paths...]')
    .description(
      'Lint backend plugin packages for legacy exports and make sure it conforms to the new export pattern',
    )
    .action(
      lazy(
        () =>
          import('./lint-legacy-backend-exports/lint-legacy-backend-exports'),
        'lint',
      ),
    );
}
export function registerCommands(program: Command) {
  program
    .command('api-reports [paths...]')
    .option('--ci', 'CI run checks that there is no changes on API reports')
    .option('--tsc', 'executes the tsc compilation before extracting the APIs')
    .option('--docs', 'generates the api documentation')
    .option('--sql-reports', 'Also generate SQL reports from migration files')
    .option(
      '--include <pattern>',
      'Only include packages matching the provided patterns',
      (opt: string, opts: string[] = []) => [...opts, ...opt.split(',')],
    )
    .option(
      '--exclude <pattern>',
      'Exclude package matching the provided patterns',
      (opt: string, opts: string[] = []) => [...opts, ...opt.split(',')],
    )
    .option(
      '-a, --allow-warnings <allowWarningsPaths>',
      'continue processing packages after getting errors on selected packages Allows glob patterns and comma separated values (i.e. packages/core,plugins/core-*)',
    )
    .option(
      '--allow-all-warnings',
      'continue processing packages after getting errors on all packages',
      false,
    )
    .option(
      '-o, --omit-messages <messageCodes>',
      'select some message code to be omited on the API Extractor (comma separated values i.e ae-cyclic-inherit-doc,ae-missing-getter )',
    )
    .option(
      '--validate-release-tags',
      'Turn on release tag validation for the public, beta, and alpha APIs',
    )
    .description('Generate an API report for selected packages')
    .action(lazy(() => import('./api-reports'), 'buildApiReports'));

  program
    .command('type-deps')
    .description('Find inconsistencies in types of all packages and plugins')
    .action(lazy(() => import('./type-deps/type-deps'), 'default'));

  program
    .command('peer-deps')
    .description(
      'Ensure your packages are using the correct peer dependency format.',
    )
    .option('--fix', 'Fix the issues found')
    .action(lazy(() => import('./peer-deps/peer-deps'), 'default'));

  program
    .command('generate-catalog-info')
    .option(
      '--dry-run',
      'Shows what would happen without actually writing any yaml.',
    )
    .option(
      '--ci',
      'CI run checks that there are no changes to catalog-info.yaml files',
    )
    .description('Create or fix info yaml files for all backstage packages')
    .action(
      lazy(
        () => import('./generate-catalog-info/generate-catalog-info'),
        'default',
      ),
    );

  program
    .command('generate-patch <package>')
    .requiredOption(
      '--target <target-repo>',
      'The target repository to generate patches for',
    )
    .option(
      '--registry-url <registry-url>',
      'The registry to use for downloading artifacts (default: https://registry.npmjs.org)',
    )
    .option(
      '--base-version <version>',
      'Override the base version to generate the patch towards instead',
    )
    .option(
      '--query <query>',
      'Only apply the patch for a specific version query in the target repository',
    )
    .option(
      '--skip-install',
      'Skip dependency installation in the target repository after applying the patch',
    )
    .description(
      'Generate a patch for the selected package in the target repository',
    )
    .action(lazy(() => import('./generate-patch/generate-patch'), 'default'));

  program
    .command('knip-reports [paths...]')
    .option('--ci', 'CI run checks that there is no changes on knip reports')
    .description('Generate a knip report for selected packages')
    .action(
      lazy(() => import('./knip-reports/knip-reports'), 'buildKnipReports'),
    );

  program
    .command('package-docs [paths...]', { hidden: true })
    .description('EXPERIMENTAL: Generate package documentation')
    .action(lazy(() => import('./package-docs/command'), 'default'));

  registerPackageCommand(program);
  registerRepoCommand(program);
  registerLintCommand(program);
}

type ActionFunc = (...args: any[]) => Promise<void>;
type ActionExports<TModule extends object> = {
  [KName in keyof TModule as TModule[KName] extends ActionFunc
    ? KName
    : never]: TModule[KName];
};

// Wraps an action function so that it always exits and handles errors
export function lazy<TModule extends object>(
  moduleLoader: () => Promise<TModule>,
  exportName: keyof ActionExports<TModule>,
): (...args: any[]) => Promise<never> {
  return async (...args: any[]) => {
    try {
      const mod = await moduleLoader();
      const actualModule = (
        mod as unknown as { default: ActionExports<TModule> }
      ).default;
      const actionFunc = actualModule[exportName] as ActionFunc;
      await actionFunc(...args);

      process.exit(0);
    } catch (error) {
      assertError(error);
      exitWithError(error);
    }
  };
}
