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
import { createTemplateAction } from '../../createTemplateAction';
import { readFile } from 'fs-extra';
import { Gitlab } from '@gitbeaker/node';
import globby from 'globby';
import { Types } from '@gitbeaker/core';

import { ScmIntegrationRegistry } from '@backstage/integration';
import { InputError } from '@backstage/errors';
import { parseRepoUrl } from './util';
import { resolveSafeChildPath } from '@backstage/backend-common';

/**
 * Create a new action that creates a gitlab merge request.
 *
 * @public
 */
export const createPublishGitlabMergeRequestAction = (options: {
  integrations: ScmIntegrationRegistry;
}) => {
  const { integrations } = options;

  return createTemplateAction<{
    projectid: string;
    repoUrl: string;
    title: string;
    description: string;
    branchName: string;
    targetPath: string;
    token?: string;
  }>({
    id: 'publish:gitlab:merge-request',
    schema: {
      input: {
        required: ['projectid', 'repoUrl', 'targetPath', 'branchName'],
        type: 'object',
        properties: {
          repoUrl: {
            type: 'string',
            title: 'Repository Location',
            description: `Accepts the format 'gitlab.com/group_name/project_name' where 'project_name' is the repository name and 'group_name' is a group or username`,
          },
          projectid: {
            type: 'string',
            title: 'projectid',
            description: 'Project ID/Name(slug) of the Gitlab Project',
          },
          title: {
            type: 'string',
            title: 'Merge Request Name',
            description: 'The name for the merge request',
          },
          description: {
            type: 'string',
            title: 'Merge Request Description',
            description: 'The description of the merge request',
          },
          branchName: {
            type: 'string',
            title: 'Destination Branch name',
            description: 'The description of the merge request',
          },
          targetPath: {
            type: 'string',
            title: 'Repository Subdirectory',
            description: 'Subdirectory of repository to apply changes to',
          },
          token: {
            title: 'Authentication Token',
            type: 'string',
            description: 'The token to use for authorization to GitLab',
          },
        },
      },
      output: {
        type: 'object',
        properties: {
          projectid: {
            title: 'Gitlab Project id/Name(slug)',
            type: 'string',
          },
          mergeRequestURL: {
            title: 'MergeRequest(MR) URL',
            type: 'string',
            description: 'Link to the merge request in GitLab',
          },
        },
      },
    },
    async handler(ctx) {
      const repoUrl = ctx.input.repoUrl;
      const { host } = parseRepoUrl(repoUrl, integrations);
      const integrationConfig = integrations.gitlab.byHost(host);

      const actions: Types.CommitAction[] = [];

      const destinationBranch = ctx.input.branchName;

      if (!integrationConfig) {
        throw new InputError(
          `No matching integration configuration for host ${host}, please check your integrations config`,
        );
      }

      if (!integrationConfig.config.token && !ctx.input.token) {
        throw new InputError(`No token available for host ${host}`);
      }

      const token = ctx.input.token ?? integrationConfig.config.token!;
      const tokenType = ctx.input.token ? 'oauthToken' : 'token';

      const api = new Gitlab({
        host: integrationConfig.config.baseUrl,
        [tokenType]: token,
      });

      const fileRoot = ctx.workspacePath;
      const localFilePaths = await globby([`${ctx.input.targetPath}/**`], {
        cwd: fileRoot,
        gitignore: true,
        dot: true,
      });

      const fileContents = await Promise.all(
        localFilePaths.map(p => readFile(resolveSafeChildPath(fileRoot, p))),
      );

      const repoFilePaths = localFilePaths.map(repoFilePath => {
        return repoFilePath;
      });

      for (let i = 0; i < repoFilePaths.length; i++) {
        actions.push({
          action: 'create',
          filePath: repoFilePaths[i],
          content: fileContents[i].toString(),
        });
      }

      const projects = await api.Projects.show(ctx.input.projectid);

      const { default_branch: defaultBranch } = projects;

      try {
        await api.Branches.create(
          ctx.input.projectid,
          destinationBranch,
          String(defaultBranch),
        );
      } catch (e) {
        throw new InputError(`The branch creation failed ${e}`);
      }

      try {
        await api.Commits.create(
          ctx.input.projectid,
          destinationBranch,
          ctx.input.title,
          actions,
        );
      } catch (e) {
        throw new InputError(
          `Committing the changes to ${destinationBranch} failed ${e}`,
        );
      }

      try {
        const mergeRequestUrl = await api.MergeRequests.create(
          ctx.input.projectid,
          destinationBranch,
          String(defaultBranch),
          ctx.input.title,
          { description: ctx.input.description },
        ).then((mergeRequest: { web_url: string }) => {
          return mergeRequest.web_url;
        });
        ctx.output('projectid', ctx.input.projectid);
        ctx.output('mergeRequestUrl', mergeRequestUrl);
      } catch (e) {
        throw new InputError(`Merge request creation failed${e}`);
      }
    },
  });
};
