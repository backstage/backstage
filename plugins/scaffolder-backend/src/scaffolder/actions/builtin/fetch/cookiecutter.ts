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

import fs from 'fs-extra';
import { resolve as resolvePath } from 'path';
import Docker from 'dockerode';
import { InputError, UrlReader } from '@backstage/backend-common';
import { ScmIntegrations } from '@backstage/integration';
import { JsonObject } from '@backstage/config';
import { TemplaterBuilder, TemplaterValues } from '../../../stages/templater';
import { fetchContents } from './helpers';
import { createTemplateAction } from '../../createTemplateAction';

export function createFetchCookiecutterAction(options: {
  dockerClient: Docker;
  reader: UrlReader;
  integrations: ScmIntegrations;
  templaters: TemplaterBuilder;
}) {
  const { dockerClient, reader, templaters, integrations } = options;

  return createTemplateAction<{
    url: string;
    targetPath?: string;
    values: JsonObject;
  }>({
    id: 'fetch:cookiecutter',
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
              'Target path within the working directory to download the contents to.',
            type: 'string',
          },
          values: {
            title: 'Template Values',
            description: 'Values to pass on to cookiecutter for templating',
            type: 'object',
          },
        },
      },
    },
    async handler(ctx) {
      ctx.logger.info('Fetching and then templating using cookiecutter');
      const workDir = await ctx.createTemporaryDirectory();
      const templateDir = resolvePath(workDir, 'template');
      const templateContentsDir = resolvePath(
        templateDir,
        "{{cookiecutter and 'contents'}}",
      );
      const resultDir = resolvePath(workDir, 'result');

      await fetchContents({
        reader,
        integrations,
        baseUrl: ctx.baseUrl,
        fetchUrl: ctx.input.url,
        outputPath: templateContentsDir,
      });

      const cookiecutter = templaters.get('cookiecutter');
      if (!cookiecutter) {
        throw new Error('No cookiecutter templater available');
      }

      // Will execute the template in ./template and put the result in ./result
      await cookiecutter.run({
        workspacePath: workDir,
        dockerClient,
        logStream: ctx.logStream,
        values: ctx.input.values as TemplaterValues,
      });

      // Finally move the template result into the task workspace
      const targetPath = ctx.input.targetPath ?? './';
      const outputPath = resolvePath(ctx.workspacePath, targetPath);
      if (!outputPath.startsWith(ctx.workspacePath)) {
        throw new InputError(
          `Fetch action targetPath may not specify a path outside the working directory`,
        );
      }
      await fs.copy(resultDir, outputPath);
    },
  });
}
