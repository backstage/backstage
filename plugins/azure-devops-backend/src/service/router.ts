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

  const token: string = config.getString('token');
  const host: string = config.getString('host');
  const organization: string = config.getString('organization');
  const top: number = config.getOptionalNumber('top') || 10;

  const authHandler = getPersonalAccessTokenHandler(token);
  const webApi = new WebApi(`https://${host}/${organization}`, authHandler);

  const azureDevOpsApi =
    options.azureDevOpsApi || new AzureDevOpsApi(logger, webApi, top);

  const router = Router();
  router.use(express.json());

  router.get('/health', (_, response) => {
    let code: number = 200;
    let status: string = '';
    let details: string = '';

    if (token && host && organization) {
      code = 200;
      status = 'Healthy';
      details = 'All required config has been provided';
    }

    if (!token) {
      code = 500;
      status = 'Unhealthy';
      details = 'Token is missing';
    }

    if (!host) {
      code = 500;
      status = 'Unhealthy';
      details = 'Host is missing';
    }

    if (!organization) {
      code = 500;
      status = 'Unhealthy';
      details = 'Organization is missing';
    }

    response.status(code).json({ status: status, details: details });
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
    const buildList = await azureDevOpsApi.getBuildList(projectName, repoId);
    res.status(200).json(buildList);
  });

  router.get('/repo-builds/:projectName/:repoName', async (req, res) => {
    const { projectName, repoName } = req.params;
    const gitRepository = await azureDevOpsApi.getRepoBuilds(
      projectName,
      repoName,
    );
    res.status(200).json(gitRepository);
  });

  router.use(errorHandler());
  return router;
}
