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

import { UrlReader, resolveSafeChildPath } from '@backstage/backend-common';
import fs from 'fs-extra';
import { examples } from './api.examples';
import { createTemplateAction } from '@backstage/plugin-scaffolder-node';

import { CatalogApi } from '@backstage/catalog-client';
import path from 'path';

/**
 * Gets the definition of an API and places it in the workspace, or optionally
 * in a subdirectory specified by the 'targetPath' input option.
 * @public
 */
export function createFetchApiAction(options: {
  reader: UrlReader;
  catalog: CatalogApi;
}) {
  const { reader, catalog } = options;

  return createTemplateAction<{
    apiRef: string;
    targetPath: string;
    token?: string;
  }>({
    id: 'fetch:api',
    description:
      'Gets the defintion of an API from the catalog and places it in the workspace.',
    examples,
    schema: {
      input: {
        type: 'object',
        required: ['apiRef', 'targetPath'],
        properties: {
          apiRef: {
            title: 'API Reference',
            description:
              'The API reference to fetch the definition for, in the format of "<kind>:<namespace>/<name>".',
            type: 'string',
          },
          targetPath: {
            title: 'Target Path',
            description:
              'Target path within the working directory to download the file as.',
            type: 'string',
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
      ctx.logger.info('Fetching API definition from the catalog');

      // Finally move the template result into the task workspace
      const outputPath = resolveSafeChildPath(
        ctx.workspacePath,
        ctx.input.targetPath,
      );

      const entity = await catalog.getEntityByRef(ctx.input.apiRef);
      const definition = entity?.spec?.definition?.toString();
      if (!definition) {
        throw new Error('API definition not found in the catalog');
      }

      const outputDir = path.dirname(outputPath);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirpSync(outputDir);
      }

      let content: string = definition.trim();
      if (content.startsWith('$text')) {
        const pathOrUrl = content.split('$text:')[1].trim();
        if (pathOrUrl.startsWith('http')) {
          const res = await reader.readUrl(pathOrUrl);
          content = await res.buffer().then(b => b.toString());
          return;
        }
        content = fs
          .readFileSync(resolveSafeChildPath(ctx.workspacePath, pathOrUrl))
          .toString();
      }
      fs.writeFileSync(outputPath, content);
    },
  });
}
