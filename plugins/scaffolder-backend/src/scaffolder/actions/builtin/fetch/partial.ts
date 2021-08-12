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

import { resolve as resolvePath } from 'path';
import { resolveSafeChildPath, UrlReader } from '@backstage/backend-common';
import { ScmIntegrations } from '@backstage/integration';
import { fetchContents } from './helpers';
import { createTemplateAction } from '../../createTemplateAction';
import globby from 'globby';
import nunjucks from 'nunjucks';
import fs from 'fs-extra';
import { isBinaryFile } from 'isbinaryfile';

/*
 * Maximise compatibility with Jinja (and therefore fetch:template)
 * using nunjucks jinja compat mode. Since this method mutates
 * the global nunjucks instance, we can't enable this per-template,
 * so the next best option is to explicitly enable it globally and allow
 * folks to rely on jinja compatibility behaviour in fetch:template
 * templates if they wish.
 *
 * cf. https://mozilla.github.io/nunjucks/api.html#installjinjacompat
 */
nunjucks.installJinjaCompat();

export type FetchPartialInput = {
  url: string;
  targetPath?: string;
  values: any;
  extension?: string;
};

export function createFetchPartialAction(options: {
  reader: UrlReader;
  integrations: ScmIntegrations;
}) {
  const { reader, integrations } = options;

  return createTemplateAction<FetchPartialInput>({
    id: 'fetch:partial',
    description:
      "Downloads a skeleton, templates variables into file and directory names and content that end with the specified extension, and places the result in the workspace, or optionally in a subdirectory specified by the 'targetPath' input option.",
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
          extension: {
            title: 'Extension to Process (.njk)',
            description: 'Extension to use for template.',
            type: 'string',
          },
        },
      },
    },
    async handler(ctx) {
      ctx.logger.info('Fetching template content from remote URL');

      const workDir = await ctx.createTemporaryDirectory();
      const templateDir = resolvePath(workDir, 'template');

      const targetPath = ctx.input.targetPath ?? './';
      const extension = ctx.input.extension ?? '.njk';
      const outputDir = resolveSafeChildPath(ctx.workspacePath, targetPath);

      await fetchContents({
        reader,
        integrations,
        baseUrl: ctx.baseUrl,
        fetchUrl: ctx.input.url,
        outputPath: templateDir,
      });

      ctx.logger.info('Listing files and directories in template');
      const allEntriesInTemplate = await globby(`**/*`, {
        cwd: templateDir,
        dot: true,
        onlyFiles: false,
        markDirectories: true,
      });

      // Create a templater
      const templater = nunjucks.configure({
        tags: {
          // TODO(mtlewis/orkohunter): Document Why we are changing the literals? Not here, but on scaffolder docs. ADR?
          variableStart: '${{',
          variableEnd: '}}',
        },
        // We don't want this builtin auto-escaping, since uses HTML escape sequences
        // like `&quot;` - the correct way to escape strings in our case depends on
        // the file type.
        autoescape: false,
      });

      const { values } = ctx.input;
      const context = {
        values,
      };

      ctx.logger.info(
        `Processing ${allEntriesInTemplate.length} template files/directories with input values`,
        ctx.input.values,
      );

      for (const location of allEntriesInTemplate) {
        let outputPath = resolvePath(
          outputDir,
          templater.renderString(location, context),
        );
        if (outputPath.endsWith(extension)) {
          outputPath = outputPath.slice(0, -extension.length);
        }

        if (location.endsWith('/')) {
          ctx.logger.info(
            `Writing directory ${location} to template output path.`,
          );
          await fs.ensureDir(outputPath);
        } else {
          const inputFilePath = resolvePath(templateDir, location);

          if (
            !location.endsWith(extension) ||
            (await isBinaryFile(inputFilePath))
          ) {
            ctx.logger.info(
              `Copying file ${location} to template output path.`,
            );
            await fs.copy(inputFilePath, outputPath);
          } else {
            ctx.logger.info(
              `Writing file ${location} to template output path.`,
            );
            const inputFileContents = await fs.readFile(inputFilePath, 'utf-8');
            await fs.outputFile(
              outputPath,
              templater.renderString(inputFileContents, context),
            );
          }
        }
      }

      ctx.logger.info(`Template result written to ${outputDir}`);
    },
  });
}
