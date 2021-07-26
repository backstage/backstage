/*
 * Copyright 2021 Spotify AB
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either expressed or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { ContainerRunner, UrlReader } from '@backstage/backend-common';
import { JsonObject } from '@backstage/config';
import { InputError } from '@backstage/errors';
import { ScmIntegrations } from '@backstage/integration';
import fs from 'fs-extra';
import {
  createTemplateAction,
  fetchContents,
} from '@backstage/plugin-scaffolder-backend';

import { resolve as resolvePath } from 'path';
import { RailsNewRunner } from './railsNewRunner';

export function createFetchRailsAction(options: {
  reader: UrlReader;
  integrations: ScmIntegrations;
  containerRunner: ContainerRunner;
}) {
  const { reader, integrations, containerRunner } = options;

  return createTemplateAction<{
    url: string;
    targetPath?: string;
    values: JsonObject;
    imageName?: string;
  }>({
    id: 'fetch:rails',
    description:
      'Downloads a template from the given URL into the workspace, and runs a rails new generator on it.',
    schema: {
      input: {
        type: 'object',
        required: ['url'],
        properties: {
          url: {
            title: 'Fetch URL',
            description:
              'Relative path or absolute URL pointing to the directory tree to fetch',
            type: 'string',
          },
          targetPath: {
            title: 'Target Path',
            description:
              'Target path within the working directory to download the contents to.',
            type: 'string',
          },
          values: {
            title: 'Template Values',
            description: 'Values to pass on to rails for templating',
            type: 'object',
            properties: {
              railsArguments: {
                title: 'Arguments to pass to new command',
                description:
                  'You can provide some arguments to create a custom app',
                type: 'object',
                properties: {
                  minimal: {
                    title: 'minimal',
                    description: 'Preconfigure a minimal rails app',
                    type: 'boolean',
                  },
                  skipBundle: {
                    title: 'skipBundle',
                    description: "Don't run bundle install",
                    type: 'boolean',
                  },
                  skipWebpackInstall: {
                    title: 'skipWebpackInstall',
                    description: "Don't run Webpack install",
                    type: 'boolean',
                  },
                  api: {
                    title: 'api',
                    description: 'Preconfigure smaller stack for API only apps',
                    type: 'boolean',
                  },
                  template: {
                    title: 'template',
                    description:
                      'Path to some application template (can be a filesystem path or URL)',
                    type: 'string',
                  },
                  webpacker: {
                    title: 'webpacker',
                    description:
                      'Preconfigure Webpack with a particular framework (options: react, vue, angular, elm, stimulus)',
                    type: 'string',
                    enum: ['react', 'vue', 'angular', 'elm', 'stimulus'],
                  },
                  database: {
                    title: 'database',
                    description:
                      'Preconfigure for selected database (options: mysql/postgresql/sqlite3/oracle/sqlserver/jdbcmysql/jdbcsqlite3/jdbcpostgresql/jdbc)',
                    type: 'string',
                    enum: [
                      'mysql',
                      'postgresql',
                      'sqlite3',
                      'oracle',
                      'sqlserver',
                      'jdbcmysql',
                      'jdbcsqlite3',
                      'jdbcpostgresql',
                      'jdbc',
                    ],
                  },
                  railsVersion: {
                    title: 'Rails version in Gemfile',
                    description:
                      'Set up the application with Gemfile pointing to a specific version (options: fromImage, dev, edge, master)',
                    type: 'string',
                    enum: ['dev', 'edge', 'master', 'fromImage'],
                  },
                },
              },
            },
          },
          imageName: {
            title: 'Rails Docker image',
            description:
              'Specify a Docker image to run rails new. Used only when a local rails is not found.',
            type: 'string',
          },
        },
      },
    },
    async handler(ctx) {
      ctx.logger.info('Fetching and then templating using rails');

      const workDir = await ctx.createTemporaryDirectory();
      const resultDir = resolvePath(workDir, 'result');

      await fetchContents({
        reader,
        integrations,
        baseUrl: ctx.baseUrl,
        fetchUrl: ctx.input.url,
        outputPath: workDir,
      });

      const templateRunner = new RailsNewRunner({ containerRunner });

      const values = {
        ...ctx.input.values,
        imageName: ctx.input.imageName,
      };

      // Will execute the template in ./template and put the result in ./result
      await templateRunner.run({
        workspacePath: workDir,
        logStream: ctx.logStream,
        values,
      });

      // Finally move the template result into the task workspace
      const targetPath = ctx.input.targetPath ?? './';
      const outputPath = resolvePath(ctx.workspacePath, targetPath);
      if (!outputPath.startsWith(ctx.workspacePath)) {
        throw new InputError(
          `Fetch action targetPath may not specify a path outside the working directory`,
        );
      }
      await fs.copy(resultDir, outputPath);
    },
  });
}
