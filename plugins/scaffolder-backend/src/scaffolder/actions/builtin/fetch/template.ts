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

import { resolve as resolvePath, extname } from 'path';
import { resolveSafeChildPath, UrlReader } from '@backstage/backend-common';
import { InputError } from '@backstage/errors';
import { ScmIntegrations } from '@backstage/integration';
import { fetchContents } from './helpers';
import { createTemplateAction } from '../../createTemplateAction';
import globby from 'globby';
import nunjucks from 'nunjucks';
import fs from 'fs-extra';
import { isBinaryFile } from 'isbinaryfile';

/*
 * Maximise compatibility with Jinja (and therefore cookiecutter)
 * using nunjucks jinja compat mode. Since this method mutates
 * the global nunjucks instance, we can't enable this per-template,
 * or only for templates with cookiecutter compat enabled, so the
 * next best option is to explicitly enable it globally and allow
 * folks to rely on jinja compatibility behaviour in fetch:template
 * templates if they wish.
 *
 * cf. https://mozilla.github.io/nunjucks/api.html#installjinjacompat
 */
nunjucks.installJinjaCompat();

type CookieCompatInput = {
  copyWithoutRender?: string[];
  cookiecutterCompat?: boolean;
};

type ExtensionInput = {
  extension?: string | boolean;
};

export type FetchTemplateInput = {
  url: string;
  targetPath?: string;
  values: any;
} & CookieCompatInput &
  ExtensionInput;

export function createFetchTemplateAction(options: {
  reader: UrlReader;
  integrations: ScmIntegrations;
}) {
  const { reader, integrations } = options;

  return createTemplateAction<FetchTemplateInput>({
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
          extension: {
            title: 'Extension to Process (.njk)',
            description: 'Extension to use for templated files.',
            type: ['string', 'boolean'],
          },
        },
      },
    },
    async handler(ctx) {
      ctx.logger.info('Fetching template content from remote URL');

      const workDir = await ctx.createTemporaryDirectory();
      const templateDir = resolvePath(workDir, 'template');

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
        ctx.input.extension &&
        (ctx.input.copyWithoutRender || ctx.input.cookiecutterCompat)
      ) {
        throw new InputError(
          'Fetch action input extension incompatible with copyWithoutRender and cookiecutterCompat',
        );
      }

      let extension: string | false = false;
      if (ctx.input.extension) {
        extension = ctx.input.extension === true ? '.njk' : ctx.input.extension;
      }
      if (
        extension !== false &&
        (extension.length < 2 || !extension.startsWith('.'))
      ) {
        throw new InputError(
          'Fetch action input extension needs to start with a `.`',
        );
      }

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

      const nonTemplatedEntries = new Set(
        (
          await Promise.all(
            (ctx.input.copyWithoutRender || []).map(pattern =>
              globby(pattern, {
                cwd: templateDir,
                dot: true,
                onlyFiles: false,
                markDirectories: true,
              }),
            ),
          )
        ).flat(),
      );

      // Create a templater
      const templater = nunjucks.configure({
        ...(ctx.input.cookiecutterCompat
          ? {}
          : {
              tags: {
                // TODO(mtlewis/orkohunter): Document Why we are changing the literals? Not here, but on scaffolder docs. ADR?
                variableStart: '${{',
                variableEnd: '}}',
              },
            }),
        // We don't want this builtin auto-escaping, since uses HTML escape sequences
        // like `&quot;` - the correct way to escape strings in our case depends on
        // the file type.
        autoescape: false,
      });

      if (ctx.input.cookiecutterCompat) {
        // The "jsonify" filter built into cookiecutter is common
        // in fetch:cookiecutter templates, so when compat mode
        // is enabled we alias the "dump" filter from nunjucks as
        // jsonify. Dump accepts an optional `spaces` parameter
        // which enables indented output, but when this parameter
        // is not supplied it works identically to jsonify.
        //
        // cf. https://cookiecutter.readthedocs.io/en/latest/advanced/template_extensions.html?highlight=jsonify#jsonify-extension
        // cf. https://mozilla.github.io/nunjucks/templating.html#dump
        templater.addFilter('jsonify', templater.getFilter('dump'));
      }

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

      for (const location of allEntriesInTemplate) {
        let shouldCopyWithoutRender = nonTemplatedEntries.has(location);

        let localOutputPath = location;
        if (extension) {
          if (extname(localOutputPath) === extension) {
            localOutputPath = localOutputPath.slice(0, -extension.length);
          } else {
            shouldCopyWithoutRender = true;
          }
          localOutputPath = templater.renderString(localOutputPath, context);
        } else if (!shouldCopyWithoutRender) {
          localOutputPath = templater.renderString(localOutputPath, context);
        }
        const outputPath = resolvePath(outputDir, localOutputPath);

        if (shouldCopyWithoutRender) {
          ctx.logger.info(
            `Copying file/directory ${location} without processing since it matches a pattern in "copyWithoutRender".`,
          );
        }

        if (location.endsWith('/')) {
          ctx.logger.info(
            `Writing directory ${location} to template output path.`,
          );
          await fs.ensureDir(outputPath);
        } else {
          const inputFilePath = resolvePath(templateDir, location);

          if (await isBinaryFile(inputFilePath)) {
            ctx.logger.info(
              `Copying binary file ${location} to template output path.`,
            );
            await fs.copy(inputFilePath, outputPath);
          } else {
            ctx.logger.info(
              `Writing file ${location} to template output path.`,
            );
            const inputFileContents = await fs.readFile(inputFilePath, 'utf-8');
            await fs.outputFile(
              outputPath,
              shouldCopyWithoutRender
                ? inputFileContents
                : templater.renderString(inputFileContents, context),
            );
          }
        }
      }

      ctx.logger.info(`Template result written to ${outputDir}`);
    },
  });
}
