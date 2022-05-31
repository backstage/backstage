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

import { extname } from 'path';
import { resolveSafeChildPath, UrlReader } from '@backstage/backend-common';
import { InputError } from '@backstage/errors';
import { ScmIntegrations } from '@backstage/integration';
import { fetchContents } from './helpers';
import { createTemplateAction } from '../../createTemplateAction';
import globby from 'globby';
import fs from 'fs-extra';
import { isBinaryFile } from 'isbinaryfile';
import {
  TemplateFilter,
  SecureTemplater,
} from '../../../../lib/templating/SecureTemplater';

/**
 * Downloads a skeleton, templates variables into file and directory names and content.
 * Then places the result in the workspace, or optionally in a subdirectory
 * specified by the 'targetPath' input option.
 *
 * @public
 */
export function createFetchTemplateAction(options: {
  reader: UrlReader;
  integrations: ScmIntegrations;
  additionalTemplateFilters?: Record<string, TemplateFilter>;
}) {
  const { reader, integrations, additionalTemplateFilters } = options;

  return createTemplateAction<{
    url: string;
    targetPath?: string;
    values: any;
    templateFileExtension?: string | boolean;

    // Cookiecutter compat options
    copyWithoutRender?: string[];
    cookiecutterCompat?: boolean;
  }>({
    id: 'fetch:template',
    description:
      "Downloads a skeleton, templates variables into file and directory names and content, and places the result in the workspace, or optionally in a subdirectory specified by the 'targetPath' input option.",
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
          copyWithoutRender: {
            title: 'Copy Without Render',
            description:
              'An array of glob patterns. Any files or directories which match are copied without being processed as templates.',
            type: 'array',
            items: {
              type: 'string',
            },
          },
          cookiecutterCompat: {
            title: 'Cookiecutter compatibility mode',
            description:
              'Enable features to maximise compatibility with templates built for fetch:cookiecutter',
            type: 'boolean',
          },
          templateFileExtension: {
            title: 'Template File Extension',
            description:
              'If set, only files with the given extension will be templated. If set to `true`, the default extension `.njk` is used.',
            type: ['string', 'boolean'],
          },
        },
      },
    },
    supportsDryRun: true,
    async handler(ctx) {
      ctx.logger.info('Fetching template content from remote URL');

      const workDir = await ctx.createTemporaryDirectory();
      const templateDir = resolveSafeChildPath(workDir, 'template');

      const targetPath = ctx.input.targetPath ?? './';
      const outputDir = resolveSafeChildPath(ctx.workspacePath, targetPath);

      if (
        ctx.input.copyWithoutRender &&
        !Array.isArray(ctx.input.copyWithoutRender)
      ) {
        throw new InputError(
          'Fetch action input copyWithoutRender must be an Array',
        );
      }

      if (
        ctx.input.templateFileExtension &&
        (ctx.input.copyWithoutRender || ctx.input.cookiecutterCompat)
      ) {
        throw new InputError(
          'Fetch action input extension incompatible with copyWithoutRender and cookiecutterCompat',
        );
      }

      let extension: string | false = false;
      if (ctx.input.templateFileExtension) {
        extension =
          ctx.input.templateFileExtension === true
            ? '.njk'
            : ctx.input.templateFileExtension;
        if (!extension.startsWith('.')) {
          extension = `.${extension}`;
        }
      }

      await fetchContents({
        reader,
        integrations,
        baseUrl: ctx.templateInfo?.baseUrl,
        fetchUrl: ctx.input.url,
        outputPath: templateDir,
      });

      ctx.logger.info('Listing files and directories in template');
      const allEntriesInTemplate = await globby(`**/*`, {
        cwd: templateDir,
        dot: true,
        onlyFiles: false,
        markDirectories: true,
        followSymbolicLinks: false,
      });

      const nonTemplatedEntries = new Set(
        (
          await Promise.all(
            (ctx.input.copyWithoutRender || []).map(pattern =>
              globby(pattern, {
                cwd: templateDir,
                dot: true,
                onlyFiles: false,
                markDirectories: true,
                followSymbolicLinks: false,
              }),
            ),
          )
        ).flat(),
      );

      // Cookiecutter prefixes all parameters in templates with
      // `cookiecutter.`. To replicate this, we wrap our parameters
      // in an object with a `cookiecutter` property when compat
      // mode is enabled.
      const { cookiecutterCompat, values } = ctx.input;
      const context = {
        [cookiecutterCompat ? 'cookiecutter' : 'values']: values,
      };

      ctx.logger.info(
        `Processing ${allEntriesInTemplate.length} template files/directories with input values`,
        ctx.input.values,
      );

      const renderTemplate = await SecureTemplater.loadRenderer({
        cookiecutterCompat: ctx.input.cookiecutterCompat,
        additionalTemplateFilters,
      });

      for (const location of allEntriesInTemplate) {
        let renderFilename: boolean;
        let renderContents: boolean;

        let localOutputPath = location;
        if (extension) {
          renderFilename = true;
          renderContents = extname(localOutputPath) === extension;
          if (renderContents) {
            localOutputPath = localOutputPath.slice(0, -extension.length);
          }
        } else {
          renderFilename = renderContents = !nonTemplatedEntries.has(location);
        }
        if (renderFilename) {
          localOutputPath = renderTemplate(localOutputPath, context);
        }
        const outputPath = resolveSafeChildPath(outputDir, localOutputPath);
        // variables have been expanded to make an empty file name
        // this is due to a conditional like if values.my_condition then file-name.txt else empty string so skip
        if (outputDir === outputPath) {
          continue;
        }

        if (!renderContents && !extension) {
          ctx.logger.info(
            `Copying file/directory ${location} without processing.`,
          );
        }

        if (location.endsWith('/')) {
          ctx.logger.info(
            `Writing directory ${location} to template output path.`,
          );
          await fs.ensureDir(outputPath);
        } else {
          const inputFilePath = resolveSafeChildPath(templateDir, location);

          if (await isBinaryFile(inputFilePath)) {
            ctx.logger.info(
              `Copying binary file ${location} to template output path.`,
            );
            await fs.copy(inputFilePath, outputPath);
          } else {
            const statsObj = await fs.stat(inputFilePath);
            ctx.logger.info(
              `Writing file ${location} to template output path with mode ${statsObj.mode}.`,
            );
            const inputFileContents = await fs.readFile(inputFilePath, 'utf-8');
            await fs.outputFile(
              outputPath,
              renderContents
                ? renderTemplate(inputFileContents, context)
                : inputFileContents,
              { mode: statsObj.mode },
            );
          }
        }
      }

      ctx.logger.info(`Template result written to ${outputDir}`);
    },
  });
}
