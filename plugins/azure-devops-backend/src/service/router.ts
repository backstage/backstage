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

import { AzureDevOpsApi } from '../api';
import { Config } from '@backstage/config';
import { Logger } from 'winston';
import { PullRequestsDashboardProvider } from '../api/PullRequestsDashboardProvider';
import Router from 'express-promise-router';
import { errorHandler, UrlReader } from '@backstage/backend-common';
import express from 'express';
import { InputError, NotAllowedError } from '@backstage/errors';
import { getBearerTokenFromAuthorizationHeader } from '@backstage/plugin-auth-node';
import {
  PermissionEvaluator,
  AuthorizeResult,
} from '@backstage/plugin-permission-common';
import { createPermissionIntegrationRouter } from '@backstage/plugin-permission-node';
import {
  azureDevOpsPullRequestReadPermission,
  azureDevOpsPermissions,
  azureDevOpsPullRequestDashboardReadPermission,
  azureDevOpsGitTagReadPermission,
  azureDevOpsPipelineReadPermission,
} from '@backstage/plugin-azure-devops-common';

const DEFAULT_TOP = 10;

/** @public */
export interface RouterOptions {
  azureDevOpsApi?: AzureDevOpsApi;
  logger: Logger;
  config: Config;
  reader: UrlReader;
  permissions: PermissionEvaluator;
}

