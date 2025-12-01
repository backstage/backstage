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

import path from 'path';
import { ScmIntegrationRegistry } from '@backstage/integration';
import { InputError } from '@backstage/errors';
import { resolveSafeChildPath } from '@backstage/backend-plugin-api';
import {
  createTemplateAction,
  parseRepoUrl,
  serializeDirectoryContents,
} from '@backstage/plugin-scaffolder-node';
import { CommitAction } from '@gitbeaker/rest';
import { createGitlabApi, getErrorMessage } from './helpers';
import { examples } from './gitlabRepoPush.examples';
import { getFileAction } from '../util';
import { SerializedFile } from '@backstage/plugin-scaffolder-node';
import { RepositoryTreeSchema } from '@gitbeaker/rest';

/**
 * Create a new action that commits into a gitlab repository.
 *
 * @public
 */
export const createGitlabRepoPushAction = (options: {
  integrations: ScmIntegrationRegistry;
}) => {
  const { integrations } = options;

  return createTemplateAction({
    id: 'gitlab:repo:push',
    examples,
    schema: {
      input: {
        repoUrl: z =>
          z.string({
            description: `Accepts the format 'gitlab.com?repo=project_name&owner=group_name' where 'project_name' is the repository name and 'group_name' is a group or username`,
          }),
        branchName: z =>
          z.string({
            description: 'The branch name for the commit',
          }),
        commitMessage: z =>
          z.string({
            description: `The commit message`,
          }),
        sourcePath: z =>
          z
            .string({
              description:
                'Subdirectory of working directory to copy changes from',
            })
            .optional(),
        targetPath: z =>
          z
            .string({
              description: 'Subdirectory of repository to apply changes to',
            })
            .optional(),
        token: z =>
          z
            .string({
              description: 'The token to use for authorization to GitLab',
            })
            .optional(),
        commitAction: z =>
          z
            .enum(['create', 'update', 'delete', 'auto'], {
              description:
                'The action to be used for git commit. Defaults to create, but can be set to update or delete',
            })
            .optional(),
      },
      output: {
        projectid: z =>
          z.string({
            description: 'Gitlab Project id/Name(slug)',
          }),
        projectPath: z =>
          z.string({
            description: 'Gitlab Project path',
          }),
        commitHash: z =>
          z.string({
            description: 'The git commit hash of the commit',
          }),
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

      let remoteFiles: RepositoryTreeSchema[] = [];
      if ((ctx.input.commitAction ?? 'auto') === 'auto') {
        try {
          remoteFiles = await api.Repositories.allRepositoryTrees(repoID, {
            ref: branchName,
            recursive: true,
            path: targetPath ?? undefined,
          });
        } catch (e) {
          ctx.logger.warn(
            `Could not retrieve the list of files for ${repoID} (branch: ${branchName}) : ${getErrorMessage(
              e,
            )}`,
          );
        }
      }

      const actions: CommitAction[] = (
        (
          await Promise.all(
            fileContents.map(async file => {
              const action = await getFileAction(
                { file, targetPath },
                { repoID, branch: branchName },
                api,
                ctx.logger,
                remoteFiles,
                ctx.input.commitAction,
              );
              return { file, action };
            }),
          )
        ).filter(o => o.action !== 'skip') as {
          file: SerializedFile;
          action: CommitAction['action'];
        }[]
      ).map(({ file, action }) => ({
        action,
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
        if (commitAction !== 'create') {
          throw new InputError(
            `Committing the changes to ${branchName} failed. Please verify that all files you're trying to modify exist in the repository. ${getErrorMessage(
              e,
            )}`,
          );
        }
        throw new InputError(
          `Committing the changes to ${branchName} failed. Please check that none of the files created by the template already exists. ${getErrorMessage(
            e,
          )}`,
        );
      }
    },
  });
};
