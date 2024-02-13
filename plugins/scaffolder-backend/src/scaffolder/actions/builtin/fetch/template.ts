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
import {
  createTemplateAction,
  fetchContents,
} from '@backstage/plugin-scaffolder-node';
import globby from 'globby';
import fs from 'fs-extra';
import { isBinaryFile } from 'isbinaryfile';
import {
  TemplateFilter,
  SecureTemplater,
  TemplateGlobal,
} from '../../../../lib/templating/SecureTemplater';
import { createDefaultFilters } from '../../../../lib/templating/filters';
import { examples } from './template.examples';

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
  additionalTemplateGlobals?: Record<string, TemplateGlobal>;
}) {
  const {
    reader,
    integrations,
    additionalTemplateFilters,
    additionalTemplateGlobals,
  } = options;

  const defaultTemplateFilters = createDefaultFilters({ integrations });

  return createTemplateAction<{
    url: string;
    targetPath?: string;
    values: any;
    templateFileExtension?: string | boolean;

    // Cookiecutter compat options
    /**
     * @deprecated This field is deprecated in favor of copyWithoutTemplating.
     */
    copyWithoutRender?: string[];
    copyWithoutTemplating?: string[];
    cookiecutterCompat?: boolean;
    replace?: boolean;
    trimBlocks?: boolean;
    lstripBlocks?: boolean;
    token?: string;
  }>({
    id: 'fetch:template',
    description:
      'Downloads a skeleton, templates variables into file and directory names and content, and places the result in the workspace, or optionally in a subdirectory specified by the `targetPath` input option.',
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
              'Target path within the working directory to download the contents to. Defaults to the working directory root.',
            type: 'string',
          },
          values: {
            title: 'Template Values',
            description: 'Values to pass on to the templating engine',
            type: 'object',
          },
          copyWithoutRender: {
            title: '[Deprecated] Copy Without Render',
            description:
              'An array of glob patterns. Any files or directories which match are copied without being processed as templates.',
            type: 'array',
            items: {
              type: 'string',
            },
          },
          copyWithoutTemplating: {
            title: 'Copy Without Templating',
            description:
              'An array of glob patterns. Contents of matched files or directories are copied without being processed, but paths are subject to rendering.',
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
          replace: {
            title: 'Replace files',
            description:
              'If set, replace files in targetPath instead of skipping existing ones.',
            type: 'boolean',
          },
          token: {
            title: 'Token',
            description:
              'An optional token to use for authentication when reading the resources.',
            type: 'string',
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
      if (ctx.input.copyWithoutRender && ctx.input.copyWithoutTemplating) {
        throw new InputError(
          'Fetch action input copyWithoutRender and copyWithoutTemplating can not be used at the same time',
        );
      }

      let copyOnlyPatterns: string[] | undefined;
      let renderFilename: boolean;
      if (ctx.input.copyWithoutRender) {
        ctx.logger.warn(
          '[Deprecated] copyWithoutRender is deprecated Please use copyWithoutTemplating instead.',
        );
        copyOnlyPatterns = ctx.input.copyWithoutRender;
        renderFilename = false;
      } else {
        copyOnlyPatterns = ctx.input.copyWithoutTemplating;
        renderFilename = true;
      }

      if (copyOnlyPatterns && !Array.isArray(copyOnlyPatterns)) {
        throw new InputError(
          'Fetch action input copyWithoutRender/copyWithoutTemplating must be an Array',
        );
      }

      if (
        ctx.input.templateFileExtension &&
        (copyOnlyPatterns || ctx.input.cookiecutterCompat)
      ) {
        throw new InputError(
          'Fetch action input extension incompatible with copyWithoutRender/copyWithoutTemplating and cookiecutterCompat',
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
        token: ctx.input.token,
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
        await globby(copyOnlyPatterns || [], {
          cwd: templateDir,
          dot: true,
          onlyFiles: false,
          markDirectories: true,
          followSymbolicLinks: false,
        }),
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
        templateFilters: {
          ...defaultTemplateFilters,
          ...additionalTemplateFilters,
        },
        templateGlobals: additionalTemplateGlobals,
        nunjucksConfigs: {
          trimBlocks: ctx.input.trimBlocks,
          lstripBlocks: ctx.input.lstripBlocks,
        },
      });

      for (const location of allEntriesInTemplate) {
        let renderContents: boolean;

        let localOutputPath = location;
        if (extension) {
          renderContents = extname(localOutputPath) === extension;
          if (renderContents) {
            localOutputPath = localOutputPath.slice(0, -extension.length);
          }
          // extension is mutual exclusive with copyWithoutRender/copyWithoutTemplating,
          // therefore the output path is always rendered.
          localOutputPath = renderTemplate(localOutputPath, context);
        } else {
          renderContents = !nonTemplatedEntries.has(location);
          // The logic here is a bit tangled because it depends on two variables.
          // If renderFilename is true, which means copyWithoutTemplating is used,
          // then the path is always rendered.
          // If renderFilename is false, which means copyWithoutRender is used,
          // then matched file/directory won't be processed, same as before.
          if (renderFilename) {
            localOutputPath = renderTemplate(localOutputPath, context);
          } else {
            localOutputPath = renderContents
              ? renderTemplate(localOutputPath, context)
              : localOutputPath;
          }
        }

        if (containsSkippedContent(localOutputPath)) {
          continue;
        }

        const outputPath = resolveSafeChildPath(outputDir, localOutputPath);
        if (fs.existsSync(outputPath) && !ctx.input.replace) {
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
          const stats = await fs.promises.lstat(inputFilePath);

          if (stats.isSymbolicLink() || (await isBinaryFile(inputFilePath))) {
            ctx.logger.info(
              `Copying file binary or symbolic link at ${location}, to template output path.`,
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

function containsSkippedContent(localOutputPath: string): boolean {
  // if the path is empty means that there is a file skipped in the root
  // if the path starts with a separator it means that the root directory has been skipped
  // if the path includes // means that there is a subdirectory skipped
  // All paths returned are considered with / separator because of globby returning the linux separator for all os'.
  return (
    localOutputPath === '' ||
    localOutputPath.startsWith('/') ||
    localOutputPath.includes('//')
  );
}
