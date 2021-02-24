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
import { resolve as resolvePath, isAbsolute } from 'path';
import Docker from 'dockerode';
import { TemplaterBuilder, TemplaterValues } from '../stages/templater';
import { TemplateAction } from './types';
import { InputError, UrlReader } from '@backstage/backend-common';
import { ScmIntegrations } from '@backstage/integration';
import { JsonValue } from '@backstage/config';

async function fetchContents({
  urlReader,
  integrations,
  baseUrl,
  fetchUrl = '.',
  outputPath,
}: {
  urlReader: UrlReader;
  integrations: ScmIntegrations;
  baseUrl?: string;
  fetchUrl?: JsonValue;
  outputPath: string;
}) {
  if (typeof fetchUrl !== 'string') {
    throw new InputError(
      `Invalid url parameter, expected string, got ${typeof fetchUrl}`,
    );
  }

  // We handle both file locations and url ones
  if (baseUrl?.startsWith('file://')) {
    const basePath = baseUrl.slice('file://'.length);
    if (isAbsolute(fetchUrl)) {
      throw new InputError(
        `Fetch URL may not be absolute for file locations, ${fetchUrl}`,
      );
    }
    const srcDir = resolvePath(basePath, '..', fetchUrl);
    await fs.copy(srcDir, outputPath);
  } else {
    let readUrl;

    if (baseUrl) {
      const integration = integrations.byUrl(baseUrl);
      if (!integration) {
        throw new InputError(`No integration found for location ${baseUrl}`);
      }
      readUrl = integration.resolveUrl({
        url: fetchUrl,
        base: baseUrl,
      });
    } else {
      // If we don't have a baseUrl, check if our provided fetch url is absolute
      try {
        readUrl = new URL(fetchUrl).toString();
      } catch {
        throw new InputError(
          `Failed to fetch, template location could not be determined and the fetch URL is relative, ${fetchUrl}`,
        );
      }

      const res = await urlReader.readTree(readUrl);
      await res.dir({ targetDir: outputPath });
    }
  }
}

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

export function createFetchCookiecutterAction(options: {
  dockerClient: Docker;
  urlReader: UrlReader;
  integrations: ScmIntegrations;
  templaters: TemplaterBuilder;
}): TemplateAction {
  const { dockerClient, urlReader, templaters, integrations } = options;

  return {
    id: 'fetch:cookiecutter',
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
        urlReader,
        integrations,
        baseUrl: ctx.baseUrl,
        fetchUrl: ctx.parameters.url,
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
        values: ctx.parameters.values as TemplaterValues,
      });

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
      await fs.copy(resultDir, outputPath);
    },
  };
}
