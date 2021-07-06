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

export type FetchTemplateInput = {
  url: string;
  targetPath?: string;
  values: any;
  copyWithoutRender?: string[];
  cookiecutterCompat?: boolean;
};

export function createFetchTemplateAction(options: {
  reader: UrlReader;
  integrations: ScmIntegrations;
}) {
  const { reader, integrations } = options;

  return createTemplateAction<FetchTemplateInput>({
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
          copyWithoutRender: {
            title: 'Copy Without Render',
            description:
              'Avoid rendering directories and files in the template',
            type: 'array',
            items: {
              type: 'string',
            },
          },
          cookiecutterCompat: {
            title: 'Cookiecutter compatibility mode',
            // TODO(mtlewis): documentation for cookiecutter compat mode
            description:
              'Enable features to maximise compatibility with templates built for fetch:cookiecutter',
            type: 'boolean',
          },
        },
      },
    },
    async handler(ctx) {
      ctx.logger.info('Fetching template content from remote URL');

      const workDir = await ctx.createTemporaryDirectory();
      const templateDir = resolvePath(workDir, 'template');

      const targetPath = ctx.input.targetPath ?? './';
      const outputDir = path.resolve(ctx.workspacePath, targetPath);

      if (!outputDir.startsWith(ctx.workspacePath)) {
        throw new InputError(
          `Fetch action targetPath may not specify a path outside the working directory`,
        );
      }

      if (
        ctx.input.copyWithoutRender &&
        !Array.isArray(ctx.input.copyWithoutRender)
      ) {
        throw new InputError(
          'Fetch action input copyWithoutRender must be an Array',
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
      const parameters = ctx.input.cookiecutterCompat
        ? { cookiecutter: ctx.input.values }
        : ctx.input.values;

      ctx.logger.info(
        `Processing ${allEntriesInTemplate.length} template files/directories with input values`,
        ctx.input.values,
      );

      for (const location of allEntriesInTemplate) {
        const isTemplated = !nonTemplatedEntries.has(location);

        const outputPath = resolvePath(
          outputDir,
          isTemplated ? templater.renderString(location, parameters) : location,
        );

        ctx.logger.info(
          `Writing${isTemplated ? ' ' : ' un-templated '}${
            location.endsWith('/') ? 'directory' : 'file'
          } ${location} to template output path`,
        );

        if (location.endsWith('/')) {
          await fs.ensureDir(outputPath);
        } else {
          const inputFileContents = await fs.readFile(
            resolvePath(templateDir, location),
            'utf-8',
          );

          const isBinary = await isBinaryFile(Buffer.from(inputFileContents));
          if (isBinary) {
            ctx.logger.info(
              `Not running templater on contents of ${location} since it is a binary file.`,
            );
          }

          await fs.outputFile(
            outputPath,
            isTemplated && !isBinary
              ? templater.renderString(inputFileContents, parameters)
              : inputFileContents,
          );
        }
      }

      ctx.logger.info(`Template result written to ${outputDir}`);
    },
  });
}
