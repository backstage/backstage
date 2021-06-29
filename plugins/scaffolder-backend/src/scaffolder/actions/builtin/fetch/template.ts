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

import path, { resolve as resolvePath } from 'path';
import { UrlReader } from '@backstage/backend-common';
import { InputError } from '@backstage/errors';
import { ScmIntegrations } from '@backstage/integration';
import { fetchContents } from './helpers';
import { createTemplateAction } from '../../createTemplateAction';
import globby from 'globby';
import nunjucks from 'nunjucks';
import fs from 'fs-extra';

export function createFetchTemplateAction(options: {
  reader: UrlReader;
  integrations: ScmIntegrations;
}) {
  const { reader, integrations } = options;

  return createTemplateAction<{
    url: string;
    targetPath?: string;
    values: any;
  }>({
    id: 'fetch:template',
    description:
      "Downloads a skeleton and will template variables into the skeleton and places the result in the workspace, or optionally in a subdirectory specified by the 'targetPath' input option.",
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
            description: 'Values to pass on to the templating engine',
            type: 'object',
          },
        },
      },
    },
    async handler(ctx) {
      ctx.logger.info('Fetching template content from remote URL');
      const workDir = await ctx.createTemporaryDirectory();
      const templateDir = resolvePath(workDir, 'template');

      // Finally move the template result into the task workspace
      const targetPath = ctx.input.targetPath ?? './';
      const outputPath = path.resolve(ctx.workspacePath, targetPath);
      if (!outputPath.startsWith(ctx.workspacePath)) {
        throw new InputError(
          `Fetch action targetPath may not specify a path outside the working directory`,
        );
      }

      await fetchContents({
        reader,
        integrations,
        baseUrl: ctx.baseUrl,
        fetchUrl: ctx.input.url,
        outputPath: templateDir,
      });

      ctx.logger.info(
        'Fetched template, beginning templating process with values',
        ctx.input.values,
      );

      // Grab some files
      const allFilesInTemplates = await globby(`*`, { cwd: templateDir });

      // Nice for Cookiecutter compat
      nunjucks.installJinjaCompat();

      // Create a templater
      const templater = nunjucks.configure({
        tags: {
          variableStart: '${{',
          variableEnd: '}}',
        },
        autoescape: false,
      });

      // Need to work out how to autoescape but not this
      templater.addFilter('jsonify', s => JSON.stringify(s));

      for (const location of allFilesInTemplates) {
        const filepath = templater.renderString(location, ctx.input.values);
        await fs.writeFile(
          resolvePath(outputPath, filepath),
          templater.renderString(
            await fs.readFile(resolvePath(templateDir, location), 'utf-8'),
            ctx.input.values,
          ),
        );
      }
    },
  });
}
