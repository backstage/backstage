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
  Camelize,
  CommitAction,
  ExpandedMergeRequestSchema,
  Gitlab,
  RepositoryTreeSchema,
  SimpleUserSchema,
} from '@gitbeaker/rest';
import path from 'path';
import { ScmIntegrationRegistry } from '@backstage/integration';
import { InputError } from '@backstage/errors';
import { resolveSafeChildPath } from '@backstage/backend-plugin-api';
import { createGitlabApi, getErrorMessage } from './helpers';
import { examples } from './gitlabMergeRequest.examples';

import { getFileAction } from '../util';

async function getReviewersFromApprovalRules(
  api: InstanceType<typeof Gitlab>,
  mergerequestIId: number,
  repoID: string,
  ctx: any,
): Promise<number[]> {
  try {
    // Because we don't know the code owners before the MR is created, we can't check the approval rules beforehand.
    // Getting the approval rules beforehand is very difficult, especially, because of the inheritance rules for groups.
    // Code owners take a moment to be processed and added to the approval rules after the MR is created.

    let mergeRequest:
      | ExpandedMergeRequestSchema
      | Camelize<ExpandedMergeRequestSchema> = await api.MergeRequests.show(
      repoID,
      mergerequestIId,
    );

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

    return approvalRules
      .filter(rule => rule.eligible_approvers !== undefined)
      .map(rule => {
        return rule.eligible_approvers as SimpleUserSchema[];
      })
      .flat()
      .map(user => user.id);
  } catch (e) {
    ctx.logger.warn(
      `Failed to retrieve approval rules for MR ${mergerequestIId}: ${getErrorMessage(
        e,
      )}. Proceeding with MR creation without reviewers from approval rules.`,
    );
    return [];
  }
}

const commitActions = ['create', 'delete', 'update', 'skip', 'auto'] as const;

/**
 * Create a new action that creates a GitLab merge request.
 *
 * @public
 */
