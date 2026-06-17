/*
 * Copyright 2024 The Backstage Authors
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

import { UrlReaderService } from '@backstage/backend-plugin-api';
import { ScmIntegrations } from '@backstage/integration';
import {
  createTemplateAction,
  fetchFile,
  TemplateFilter,
  TemplateGlobal,
} from '@backstage/plugin-scaffolder-node';
import path from 'node:path';
import { examples } from './templateFile.examples';
import { createTemplateFileActionHandler } from './templateFileActionHandler';

/**
 * Downloads a single file and templates variables into file.
 * Then places the result in the workspace, or optionally in a subdirectory
 * specified by the 'targetPath' input option.
 * @public
 */
export function createFetchTemplateFileAction(options: {
  reader: UrlReaderService;
  integrations: ScmIntegrations;
  additionalTemplateFilters?: Record<string, TemplateFilter>;
  additionalTemplateGlobals?: Record<string, TemplateGlobal>;
}) {
  return createTemplateAction({
    id: 'fetch:template:file',
    description: 'Downloads single file and places it in the workspace.',
    examples,
    schema: {
      input: {
        url: z =>
          z.string({
            description:
              'Relative path or absolute URL pointing to the single file to fetch.',
          }),
        targetPath: z =>
          z.string({
            description:
              'Target path within the working directory to download the file as.',
          }),
        values: z =>
          z
            .record(z.any(), {
              description: 'Values to pass on to the templating engine',
            })
            .optional(),
        cookiecutterCompat: z =>
          z
            .boolean({
              description:
                'Enable features to maximise compatibility with templates built for fetch:cookiecutter',
            })
            .optional(),
        replace: z =>
          z
            .boolean({
              description:
                'If set, replace file in targetPath instead of overwriting existing one.',
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
      createTemplateFileActionHandler({
        ctx,
        resolveTemplateFile: async () => {
          ctx.logger.info('Fetching template file content from remote URL');

          const workDir = await ctx.createTemporaryDirectory();
          // Write to a tmp file, render the template, then copy to workspace.
          const tmpFilePath = path.join(workDir, 'tmp');

          await fetchFile({
            baseUrl: ctx.templateInfo?.baseUrl,
            fetchUrl: ctx.input.url,
            outputPath: tmpFilePath,
            token: ctx.input.token,
            ...options,
          });
          return tmpFilePath;
        },
        ...options,
      }),
  });
}
