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
  return createTemplateAction({
    id: 'fetch:template',
    description:
      'Downloads a skeleton, templates variables into file and directory names and content, and places the result in the workspace, or optionally in a subdirectory specified by the `targetPath` input option.',
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
                'Target path within the working directory to download the contents to. Defaults to the working directory root.',
            })
            .optional(),
        values: z =>
          z
            .record(z.any(), {
              description: 'Values to pass on to the templating engine',
            })
            .optional(),
        copyWithoutRender: z =>
          z
            .array(z.string(), {
              description:
                'An array of glob patterns. Any files or directories which match are copied without being processed as templates.',
            })
            .optional(),
        copyWithoutTemplating: z =>
          z
            .array(z.string(), {
              description:
                'An array of glob patterns. Contents of matched files or directories are copied without being processed, but paths are subject to rendering.',
            })
            .optional(),
        cookiecutterCompat: z =>
          z
            .boolean({
              description:
                'Enable features to maximise compatibility with templates built for fetch:cookiecutter',
            })
            .optional(),
        templateFileExtension: z =>
          z
            .union([z.string(), z.boolean()], {
              description:
                'If set, only files with the given extension will be templated. If set to `true`, the default extension `.njk` is used.',
            })
            .optional(),
        replace: z =>
          z
            .boolean({
              description:
                'If set, replace files in targetPath instead of skipping existing ones.',
            })
            .optional(),
        trimBlocks: z =>
          z
            .boolean({
              description:
                'If set, the first newline after a block is removed (block, not variable tag).',
            })
            .optional(),
        lstripBlocks: z =>
          z
            .boolean({
              description:
                'If set, leading spaces and tabs are stripped from the start of a line to a block.',
            })
            .optional(),
        token: z =>
          z
            .string({
              description:
                'An optional token to use for authentication when reading the resources.',
            })
            .optional(),
      },
    },
    supportsDryRun: true,
    handler: ctx =>
      createTemplateActionHandler({
        ctx,
        resolveTemplate: async () => {
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
