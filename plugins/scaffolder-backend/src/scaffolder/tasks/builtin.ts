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
import {
  GithubCredentialsProvider,
  ScmIntegrations,
} from '@backstage/integration';
import { JsonValue } from '@backstage/config';
import { CatalogApi } from '@backstage/catalog-client';
import { getEntityName } from '@backstage/catalog-model';
import { Octokit } from '@octokit/rest';
import { initRepoAndPush } from '../stages/publish/helpers';

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

  let fetchUrlIsAbsolute = false;
  try {
    // eslint-disable-next-line no-new
    new URL(fetchUrl);
    fetchUrlIsAbsolute = true;
  } catch {
    /* ignored */
  }

  // We handle both file locations and url ones
  if (!fetchUrlIsAbsolute && baseUrl?.startsWith('file://')) {
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

    if (fetchUrlIsAbsolute) {
      readUrl = fetchUrl;
    } else if (baseUrl) {
      const integration = integrations.byUrl(baseUrl);
      if (!integration) {
        throw new InputError(`No integration found for location ${baseUrl}`);
      }

      readUrl = integration.resolveUrl({
        url: fetchUrl,
        base: baseUrl,
      });
    } else {
      throw new InputError(
        `Failed to fetch, template location could not be determined and the fetch URL is relative, ${fetchUrl}`,
      );
    }

    const res = await urlReader.readTree(readUrl);
    await fs.ensureDir(outputPath);
    await res.dir({ targetDir: outputPath });
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

export function createPublishGithubAction(options: {
  integrations: ScmIntegrations;
  repoVisibility: 'private' | 'internal' | 'public';
}): TemplateAction {
  const { integrations, repoVisibility } = options;

  const credentialsProviders = new Map(
    integrations.github.list().map(integration => {
      const provider = GithubCredentialsProvider.create(integration.config);
      return [integration.config.host, provider];
    }),
  );

  return {
    id: 'publish:github',
    async handler(ctx) {
      const { repoUrl, description, access } = ctx.parameters;

      if (typeof repoUrl !== 'string') {
        throw new Error(
          `Invalid repo URL passed to publish:github, got ${typeof repoUrl}`,
        );
      }
      let parsed;
      try {
        parsed = new URL(`https://${repoUrl}`);
      } catch (error) {
        throw new InputError(
          `Invalid repo URL passed to publish:github, got ${repoUrl}, ${error}`,
        );
      }
      const host = parsed.host;
      const owner = parsed.searchParams.get('owner');
      if (!owner) {
        throw new InputError(
          `Invalid repo URL passed to publish:github, missing owner`,
        );
      }
      const repo = parsed.searchParams.get('repo');
      if (!repo) {
        throw new InputError(
          `Invalid repo URL passed to publish:github, missing repo`,
        );
      }

      const credentialsProvider = credentialsProviders.get(host);
      const integrationConfig = integrations.github.byHost(host);

      if (!credentialsProvider || !integrationConfig) {
        throw new InputError(
          `No matching integration configuration for host ${host}, please check your Integrations config`,
        );
      }

      const { token } = await credentialsProvider.getCredentials({
        url: `${host}/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`,
      });

      if (!token) {
        throw new InputError(
          `No token available for host: ${host}, with owner ${owner}, and repo ${repo}`,
        );
      }

      const client = new Octokit({
        auth: token,
        baseUrl: integrationConfig.config.apiBaseUrl,
      });

      const user = await client.users.getByUsername({
        username: owner,
      });

      const repoCreationPromise =
        user.data.type === 'Organization'
          ? client.repos.createInOrg({
              name: repo,
              org: owner,
              private: repoVisibility !== 'public',
              visibility: repoVisibility,
              description: description as string,
            })
          : client.repos.createForAuthenticatedUser({
              name: repo,
              private: repoVisibility === 'private',
              description: description as string,
            });

      const { data } = await repoCreationPromise;
      const accessString = access as string;
      if (accessString?.startsWith(`${owner}/`)) {
        const [, team] = accessString.split('/');
        await client.teams.addOrUpdateRepoPermissionsInOrg({
          org: owner,
          team_slug: team,
          owner,
          repo,
          permission: 'admin',
        });
        // no need to add accessString if it's the person who own's the personal account
      } else if (accessString && accessString !== owner) {
        await client.repos.addCollaborator({
          owner,
          repo,
          username: accessString,
          permission: 'admin',
        });
      }

      const remoteUrl = data.clone_url;
      const repoContentsUrl = `${data?.html_url}/blob/master`;

      await initRepoAndPush({
        dir: ctx.workspacePath,
        remoteUrl,
        auth: {
          username: 'x-access-token',
          password: token,
        },
        logger: ctx.logger,
      });

      ctx.output('remoteUrl', remoteUrl);
      ctx.output('repoContentsUrl', repoContentsUrl);
    },
  };
}

export function createCatalogRegisterAction(options: {
  catalogClient: CatalogApi;
  integrations: ScmIntegrations;
}): TemplateAction {
  const { catalogClient, integrations } = options;

  return {
    id: 'catalog:register',
    async handler(ctx) {
      const {
        repoContentsUrl,
        catalogInfoPath = '/catalog-info.yaml',
      } = ctx.parameters;

      let { catalogInfoUrl } = ctx.parameters;
      if (!catalogInfoUrl) {
        const integration = integrations.byUrl(repoContentsUrl as string);
        if (!integration) {
          throw new InputError('No integration found for host');
        }

        catalogInfoUrl = integration.resolveUrl({
          base: repoContentsUrl as string,
          url: catalogInfoPath as string,
        });
      }

      ctx.logger.info(`Registering ${catalogInfoUrl} in the catalog`);

      const result = await catalogClient.addLocation({
        type: 'url',
        target: catalogInfoUrl as string,
      });
      if (result.entities.length >= 1) {
        const { kind, name, namespace } = getEntityName(result.entities[0]);
        ctx.output('entityRef', `${kind}:${namespace}/${name}`);
        ctx.output('catalogInfoUrl', catalogInfoUrl);
      }
    },
  };
}
