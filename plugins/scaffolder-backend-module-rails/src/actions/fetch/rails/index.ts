/*
 * Copyright 2021 The Backstage Authors
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

import { ContainerRunner } from '@backstage/backend-common';
import { JsonObject } from '@backstage/types';
import { InputError } from '@backstage/errors';
import { ScmIntegrations } from '@backstage/integration';
import fs from 'fs-extra';
import {
  createTemplateAction,
  fetchContents,
} from '@backstage/plugin-scaffolder-node';

import { resolve as resolvePath } from 'path';
import { RailsNewRunner } from './railsNewRunner';
import { PassThrough } from 'stream';
import { examples } from './index.examples';
import { UrlReaderService } from '@backstage/backend-plugin-api';

/**
 * Creates the `fetch:rails` Scaffolder action.
 *
 * @remarks
 *
 * See {@link https://guides.rubyonrails.org/rails_application_templates.html} and {@link https://backstage.io/docs/features/software-templates/writing-custom-actions}.
 *
 * @param options - Configuration of the templater.
 * @public
 */
export function createFetchRailsAction(options: {
  reader: UrlReaderService;
  integrations: ScmIntegrations;
  containerRunner?: ContainerRunner;
  /** A list of image names that are allowed to be passed as imageName input */
  allowedImageNames?: string[];
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
      'Downloads a template from the given `url` into the workspace, and runs a rails new generator on it.',
    examples,
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
                  skipTest: {
                    title: 'skipTest',
                    description: 'Skip test files',
                    type: 'boolean',
                  },
                  skipActionCable: {
                    title: 'skipActionCable',
                    description: 'Skip Action Cable files',
                    type: 'boolean',
                  },
                  skipActionMailer: {
                    title: 'skipActionMailer',
                    description: 'Skip Action Mailer files',
                    type: 'boolean',
                  },
                  skipActionMailbox: {
                    title: 'skipActionMailbox',
                    description: 'Skip Action Mailbox gem',
                    type: 'boolean',
                  },
                  skipActiveStorage: {
                    title: 'skipActiveStorage',
                    description: 'Skip Active Storage files',
                    type: 'boolean',
                  },
                  skipActionText: {
                    title: 'skipActionText',
                    description: 'Skip Action Text gem',
                    type: 'boolean',
                  },
                  skipActiveRecord: {
                    title: 'skipActiveRecord',
                    description: 'Skip Active Record files',
                    type: 'boolean',
                  },

                  force: {
                    title: 'force',
                    description: 'Overwrite files that already exist',
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
        baseUrl: ctx.templateInfo?.baseUrl,
        fetchUrl: ctx.input.url,
        outputPath: workDir,
      });

      const templateRunner = new RailsNewRunner({ containerRunner });

      const { imageName } = ctx.input;
      if (imageName && !options.allowedImageNames?.includes(imageName)) {
        throw new Error(`Image ${imageName} is not allowed`);
      }

      const logStream = new PassThrough();
      logStream.on('data', chunk => {
        ctx.logger.info(chunk.toString());
      });

      // Will execute the template in ./template and put the result in ./result
      await templateRunner.run({
        workspacePath: workDir,
        logStream,
        values: { ...ctx.input.values, imageName },
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
