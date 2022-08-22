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
  DashboardPullRequest,
  PullRequestOptions,
  PullRequestStatus,
} from '@backstage/plugin-azure-devops-common';
import { WebApi, getPersonalAccessTokenHandler } from 'azure-devops-node-api';

import { AzureDevOpsApi } from '../api';
import { Config } from '@backstage/config';
import { Logger } from 'winston';
import { PullRequestsDashboardProvider } from '../api/PullRequestsDashboardProvider';
import Router from 'express-promise-router';
import { errorHandler, UrlReader } from '@backstage/backend-common';
import express from 'express';

const DEFAULT_TOP = 10;

/** @public */
export interface RouterOptions {
  azureDevOpsApi?: AzureDevOpsApi;
  logger: Logger;
  config: Config;
  reader: UrlReader;
}

/** @public */
export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger, reader } = options;
  const config = options.config.getConfig('azureDevOps');

  const token = config.getString('token');
  const host = config.getString('host');
  const organization = config.getString('organization');

  const authHandler = getPersonalAccessTokenHandler(token);
  const webApi = new WebApi(`https://${host}/${organization}`, authHandler);

  const azureDevOpsApi =
    options.azureDevOpsApi || new AzureDevOpsApi(logger, webApi, reader);

  const pullRequestsDashboardProvider =
    await PullRequestsDashboardProvider.create(logger, azureDevOpsApi);

  const router = Router();
  router.use(express.json());

  router.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  router.get('/projects', async (_req, res) => {
    const projects = await azureDevOpsApi.getProjects();
    res.status(200).json(projects);
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

  router.get('/git-tags/:projectName/:repoName', async (req, res) => {
    const { projectName, repoName } = req.params;
    const gitTags = await azureDevOpsApi.getGitTags(projectName, repoName);
    res.status(200).json(gitTags);
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

  router.get('/dashboard-pull-requests/:projectName', async (req, res) => {
    const { projectName } = req.params;

    const top = req.query.top ? Number(req.query.top) : DEFAULT_TOP;

    const status = req.query.status
      ? Number(req.query.status)
      : PullRequestStatus.Active;

    const pullRequestOptions: PullRequestOptions = {
      top: top,
      status: status,
    };

    const pullRequests: DashboardPullRequest[] =
      await pullRequestsDashboardProvider.getDashboardPullRequests(
        projectName,
        pullRequestOptions,
      );

    res.status(200).json(pullRequests);
  });

  router.get('/all-teams', async (_req, res) => {
    const allTeams = await pullRequestsDashboardProvider.getAllTeams();
    res.status(200).json(allTeams);
  });

  router.get(
    '/build-definitions/:projectName/:definitionName',
    async (req, res) => {
      const { projectName, definitionName } = req.params;
      const buildDefinitionList = await azureDevOpsApi.getBuildDefinitions(
        projectName,
        definitionName,
      );
      res.status(200).json(buildDefinitionList);
    },
  );

  router.get('/builds/:projectName', async (req, res) => {
    const { projectName } = req.params;
    const repoName = req.query.repoName?.toString();
    const definitionName = req.query.definitionName?.toString();
    const top = req.query.top ? Number(req.query.top) : DEFAULT_TOP;
    const builds = await azureDevOpsApi.getBuildRuns(
      projectName,
      top,
      repoName,
      definitionName,
    );
    res.status(200).json(builds);
  });

  router.get('/users/:userId/team-ids', async (req, res) => {
    const { userId } = req.params;
    const teamIds = await pullRequestsDashboardProvider.getUserTeamIds(userId);
    res.status(200).json(teamIds);
  });

  router.get('/readme/:projectName/:repoName', async (req, res) => {
    const { projectName, repoName } = req.params;
    const readme = await azureDevOpsApi.getReadme(
      host,
      organization,
      projectName,
      repoName,
    );
    res.status(200).json(readme);
  });

  router.use(errorHandler());
  return router;
}
