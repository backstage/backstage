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
    .description('Initialize any required files to use the OpenAPI tooling.')
    .action(
      lazy(() => import('./package/schema/openapi/init').then(m => m.default)),
    );

  const generateCommand = openApiCommand
    .command('generate [command]')
    .description(
      'Commands for generating various things from an OpenAPI spec.',
    );

  generateCommand
    .command('server')
    .description(
      'Generates an express server stub using the OpenAPI schema for typings.',
    )
    .action(
      lazy(() =>
        import('./package/schema/openapi/generate/server').then(m => m.command),
      ),
    );

  generateCommand
    .command('client')
    .description(
      'Generates a client that can interact with your backend plugin using types from your OpenAPI schema.',
    )
    .requiredOption(
      '--output-package <pathToPackage>',
      'Top-level path to where the client should be generated, ie packages/catalog-client.',
    )
    .action(
      lazy(() =>
        import('./package/schema/openapi/generate/client').then(m => m.command),
      ),
    );
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
      'Verify that all OpenAPI schemas are valid and have a matching `schemas/openapi.generated.ts` file.',
    )
    .action(
      lazy(() =>
        import('./repo/schema/openapi/verify').then(m => m.bulkCommand),
      ),
    );

  openApiCommand
    .command('lint [paths...]')
    .description('Lint OpenAPI schemas.')
    .option(
      '--strict',
      'Fail on any linting severity messages, not just errors.',
    )
    .action(
      lazy(() => import('./repo/schema/openapi/lint').then(m => m.bulkCommand)),
    );

  openApiCommand
    .command('test [paths...]')
    .description('Test OpenAPI schemas against written tests')
    .option('--update', 'Update the spec on failure.')
    .action(
      lazy(() => import('./repo/schema/openapi/test').then(m => m.bulkCommand)),
    );
}

export function registerCommands(program: Command) {
  program
    .command('api-reports [paths...]')
    .option('--ci', 'CI run checks that there is no changes on API reports')
    .option('--tsc', 'executes the tsc compilation before extracting the APIs')
    .option('--docs', 'generates the api documentation')
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
    .action(
      lazy(() =>
        import('./api-reports/api-reports').then(m => m.buildApiReports),
      ),
    );

  program
    .command('type-deps')
    .description('Find inconsistencies in types of all packages and plugins')
    .action(lazy(() => import('./type-deps/type-deps').then(m => m.default)));

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
      lazy(() =>
        import('./generate-catalog-info/generate-catalog-info').then(
          m => m.default,
        ),
      ),
    );
  registerPackageCommand(program);
  registerRepoCommand(program);
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