/** @public */
export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger, reader, config, permissions } = options;

  if (config.getString('azureDevOps.token')) {
    logger.warn(
      "The 'azureDevOps.token' has been deprecated, use 'integrations.azure' instead, for more details see: https://backstage.io/docs/integrations/azure/locations",
    );
  }

  const permissionIntegrationRouter = createPermissionIntegrationRouter({
    permissions: azureDevOpsPermissions,
  });

  const azureDevOpsApi =
    options.azureDevOpsApi ||
    AzureDevOpsApi.fromConfig(config, { logger, urlReader: reader });

  const pullRequestsDashboardProvider =
    await PullRequestsDashboardProvider.create(logger, azureDevOpsApi);

  const router = Router();
  router.use(express.json());

  router.use(permissionIntegrationRouter);

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
    const host = req.query.host?.toString();
    const org = req.query.org?.toString();
    const buildList = await azureDevOpsApi.getBuildList(
      projectName,
      repoId,
      top,
      host,
      org,
    );
    res.status(200).json(buildList);
  });

  router.get('/repo-builds/:projectName/:repoName', async (req, res) => {
    const { projectName, repoName } = req.params;

    const top = req.query.top ? Number(req.query.top) : DEFAULT_TOP;
    const host = req.query.host?.toString();
    const org = req.query.org?.toString();
    const gitRepository = await azureDevOpsApi.getRepoBuilds(
      projectName,
      repoName,
      top,
      host,
      org,
    );

    res.status(200).json(gitRepository);
  });

  router.get('/git-tags/:projectName/:repoName', async (req, res) => {
    const { projectName, repoName } = req.params;
    const host = req.query.host?.toString();
    const org = req.query.org?.toString();

    const entityRef = req.query.entityRef;
    if (typeof entityRef !== 'string') {
      throw new InputError('Invalid entityRef, not a string');
    }

    const token = getBearerTokenFromAuthorizationHeader(
      req.header('authorization'),
    );
    const decision = (
      await permissions.authorize(
        [
          {
            permission: azureDevOpsGitTagReadPermission,
            resourceRef: entityRef,
          },
        ],
        {
          token,
        },
      )
    )[0];

    if (decision.result === AuthorizeResult.DENY) {
      throw new NotAllowedError('Unauthorized');
    }

    const gitTags = await azureDevOpsApi.getGitTags(
      projectName,
      repoName,
      host,
      org,
    );
    res.status(200).json(gitTags);
  });

  router.get('/pull-requests/:projectName/:repoName', async (req, res) => {
    const { projectName, repoName } = req.params;

    const top = req.query.top ? Number(req.query.top) : DEFAULT_TOP;
    const host = req.query.host?.toString();
    const org = req.query.org?.toString();
    const status = req.query.status
      ? Number(req.query.status)
      : PullRequestStatus.Active;

    const pullRequestOptions: PullRequestOptions = {
      top: top,
      status: status,
    };

    const entityRef = req.query.entityRef;
    if (typeof entityRef !== 'string') {
      throw new InputError('Invalid entityRef, not a string');
    }

    const token = getBearerTokenFromAuthorizationHeader(
      req.header('authorization'),
    );
    const decision = (
      await permissions.authorize(
        [
          {
            permission: azureDevOpsPullRequestReadPermission,
            resourceRef: entityRef,
          },
        ],
        {
          token,
        },
      )
    )[0];

    if (decision.result === AuthorizeResult.DENY) {
      throw new NotAllowedError('Unauthorized');
    }

    const gitPullRequest = await azureDevOpsApi.getPullRequests(
      projectName,
      repoName,
      pullRequestOptions,
      host,
      org,
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

    const token = getBearerTokenFromAuthorizationHeader(
      req.header('authorization'),
    );
    const decision = (
      await permissions.authorize(
        [
          {
            permission: azureDevOpsPullRequestDashboardReadPermission,
          },
        ],
        {
          token,
        },
      )
    )[0];

    if (decision.result === AuthorizeResult.DENY) {
      throw new NotAllowedError('Unauthorized');
    }

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
      const host = req.query.host?.toString();
      const org = req.query.org?.toString();
      const buildDefinitionList = await azureDevOpsApi.getBuildDefinitions(
        projectName,
        definitionName,
        host,
        org,
      );
      res.status(200).json(buildDefinitionList);
    },
  );

  router.get('/builds/:projectName', async (req, res) => {
    const { projectName } = req.params;
    const repoName = req.query.repoName?.toString();
    const definitionName = req.query.definitionName?.toString();
    const top = req.query.top ? Number(req.query.top) : DEFAULT_TOP;
    const host = req.query.host?.toString();
    const org = req.query.org?.toString();

    const entityRef = req.query.entityRef;
    if (typeof entityRef !== 'string') {
      throw new InputError('Invalid entityRef, not a string');
    }

    const token = getBearerTokenFromAuthorizationHeader(
      req.header('authorization'),
    );
    const decision = (
      await permissions.authorize(
        [
          {
            permission: azureDevOpsPipelineReadPermission,
            resourceRef: entityRef,
          },
        ],
        {
          token,
        },
      )
    )[0];

    if (decision.result === AuthorizeResult.DENY) {
      throw new NotAllowedError('Unauthorized');
    }

    const builds = await azureDevOpsApi.getBuildRuns(
      projectName,
      top,
      repoName,
      definitionName,
      host,
      org,
    );
    res.status(200).json(builds);
  });

  router.get('/users/:userId/team-ids', async (req, res) => {
    const { userId } = req.params;
    const teamIds = await pullRequestsDashboardProvider.getUserTeamIds(userId);
    res.status(200).json(teamIds);
  });

  router.get('/readme/:projectName/:repoName', async (req, res) => {
    const host =
      req.query.host?.toString() ?? config.getString('azureDevOps.host');
    const org =
      req.query.org?.toString() ?? config.getString('azureDevOps.organization');
    let path = req.query.path;

    if (path === undefined) {
      // if the annotation is missing, default to the previous behaviour (look for README.md in the root of the repo)
      path = 'README.md';
    }

    if (typeof path !== 'string') {
      throw new InputError('Invalid path param');
    }

    if (path === '') {
      throw new InputError('If present, the path param should not be empty');
    }

    const { projectName, repoName } = req.params;

    const entityRef = req.query.entityRef;
    if (typeof entityRef !== 'string') {
      throw new InputError('Invalid entityRef, not a string');
    }

    const token = getBearerTokenFromAuthorizationHeader(
      req.header('authorization'),
    );
    const decision = (
      await permissions.authorize(
        [
          {
            permission: azureDevOpsPullRequestReadPermission,
            resourceRef: entityRef,
          },
        ],
        {
          token,
        },
      )
    )[0];

    if (decision.result === AuthorizeResult.DENY) {
      throw new NotAllowedError('Unauthorized');
    }

    const readme = await azureDevOpsApi.getReadme(
      host,
      org,
      projectName,
      repoName,
      path,
    );
    res.status(200).json(readme);
  });

  router.use(errorHandler());
  return router;
}