export const createPublishGitlabMergeRequestAction = (options: {
  integrations: ScmIntegrationRegistry;
}) => {
  const { integrations } = options;

  return createTemplateAction({
    id: 'publish:gitlab:merge-request',
    examples,
    schema: {
      input: {
        repoUrl: z =>
          z.string().describe(`\
Accepts the format \`gitlab.com?repo=project_name&owner=group_name\` where \
\`project_name\` is the repository name and \`group_name\` is a group or username`),
        title: z => z.string().describe('The name for the merge request'),
        description: z =>
          z
            .string()
            .optional()
            .describe('The description of the merge request'),
        branchName: z =>
          z.string().describe('The source branch name of the merge request'),
        targetBranchName: z =>
          z
            .string()
            .optional()
            .describe(
              'The target branch name of the merge request (defaults to _default branch of repository_)',
            ),
        sourcePath: z =>
          z.string().optional().describe(`\
Subdirectory of working directory to copy changes from. \
For reasons of backward compatibility, any specified \`targetPath\` input will \
be applied in place of an absent/falsy value for this input. \
Circumvent this behavior using \`.\``),
        targetPath: z =>
          z
            .string()
            .optional()
            .describe('Subdirectory of repository to apply changes to'),
        token: z =>
          z
            .string()
            .optional()
            .describe('The token to use for authorization to GitLab'),
        commitAction: z =>
          z.enum(commitActions).optional().describe(`\
The action to be used for \`git\` commit. Defaults to the custom \`auto\` action provided by Backstage,
which uses additional API calls in order to detect whether to \`create\`, \`update\` or \`skip\` each source file.`),
        /** @deprecated projectID passed as query parameters in the repoUrl */
        projectid: z =>
          z
            .string()
            .optional()
            .describe(
              `\
Project ID/Name(slug) of the GitLab Project
_deprecated_: \`projectid\` passed as query parameters in the \`repoUrl\``,
            ),
        removeSourceBranch: z =>
          z
            .boolean()
            .optional()
            .describe(
              'Option to delete source branch once the MR has been merged. Default: `false`',
            ),
        assignee: z =>
          z
            .string()
            .optional()
            .describe('User this merge request will be assigned to'),
        reviewers: z =>
          z
            .string()
            .array()
            .optional()
            .describe('Users that will be assigned as reviewers'),
        assignReviewersFromApprovalRules: z =>
          z
            .boolean()
            .optional()
            .describe(
              'Automatically assign reviewers from the approval rules of the MR. Includes `CODEOWNERS`',
            ),
        labels: z =>
          z
            .string()
            .or(z.string().array())
            .optional()
            .describe('Labels with which to tag the created merge request'),
      },
      output: {
        targetBranchName: z =>
          z.string().describe('Target branch name of the merge request'),
        projectid: z => z.string().describe('GitLab Project id/Name(slug)'),
        projectPath: z => z.string().describe('GitLab Project path'),
        mergeRequestUrl: z =>
          z.string().describe('Link to the merge request in GitLab'),
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
        labels,
      } = ctx.input;

      const { owner, repo, project } = parseRepoUrl(repoUrl, integrations);
      const repoID = project ? project : `${owner}/${repo}`;

      const api = createGitlabApi({
        integrations,
        token,
        repoUrl,
      });

      let assigneeId: number | undefined = undefined;

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

      let reviewerIds: number[] | undefined = undefined; // Explicitly set to undefined. Strangely, passing an empty array to the API will result the other options being undefined also being explicitly passed to the Gitlab API call (e.g. assigneeId)
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

      let createBranch = actions.length > 0;

      try {
        const branch = await api.Branches.show(repoID, branchName);
        if (createBranch) {
          const mergeRequests = await api.MergeRequests.all({
            projectId: repoID,
            source_branch: branchName,
          });

          if (mergeRequests.length > 0) {
            // If an open MR exists, include the MR link in the error message
            throw new InputError(
              `The branch creation failed because the branch already exists at: ${branch.web_url}. Additionally, there is a Merge Request for this branch: ${mergeRequests[0].web_url}`,
            );
          } else {
            // If no open MR, just notify about the existing branch
            throw new InputError(
              `The branch creation failed because the branch already exists at: ${branch.web_url}.`,
            );
          }
        }

        ctx.logger.info(
          `Using existing branch ${branchName} without modification.`,
        );
      } catch (e) {
        if (e instanceof InputError) {
          throw e;
        }
        createBranch = true;
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

      await ctx.checkpoint({
        key: `commit.to.${repoID}.${branchName}`,
        fn: async () => {
          if (actions.length) {
            try {
              const commit = await api.Commits.create(
                repoID,
                branchName,
                title,
                actions,
              );
              return commit.id;
            } catch (e) {
              throw new InputError(
                `Committing the changes to ${branchName} failed. Please check that none of the files created by the template already exists. ${getErrorMessage(
                  e,
                )}`,
              );
            }
          }
          return null;
        },
      });

      const { mrId, mrWebUrl } = await ctx.checkpoint({
        key: `create.mr.${repoID}.${branchName}`,
        fn: async () => {
          try {
            const mergeRequest = await api.MergeRequests.create(
              repoID,
              branchName,
              String(targetBranch),
              title,
              {
                description,
                removeSourceBranch: removeSourceBranch
                  ? removeSourceBranch
                  : false,
                assigneeId,
                reviewerIds,
                labels,
              },
            );
            return {
              mrId: mergeRequest.iid,
              mrWebUrl: mergeRequest.web_url ?? mergeRequest.webUrl,
            };
          } catch (e) {
            throw new InputError(
              `Merge request creation failed. ${getErrorMessage(e)}`,
            );
          }
        },
      });

      await ctx.checkpoint({
        key: `create.mr.assign.reviewers.${repoID}.${branchName}`,
        fn: async () => {
          if (ctx.input.assignReviewersFromApprovalRules) {
            try {
              const reviewersFromApprovalRules =
                await getReviewersFromApprovalRules(api, mrId, repoID, ctx);
              if (reviewersFromApprovalRules.length > 0) {
                const eligibleUserIds = new Set([
                  ...reviewersFromApprovalRules,
                  ...(reviewerIds ?? []),
                ]);

                const mergeRequest = await api.MergeRequests.edit(
                  repoID,
                  mrId,
                  {
                    reviewerIds: Array.from(eligibleUserIds),
                  },
                );
                return {
                  mrWebUrl: mergeRequest.web_url ?? mergeRequest.webUrl,
                };
              }
            } catch (e) {
              ctx.logger.warn(
                `Failed to assign reviewers from approval rules: ${getErrorMessage(
                  e,
                )}.`,
              );
            }
          }
          return { mrWebUrl };
        },
      });

      ctx.output('projectid', repoID);
      ctx.output('targetBranchName', targetBranch);
      ctx.output('projectPath', repoID);
      ctx.output('mergeRequestUrl', mrWebUrl as string);
    },
  });
};
