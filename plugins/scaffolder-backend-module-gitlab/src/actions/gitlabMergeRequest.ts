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
  createTemplateAction,
  parseRepoUrl,
  serializeDirectoryContents,
} from '@backstage/plugin-scaffolder-node';
import { Types } from '@gitbeaker/core';
import path from 'path';
import { ScmIntegrationRegistry } from '@backstage/integration';
import { InputError } from '@backstage/errors';
import { resolveSafeChildPath } from '@backstage/backend-plugin-api';
import { createGitlabApi } from './helpers';
import { examples } from './gitlabMergeRequest.examples';

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
    targetBranchName?: string;
    sourcePath?: string;
    targetPath?: string;
    token?: string;
    commitAction?: 'create' | 'delete' | 'update';
    /** @deprecated projectID passed as query parameters in the repoUrl */
    projectid?: string;
    removeSourceBranch?: boolean;
    assignee?: string;
  }>({
    id: 'publish:gitlab:merge-request',
    examples,
    schema: {
      input: {
        required: ['repoUrl', 'branchName'],
        type: 'object',
        properties: {
          repoUrl: {
            type: 'string',
            title: 'Repository Location',
            description: `Accepts the format 'gitlab.com?repo=project_name&owner=group_name' where 'project_name' is the repository name and 'group_name' is a group or username`,
          },
          /** @deprecated projectID is passed as query parameters in the repoUrl */
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
            title: 'Source Branch Name',
            description: 'The source branch name of the merge request',
          },
          targetBranchName: {
            type: 'string',
            title: 'Target Branch Name',
            description: 'The target branch name of the merge request',
          },
          sourcePath: {
            type: 'string',
            title: 'Working Subdirectory',
            description:
              'Subdirectory of working directory to copy changes from',
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
          commitAction: {
            title: 'Commit action',
            type: 'string',
            enum: ['create', 'update', 'delete'],
            description:
              'The action to be used for git commit. Defaults to create.',
          },
          removeSourceBranch: {
            title: 'Delete source branch',
            type: 'boolean',
            description:
              'Option to delete source branch once the MR has been merged. Default: false',
          },
          assignee: {
            title: 'Merge Request Assignee',
            type: 'string',
            description: 'User this merge request will be assigned to',
          },
        },
      },
      output: {
        type: 'object',
        properties: {
          targetBranchName: {
            title: 'Target branch name of the merge request',
            type: 'string',
          },
          projectid: {
            title: 'Gitlab Project id/Name(slug)',
            type: 'string',
          },
          projectPath: {
            title: 'Gitlab Project path',
            type: 'string',
          },
          mergeRequestUrl: {
            title: 'MergeRequest(MR) URL',
            type: 'string',
            description: 'Link to the merge request in GitLab',
          },
        },
      },
    },
    async handler(ctx) {
      const {
        assignee,
        branchName,
        targetBranchName,
        description,
        repoUrl,
        removeSourceBranch,
        targetPath,
        sourcePath,
        title,
        token,
      } = ctx.input;

      const { owner, repo, project } = parseRepoUrl(repoUrl, integrations);
      const repoID = project ? project : `${owner}/${repo}`;

      const api = createGitlabApi({
        integrations,
        token,
        repoUrl,
      });

      let assigneeId = undefined;

      if (assignee !== undefined) {
        try {
          const assigneeUser = await api.Users.username(assignee);
          assigneeId = assigneeUser[0].id;
        } catch (e) {
          ctx.logger.warn(
            `Failed to find gitlab user id for ${assignee}: ${e}. Proceeding with MR creation without an assignee.`,
          );
        }
      }

      let fileRoot: string;
      if (sourcePath) {
        fileRoot = resolveSafeChildPath(ctx.workspacePath, sourcePath);
      } else if (targetPath) {
        // for backward compatibility
        fileRoot = resolveSafeChildPath(ctx.workspacePath, targetPath);
      } else {
        fileRoot = ctx.workspacePath;
      }

      const fileContents = await serializeDirectoryContents(fileRoot, {
        gitignore: true,
      });

      const actions: Types.CommitAction[] = fileContents.map(file => ({
        action: ctx.input.commitAction ?? 'create',
        filePath: targetPath
          ? path.posix.join(targetPath, file.path)
          : file.path,
        encoding: 'base64',
        content: file.content.toString('base64'),
        execute_filemode: file.executable,
      }));

      let targetBranch = targetBranchName;
      if (!targetBranch) {
        const projects = await api.Projects.show(repoID);

        const { default_branch: defaultBranch } = projects;
        targetBranch = defaultBranch!;
      }

      try {
        await api.Branches.create(repoID, branchName, String(targetBranch));
      } catch (e) {
        throw new InputError(
          `The branch creation failed. Please check that your repo does not already contain a branch named '${branchName}'. ${e}`,
        );
      }

      try {
        await api.Commits.create(repoID, branchName, ctx.input.title, actions);
      } catch (e) {
        throw new InputError(
          `Committing the changes to ${branchName} failed. Please check that none of the files created by the template already exists. ${e}`,
        );
      }

      try {
        const mergeRequestUrl = await api.MergeRequests.create(
          repoID,
          branchName,
          String(targetBranch),
          title,
          {
            description,
            removeSourceBranch: removeSourceBranch ? removeSourceBranch : false,
            assigneeId,
          },
        ).then((mergeRequest: { web_url: string }) => {
          return mergeRequest.web_url;
        });
        ctx.output('projectid', repoID);
        ctx.output('targetBranchName', targetBranch);
        ctx.output('projectPath', repoID);
        ctx.output('mergeRequestUrl', mergeRequestUrl);
      } catch (e) {
        throw new InputError(`Merge request creation failed${e}`);
      }
    },
  });
};
