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
import { ContainerRunner } from './ContainerRunner';

export { type ContainerRunner };

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

  return createTemplateAction({
    id: 'fetch:rails',
    description:
      'Downloads a template from the given `url` into the workspace, and runs a rails new generator on it.',
    examples,
    schema: {
      input: {
        url: z =>
          z.string({
            description:
              'Relative path or absolute URL pointing to the directory tree to fetch',
          }),
        targetPath: z =>
          z
            .string({
              description:
                'Target path within the working directory to download the contents to.',
            })
            .optional(),
        values: z =>
          z.object({
            railsArguments: z
              .object({
                minimal: z
                  .boolean({
                    description: 'Preconfigure a minimal rails app',
                  })
                  .optional(),
                skipBundle: z
                  .boolean({
                    description: "Don't run bundle install",
                  })
                  .optional(),
                skipWebpackInstall: z
                  .boolean({
                    description: "Don't run Webpack install",
                  })
                  .optional(),
                skipTest: z
                  .boolean({
                    description: 'Skip test files',
                  })
                  .optional(),
                skipActionCable: z
                  .boolean({
                    description: 'Skip Action Cable files',
                  })
                  .optional(),
                skipActionMailer: z
                  .boolean({
                    description: 'Skip Action Mailer files',
                  })
                  .optional(),
                skipActionMailbox: z
                  .boolean({
                    description: 'Skip Action Mailbox gem',
                  })
                  .optional(),
                skipActiveStorage: z
                  .boolean({
                    description: 'Skip Active Storage files',
                  })
                  .optional(),
                skipActionText: z
                  .boolean({
                    description: 'Skip Action Text gem',
                  })
                  .optional(),
                skipActiveRecord: z
                  .boolean({
                    description: 'Skip Active Record files',
                  })
                  .optional(),
                force: z
                  .boolean({
                    description: 'Overwrite files that already exist',
                  })
                  .optional(),
                api: z
                  .boolean({
                    description: 'Preconfigure smaller stack for API only apps',
                  })
                  .optional(),
                template: z
                  .string({
                    description:
                      'Path to some application template (can be a filesystem path or URL)',
                  })
                  .optional(),
                webpacker: z
                  .enum(['react', 'vue', 'angular', 'elm', 'stimulus'], {
                    description:
                      'Preconfigure Webpack with a particular framework (options: react, vue, angular, elm, stimulus)',
                  })
                  .optional(),
                database: z
                  .enum(
                    [
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
                    {
                      description:
                        'Preconfigure for selected database (options: mysql/postgresql/sqlite3/oracle/sqlserver/jdbcmysql/jdbcsqlite3/jdbcpostgresql/jdbc)',
                    },
                  )
                  .optional(),
                railsVersion: z
                  .enum(['dev', 'edge', 'master', 'fromImage'], {
                    description:
                      'Set up the application with Gemfile pointing to a specific version (options: fromImage, dev, edge, master)',
                  })
                  .optional(),
              })
              .optional(),
          }),
        imageName: z =>
          z
            .string({
              description:
                'Specify a Docker image to run rails new. Used only when a local rails is not found.',
            })
            .optional(),
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
