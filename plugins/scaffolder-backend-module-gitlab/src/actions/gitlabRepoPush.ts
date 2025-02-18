/*
 * Copyright 2023 The Backstage Authors
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
import { CommitAction } from '@gitbeaker/rest';
import path from 'path';
import { ScmIntegrationRegistry } from '@backstage/integration';
import { InputError } from '@backstage/errors';
import { resolveSafeChildPath } from '@backstage/backend-plugin-api';
import { createGitlabApi, getErrorMessage } from './helpers';
import { examples } from './gitlabRepoPush.examples';

/**
 * Create a new action that commits into a gitlab repository.
 *
 * @public
 */
export const createGitlabRepoPushAction = (options: {
  integrations: ScmIntegrationRegistry;
}) => {
  const { integrations } = options;

  return createTemplateAction<{
    repoUrl: string;
    branchName: string;
    commitMessage: string;
    sourcePath?: string;
    targetPath?: string;
    token?: string;
    commitAction?: 'create' | 'delete' | 'update';
  }>({
    id: 'gitlab:repo:push',
    examples,
    schema: {
      input: {
        required: ['repoUrl', 'branchName', 'commitMessage'],
        type: 'object',
        properties: {
          repoUrl: {
            type: 'string',
            title: 'Repository Location',
            description: `Accepts the format 'gitlab.com?repo=project_name&owner=group_name' where 'project_name' is the repository name and 'group_name' is a group or username`,
          },
          branchName: {
            type: 'string',
            title: 'Source Branch Name',
            description: 'The branch name for the commit',
          },
          commitMessage: {
            type: 'string',
            title: 'Commit Message',
            description: `The commit message`,
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
          commitHash: {
            title: 'The git commit hash of the commit',
            type: 'string',
          },
        },
      },
    },
    async handler(ctx) {
      const {
        branchName,
        repoUrl,
        targetPath,
        sourcePath,
        token,
        commitAction,
      } = ctx.input;

      const { owner, repo, project } = parseRepoUrl(repoUrl, integrations);
      const repoID = project ? project : `${owner}/${repo}`;

      const api = createGitlabApi({
        integrations,
        token,
        repoUrl,
      });

      let fileRoot: string;
      if (sourcePath) {
        fileRoot = resolveSafeChildPath(ctx.workspacePath, sourcePath);
      } else {
        fileRoot = ctx.workspacePath;
      }

      const fileContents = await serializeDirectoryContents(fileRoot, {
        gitignore: true,
      });

      const actions: CommitAction[] = fileContents.map(file => ({
        action: commitAction ?? 'create',
        filePath: targetPath
          ? path.posix.join(targetPath, file.path)
          : file.path,
        encoding: 'base64',
        content: file.content.toString('base64'),
        execute_filemode: file.executable,
      }));

      const branchExists = await ctx.checkpoint({
        key: `branch.exists.${repoID}.${branchName}`,
        fn: async () => {
          try {
            await api.Branches.show(repoID, branchName);
            return true;
          } catch (e: any) {
            if (e.cause?.response?.status !== 404) {
              throw new InputError(
                `Failed to check status of branch '${branchName}'. Please make sure that branch already exists or Backstage has permissions to create one. ${getErrorMessage(
                  e,
                )}`,
              );
            }
          }
          return false;
        },
      });

      if (!branchExists) {
        // create a branch using the default branch as ref
        try {
          const projects = await api.Projects.show(repoID);
          const { default_branch: defaultBranch } = projects;
          await api.Branches.create(repoID, branchName, String(defaultBranch));
        } catch (e) {
          throw new InputError(
            `The branch '${branchName}' was not found and creation failed with error. Please make sure that branch already exists or Backstage has permissions to create one. ${getErrorMessage(
              e,
            )}`,
          );
        }
      }

      try {
        const commitId = await ctx.checkpoint({
          key: `commit.create.${repoID}.${branchName}`,
          fn: async () => {
            const commit = await api.Commits.create(
              repoID,
              branchName,
              ctx.input.commitMessage,
              actions,
            );
            return commit.id;
          },
        });

        ctx.output('projectid', repoID);
        ctx.output('projectPath', repoID);
        ctx.output('commitHash', commitId);
      } catch (e) {
        throw new InputError(
          `Committing the changes to ${branchName} failed. Please check that none of the files created by the template already exists. ${getErrorMessage(
            e,
          )}`,
        );
      }
    },
  });
};
