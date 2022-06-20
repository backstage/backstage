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
import { Gitlab } from '@gitbeaker/node';
import { Types } from '@gitbeaker/core';
import path from 'path';
import { ScmIntegrationRegistry } from '@backstage/integration';
import { InputError } from '@backstage/errors';
import { parseRepoUrl } from './util';
import { resolveSafeChildPath } from '@backstage/backend-common';
import { serializeDirectoryContents } from '../../../../lib/files';

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
    repoUrl: string;
    title: string;
    description: string;
    branchName: string;
    targetPath: string;
    token?: string;
    /** @deprecated Use projectPath instead */
    projectid?: string;
  }>({
    id: 'publish:gitlab:merge-request',
    schema: {
      input: {
        required: ['repoUrl', 'targetPath', 'branchName'],
        type: 'object',
        properties: {
          repoUrl: {
            type: 'string',
            title: 'Repository Location',
            description: `Accepts the format 'gitlab.com/group_name/project_name' where 'project_name' is the repository name and 'group_name' is a group or username`,
          },
          /** @deprecated Use projectPath instead */
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
          projectPath: {
            title: 'Gitlab Project path',
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
      const { host, owner, repo } = parseRepoUrl(repoUrl, integrations);
      const projectPath = `${owner}/${repo}`;

      if (ctx.input.projectid) {
        const deprecationWarning = `Property "projectid" is deprecated and no longer to needed to create a MR`;
        ctx.logger.warn(deprecationWarning);
        console.warn(deprecationWarning);
      }

      const integrationConfig = integrations.gitlab.byHost(host);

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

      const targetPath = resolveSafeChildPath(
        ctx.workspacePath,
        ctx.input.targetPath,
      );
      const fileContents = await serializeDirectoryContents(targetPath, {
        gitignore: true,
      });

      const actions: Types.CommitAction[] = fileContents.map(file => ({
        action: 'create',
        filePath: path.posix.join(ctx.input.targetPath, file.path),
        encoding: 'base64',
        content: file.content.toString('base64'),
        execute_filemode: file.executable,
      }));
      const projects = await api.Projects.show(projectPath);

      const { default_branch: defaultBranch } = projects;

      try {
        await api.Branches.create(
          projectPath,
          destinationBranch,
          String(defaultBranch),
        );
      } catch (e) {
        throw new InputError(`The branch creation failed ${e}`);
      }

      try {
        await api.Commits.create(
          projectPath,
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
          projectPath,
          destinationBranch,
          String(defaultBranch),
          ctx.input.title,
          { description: ctx.input.description },
        ).then((mergeRequest: { web_url: string }) => {
          return mergeRequest.web_url;
        });
        /** @deprecated */
        ctx.output('projectid', projectPath);
        ctx.output('projectPath', projectPath);
        ctx.output('mergeRequestUrl', mergeRequestUrl);
      } catch (e) {
        throw new InputError(`Merge request creation failed${e}`);
      }
    },
  });
};
