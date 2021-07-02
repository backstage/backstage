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
              'Target path within the working directory to download the contents to. Defaults to the working directory root.',
            type: 'string',
          },
          values: {
            title: 'Template Values',
            description: 'Values to pass on to the templating engine',
            type: 'object',
          },
          // TODO(mtlewis/orkohunter): add copyWithoutRender support
          //
          // TODO(mtlewis/orkohunter): do we need to replicate the template extensions support
          // from fetch:cookiecutter?
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

      // at this point the templateDir contains the unprocessed contents of the skeleton directory

      ctx.logger.info(
        'Fetched template, beginning templating process with values',
        ctx.input.values,
      );

      // Grab some files
      //
      // TODO(mtlewis/orkohunter) test whether empty directories are templated
      const allFilesInTemplates = await globby(`**/*`, {
        cwd: templateDir,
        dot: true,
      });

      // Nice for Cookiecutter compat
      //
      // TODO(mtlewis/orkohunter): parameterize all jinja2/cookiecutter compat
      nunjucks.installJinjaCompat();

      // Create a templater
      const templater = nunjucks.configure({
        // TODO(mtlewis/orkohunter): Document Why we are changing the literals? Not here, but on scaffolder docs. ADR?
        tags: {
          variableStart: '${{',
          variableEnd: '}}',
        },
        // We don't want this builtin auto-escaping since it is escaping as HTML which will often be incorrect e.g. adds things like &quot;
        autoescape: false,
      });

      // TODO(mtlewis/orkohunter) Evaluate whether this behavior is still appropriate when using nunjucks.
      // As of now jsonify seems to be the most reliable way to do escaping,
      // but is there a builtin filter to do this inside nunjucks
      // (other than `autoescape` inside `configure` which escapes strings as HTML, which isn't right.).
      templater.addFilter('jsonify', s => JSON.stringify(s));

      for (const location of allFilesInTemplates) {
        // handle variables in filenames
        const filepath = templater.renderString(location, ctx.input.values);

        // write file
        await fs.outputFile(
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
