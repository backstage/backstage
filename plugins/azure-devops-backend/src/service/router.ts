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

import { errorHandler } from '@backstage/backend-common';
import express from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';
import { Config } from '@backstage/config';
import { getPersonalAccessTokenHandler, WebApi } from 'azure-devops-node-api';
import { AzureDevOpsApi } from '../api';
import { PullRequestStatus } from 'azure-devops-node-api/interfaces/GitInterfaces';
import { PullRequestOptions } from '../api/types';

const DEFAULT_TOP: number = 10;

export interface RouterOptions {
  azureDevOpsApi?: AzureDevOpsApi;
  logger: Logger;
  config: Config;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger } = options;
  const config = options.config.getConfig('azureDevOps');

  const token = config.getString('token');
  const host = config.getString('host');
  const organization = config.getString('organization');

  const authHandler = getPersonalAccessTokenHandler(token);
  const webApi = new WebApi(`https://${host}/${organization}`, authHandler);

  const azureDevOpsApi =
    options.azureDevOpsApi || new AzureDevOpsApi(logger, webApi);

  const router = Router();
  router.use(express.json());

  router.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  router.get('/repository/:projectName/:repoName', async (req, res) => {
    const { projectName, repoName } = req.params;
    const gitRepository = await azureDevOpsApi.getGitRepository(
      projectName,
      repoName,
    );
    res.status(200).json(gitRepository);
  });

  router.get('/builds/:projectName/:repoId', async (req, res) => {
    const { projectName, repoId } = req.params;
    const top = req.query.top ? Number(req.query.top) : DEFAULT_TOP;
    const buildList = await azureDevOpsApi.getBuildList(
      projectName,
      repoId,
      top,
    );
    res.status(200).json(buildList);
  });

  router.get('/repo-builds/:projectName/:repoName', async (req, res) => {
    const { projectName, repoName } = req.params;
    const top = req.query.top ? Number(req.query.top) : DEFAULT_TOP;
    const gitRepository = await azureDevOpsApi.getRepoBuilds(
      projectName,
      repoName,
      top,
    );
    res.status(200).json(gitRepository);
  });

  router.get('/pull-requests/:projectName/:repoName', async (req, res) => {
    const { projectName, repoName } = req.params;
    const top = req.query.top ? Number(req.query.top) : DEFAULT_TOP;
    const status = req.query.status
      ? Number(req.query.status)
      : PullRequestStatus.Active;
    const pullRequestOptions: PullRequestOptions = {
      top: top,
      status: status,
    };
    const gitPullRequest = await azureDevOpsApi.getPullRequests(
      projectName,
      repoName,
      pullRequestOptions,
    );
    res.status(200).json(gitPullRequest);
  });

  router.use(errorHandler());
  return router;
}
