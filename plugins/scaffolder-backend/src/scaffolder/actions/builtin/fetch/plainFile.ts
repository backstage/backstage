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
import { examples } from './plainFile.examples';

import {
  createTemplateAction,
  fetchFile,
} from '@backstage/plugin-scaffolder-node';

/**
 * Downloads a single file and places it in the workspace.
 * @public
 */
export function createFetchPlainFileAction(options: {
  reader: UrlReaderService;
  integrations: ScmIntegrations;
}) {
  const { reader, integrations } = options;

  return createTemplateAction({
    id: 'fetch:plain:file',
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
    async handler(ctx) {
      ctx.logger.info('Fetching plain content from remote URL');

      // Finally move the template result into the task workspace
      const outputPath = resolveSafeChildPath(
        ctx.workspacePath,
        ctx.input.targetPath,
      );

      await fetchFile({
        reader,
        integrations,
        baseUrl: ctx.templateInfo?.baseUrl,
        fetchUrl: ctx.input.url,
        outputPath,
        token: ctx.input.token,
      });
    },
  });
}
