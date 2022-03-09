/*
 * Copyright 2020 The Backstage Authors
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

import { errorHandler, UrlReader } from '@backstage/backend-common';
import { Config } from '@backstage/config';
import { InputError } from '@backstage/errors';
import {
  DefaultGithubCredentialsProvider,
  ScmIntegrations,
} from '@backstage/integration';
import { Octokit } from '@octokit/rest';
import express from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';

export interface RouterOptions {
  config: Config;
  logger: Logger;
}

async function getOctokit(config: Config, host: string): Promise<Octokit> {
  const integrations = ScmIntegrations.fromConfig(config);
  const integrationConfig = integrations.github.byHost(host)?.config;
  if (!integrationConfig) {
    throw new InputError(`No integration for host ${host}`);
  }

  const credentialsProvider =
    DefaultGithubCredentialsProvider.fromIntegrations(integrations);
  const { token } = await credentialsProvider.getCredentials({
    url: `https://${host}`,
  });
  if (!token) {
    throw new InputError(`No token available for host: ${host}`);
  }

  return new Octokit({
    auth: token,
    baseUrl: integrationConfig.apiBaseUrl,
  });
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { config } = options;
  const integrations = ScmIntegrations.fromConfig(config);

  const router = Router();
  router.use(express.json());

  router.get('/integrations', (_, response) => {
    response.send(
      integrations.list().map(integration => ({
        type: integration.type,
        title: integration.title,
      })),
    );
  });

  router.get('/github/orgs/:host', async (request, response) => {
    const { host } = request.params;
    const octokit = await getOctokit(config, host);
    const { data: orgs } = await octokit.rest.orgs.listForAuthenticatedUser();
    response.send(orgs);
  });

  router.get('/github/repos/:host/:org', async (request, response) => {
    const { host, org } = request.params;
    const octokit = await getOctokit(config, host);

    const { data: repos } = await octokit.rest.repos.listForOrg({ org });

    // Exit early since code search bombs out with 422 if there's no code to search
    if (!repos.length) {
      response.send([]);
      return;
    }

    const { data: search } = await octokit.rest.search.code({
      q: `filename:catalog-info.yaml org:${org}`,
    });
    const hits = search.items
      .map(item => {
        // URLs are in the format:
        // https://api.github.com/repositories/<id>/contents/<path>?ref=<sha>
        const regex =
          /https:\/\/api\.github\.com\/repositories\/(?<id>\d+)\/contents\/(?<path>[^?]+)\?ref=(?<ref>.*)/g;
        return regex.exec(item.url)?.groups;
      })
      .filter(Boolean);

    response.send(
      repos.map(repo => ({
        ...repo,
        descriptor_paths: hits
          .filter(hit => parseInt(hit!.id, 10) === repo.id)
          .map(hit => hit!.path),
      })),
    );
  });

  router.use(errorHandler());
  return router;
}
