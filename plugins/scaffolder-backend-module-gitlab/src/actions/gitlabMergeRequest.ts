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
  SerializedFile,
  serializeDirectoryContents,
} from '@backstage/plugin-scaffolder-node';
import {
  Gitlab,
  RepositoryTreeSchema,
  CommitAction,
  SimpleUserSchema,
} from '@gitbeaker/rest';
import path from 'path';
import { ScmIntegrationRegistry } from '@backstage/integration';
import { InputError } from '@backstage/errors';
import {
  LoggerService,
  resolveSafeChildPath,
} from '@backstage/backend-plugin-api';
import { createGitlabApi, getErrorMessage } from './helpers';
import { examples } from './gitlabMergeRequest.examples';
import { createHash } from 'crypto';

function computeSha256(file: SerializedFile): string {
  const hash = createHash('sha256');
  hash.update(file.content);
  return hash.digest('hex');
}

async function getFileAction(
  fileInfo: { file: SerializedFile; targetPath?: string },
  target: { repoID: string; branch: string },
  api: InstanceType<typeof Gitlab>,
  logger: LoggerService,
  remoteFiles: RepositoryTreeSchema[],
  defaultCommitAction:
    | 'create'
    | 'delete'
    | 'update'
    | 'skip'
    | 'auto' = 'auto',
): Promise<'create' | 'delete' | 'update' | 'skip'> {
  if (defaultCommitAction === 'auto') {
    const filePath = path.join(fileInfo.targetPath ?? '', fileInfo.file.path);

    if (remoteFiles?.some(remoteFile => remoteFile.path === filePath)) {
      try {
        const targetFile = await api.RepositoryFiles.show(
          target.repoID,
          filePath,
          target.branch,
        );
        if (computeSha256(fileInfo.file) === targetFile.content_sha256) {
          return 'skip';
        }
      } catch (error) {
        logger.warn(
          `Unable to retrieve detailed information for remote file ${filePath}`,
        );
      }
      return 'update';
    }
    return 'create';
  }
  return defaultCommitAction;
}

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
    commitAction?: 'create' | 'delete' | 'update' | 'skip' | 'auto';
    /** @deprecated projectID passed as query parameters in the repoUrl */
    projectid?: string;
    removeSourceBranch?: boolean;
    assignee?: string;
    reviewers?: string[];
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
            description: `\
Accepts the format 'gitlab.com?repo=project_name&owner=group_name' where \
'project_name' is the repository name and 'group_name' is a group or username`,
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
            description: `\
Subdirectory of working directory to copy changes from. \
For reasons of backward compatibility, any specified 'targetPath' input will \
be applied in place of an absent/falsy value for this input. \
Circumvent this behavior using '.'`,
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
            enum: ['create', 'update', 'delete', 'auto'],
            description: `\
The action to be used for git commit. Defaults to the custom 'auto' action provided by backstage,
which uses additional API calls in order to detect whether to 'create', 'update' or 'skip' each source file.`,
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
          reviewers: {
            title: 'Merge Request Reviewers',
            type: 'array',
            items: {
              type: 'string',
            },
            description: 'Users that will be assigned as reviewers',
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
        reviewers,
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
          const assigneeUser = await api.Users.all({ username: assignee });
          assigneeId = assigneeUser[0].id;
        } catch (e) {
          ctx.logger.warn(
            `Failed to find gitlab user id for ${assignee}: ${getErrorMessage(
              e,
            )}. Proceeding with MR creation without an assignee.`,
          );
        }
      }

      let reviewerIds: number[] | undefined = undefined; // Explicitly set to undefined. Strangely, passing an empty array to the API will result the other options being undefined also being explicity passed to the Gitlab API call (e.g. assigneeId)
      if (reviewers !== undefined) {
        reviewerIds = (
          await Promise.all(
            reviewers.map(async reviewer => {
              try {
                const reviewerUser = await api.Users.all({
                  username: reviewer,
                });
                return reviewerUser[0].id;
              } catch (e) {
                ctx.logger.warn(
                  `Failed to find gitlab user id for ${reviewer}: ${e}. Proceeding with MR creation without reviewer.`,
                );
                return undefined;
              }
            }),
          )
        ).filter(id => id !== undefined) as number[];
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

      let targetBranch = targetBranchName;
      if (!targetBranch) {
        const projects = await api.Projects.show(repoID);
        const defaultBranch = projects.default_branch ?? projects.defaultBranch;
        if (typeof defaultBranch !== 'string' || !defaultBranch) {
          throw new InputError(
            `The branch creation failed. Target branch was not provided, and could not find default branch from project settings. Project: ${JSON.stringify(
              project,
            )}`,
          );
        }
        targetBranch = defaultBranch;
      }

      let remoteFiles: RepositoryTreeSchema[] = [];
      if ((ctx.input.commitAction ?? 'auto') === 'auto') {
        try {
          remoteFiles = await api.Repositories.allRepositoryTrees(repoID, {
            ref: targetBranch,
            recursive: true,
            path: targetPath ?? undefined,
          });
        } catch (e) {
          ctx.logger.warn(
            `Could not retrieve the list of files for ${repoID} (branch: ${targetBranch}) : ${getErrorMessage(
              e,
            )}`,
          );
        }
      }
      const actions: CommitAction[] =
        ctx.input.commitAction === 'skip'
          ? []
          : (
              (
                await Promise.all(
                  fileContents.map(async file => {
                    const action = await getFileAction(
                      { file, targetPath },
                      { repoID, branch: targetBranch! },
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

      let createBranch: boolean;
      if (actions.length) {
        createBranch = true;
      } else {
        try {
          await api.Branches.show(repoID, branchName);
          createBranch = false;
          ctx.logger.info(
            `Using existing branch ${branchName} without modification.`,
          );
        } catch (e) {
          createBranch = true;
        }
      }
      if (createBranch) {
        try {
          await api.Branches.create(repoID, branchName, String(targetBranch));
        } catch (e) {
          throw new InputError(
            `The branch creation failed. Please check that your repo does not already contain a branch named '${branchName}'. ${getErrorMessage(
              e,
            )}`,
          );
        }
      }
      if (actions.length) {
        try {
          await api.Commits.create(repoID, branchName, title, actions);
        } catch (e) {
          throw new InputError(
            `Committing the changes to ${branchName} failed. Please check that none of the files created by the template already exists. ${getErrorMessage(
              e,
            )}`,
          );
        }
      }
      try {
        let mergeRequest = await api.MergeRequests.create(
          repoID,
          branchName,
          String(targetBranch),
          title,
          {
            description,
            removeSourceBranch: removeSourceBranch ? removeSourceBranch : false,
            assigneeId,
            reviewerIds,
          },
        );

        // Because we don't know the code owners before the MR is created, we can't check the approval rules beforehand.
        // Getting the approval rules beforehand is very difficult, especially, because of the inheritance rules for groups.
        // Code owners take a moment to be processed and added to the approval rules after the MR is created.

        while (
          mergeRequest.detailed_merge_status === 'preparing' ||
          mergeRequest.detailed_merge_status === 'approvals_syncing' ||
          mergeRequest.detailed_merge_status === 'checking'
        ) {
          mergeRequest = await api.MergeRequests.show(repoID, mergeRequest.iid);
          ctx.logger.info(`${mergeRequest.detailed_merge_status}`);
        }

        const approvalRules = await api.MergeRequestApprovals.allApprovalRules(
          repoID,
          {
            mergerequestIId: mergeRequest.iid,
          },
        );

        if (approvalRules.length !== 0) {
          const eligibleApprovers = approvalRules
            .filter(rule => rule.eligible_approvers !== undefined)
            .map(rule => {
              return rule.eligible_approvers as SimpleUserSchema[];
            })
            .flat();

          const eligibleUserIds = new Set([
            ...eligibleApprovers.map(user => user.id),
            ...(reviewerIds ?? []),
          ]);

          mergeRequest = await api.MergeRequests.edit(
            repoID,
            mergeRequest.iid,
            {
              reviewerIds: Array.from(eligibleUserIds),
            },
          );
        }

        ctx.output('projectid', repoID);
        ctx.output('targetBranchName', targetBranch);
        ctx.output('projectPath', repoID);
        ctx.output(
          'mergeRequestUrl',
          mergeRequest.web_url ?? mergeRequest.webUrl,
        );
      } catch (e) {
        throw new InputError(
          `Merge request creation failed. ${getErrorMessage(e)}`,
        );
      }
    },
  });
};
