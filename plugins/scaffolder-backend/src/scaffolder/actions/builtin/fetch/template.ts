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

import {
  resolveSafeChildPath,
  UrlReaderService,
} from '@backstage/backend-plugin-api';
import { ScmIntegrations } from '@backstage/integration';
import {
  createTemplateAction,
  fetchContents,
  TemplateFilter,
  TemplateGlobal,
} from '@backstage/plugin-scaffolder-node';
import { examples } from './template.examples';
import { createTemplateActionHandler } from './templateActionHandler';

/**
 * Downloads a skeleton, templates variables into file and directory names and content.
 * Then places the result in the workspace, or optionally in a subdirectory
 * specified by the 'targetPath' input option.
 *
 * @public
 */
export function createFetchTemplateAction(options: {
  reader: UrlReaderService;
  integrations: ScmIntegrations;
  additionalTemplateFilters?: Record<string, TemplateFilter>;
  additionalTemplateGlobals?: Record<string, TemplateGlobal>;
}) {
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
    handler: createTemplateActionHandler({
      resolveTemplate: async ctx => {
        ctx.logger.info('Fetching template content from remote URL');

        const workDir = await ctx.createTemporaryDirectory();
        const templateDir = resolveSafeChildPath(workDir, 'template');

        await fetchContents({
          baseUrl: ctx.templateInfo?.baseUrl,
          fetchUrl: ctx.input.url,
          outputPath: templateDir,
          token: ctx.input.token,
          ...options,
        });

        return templateDir;
      },
      ...options,
    }),
  });
}
