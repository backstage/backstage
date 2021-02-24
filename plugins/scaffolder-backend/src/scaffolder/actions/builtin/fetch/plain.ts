/*
 * Copyright 2021 Spotify AB
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
import { InputError, UrlReader } from '@backstage/backend-common';
import { ScmIntegrations } from '@backstage/integration';
import { TemplateAction } from '../../types';
import { fetchContents } from './helpers';

export function createFetchPlainAction(options: {
  urlReader: UrlReader;
  integrations: ScmIntegrations;
}): TemplateAction {
  const { urlReader, integrations } = options;

  return {
    id: 'fetch:plain',
    async handler(ctx) {
      ctx.logger.info('Fetching plain content from remote URL');

      // Finally move the template result into the task workspace
      const targetPath = ctx.parameters.targetPath ?? './';
      if (typeof targetPath !== 'string') {
        throw new InputError(
          `Fetch action targetPath is not a string, got ${targetPath}`,
        );
      }
      const outputPath = resolvePath(ctx.workspacePath, targetPath);
      if (!outputPath.startsWith(ctx.workspacePath)) {
        throw new InputError(
          `Fetch action targetPath may not specify a path outside the working directory`,
        );
      }

      await fetchContents({
        urlReader,
        integrations,
        baseUrl: ctx.baseUrl,
        fetchUrl: ctx.parameters.url,
        outputPath,
      });
    },
  };
}
