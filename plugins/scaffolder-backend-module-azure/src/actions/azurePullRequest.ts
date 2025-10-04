/*
 * Copyright 2025 The Backstage Authors
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
} from '@backstage/plugin-scaffolder-node';
import {
  DefaultAzureDevOpsCredentialsProvider,
  ScmIntegrationRegistry,
} from '@backstage/integration';
import { InputError } from '@backstage/errors';
import {
  getBearerHandler,
  getPersonalAccessTokenHandler,
  WebApi,
} from 'azure-devops-node-api';
import {
  GitPullRequest,
  GitPush,
  GitChange,
  PullRequestStatus,
} from 'azure-devops-node-api/interfaces/GitInterfaces';
import { resolveSafeChildPath } from '@backstage/backend-plugin-api';
import { serializeDirectoryContents } from '@backstage/plugin-scaffolder-node';
import path from 'path';
import {
  getAzureRemotePullRequestUrl,
  getLatestCommit,
  resolveTargetBranch,
  createSourceBranchIfNotExists,
  generateGitChanges,
} from './helpers';

import { Config } from '@backstage/config';
import { examples } from './azurePullRequest.examples';

export function createAzureDevopsPullRequestAction(options: {
  integrations: ScmIntegrationRegistry;
  config: Config;
}) {
  const { integrations, config } = options;

  return createTemplateAction({
    id: 'publish:azure:pull-request',
    description: 'Creates a pull request in Azure DevOps.',
    examples,
    supportsDryRun: true,
    schema: {
      input: {
        repoUrl: z =>
          z
            .string()
            .describe(
              'The repository URL, e.g., dev.azure.com?organization=org&project=project&repo=repo',
            ),
        sourceBranchName: z =>
          z.string().describe('The name of the source branch.'),
        filesToDelete: z =>
          z.array(z.string()).describe('List of files to delete.').optional(),
        targetBranchName: z =>
          z.string().describe('The name of the target branch.').optional(),
        title: z => z.string().describe('The title of the pull request.'),
        description: z =>
          z.string().describe('The description of the pull request.'),
        draft: z =>
          z
            .boolean()
            .describe('Whether the pull request should be created as a draft.')
            .optional(),
        sourcePath: z =>
          z
            .string()
            .describe('Subdirectory of working directory to copy changes from.')
            .optional(),
        targetPath: z =>
          z
            .string()
            .describe('Subdirectory of repository to apply changes to.')
            .optional(),
        token: z =>
          z
            .string()
            .describe('The personal access token for Azure DevOps.')
            .optional(),
        reviewers: z =>
          z
            .array(z.string())
            .describe('List of reviewers for the pull request.')
            .optional(),
        assignees: z =>
          z
            .array(z.string())
            .describe('List of assignees for the pull request.')
            .optional(),
        teamReviewers: z =>
          z
            .array(z.string())
            .describe('List of team reviewers for the pull request.')
            .optional(),
        commitMessage: z =>
          z
            .string()
            .describe('The commit message for the pull request.')
            .optional(),
        update: z =>
          z
            .boolean()
            .describe('Update the pull request if it already exists.')
            .optional(),
        gitAuthorName: z =>
          z
            .string()
            .describe('The name of the author of the commit.')
            .optional(),
        gitAuthorEmail: z =>
          z
            .string()
            .describe('The email of the author of the commit.')
            .optional(),
        createWhenEmpty: z =>
          z
            .boolean()
            .describe(
              'Whether to create the pull request if there are no changes.',
            )
            .default(true),
      },
      output: {
        targetBranchName: z =>
          z.string().describe('The target branch name of the pull request.'),
        remoteUrl: z =>
          z.string().describe('The URL of the created pull request.'),
        pullRequestId: z =>
          z.number().describe('The ID of the created pull request.'),
      },
    },
    async handler(ctx) {
      const {
        repoUrl,
        sourceBranchName,
        targetBranchName,
        title,
        description,
        draft,
        sourcePath,
        targetPath,
        token,
        reviewers,
        assignees,
        commitMessage,
        filesToDelete,
        createWhenEmpty,
        gitAuthorName,
        gitAuthorEmail,
        update,
        teamReviewers,
      } = ctx.input;

      const fileRoot = sourcePath
        ? resolveSafeChildPath(ctx.workspacePath, sourcePath)
        : ctx.workspacePath;

      const directoryContents = await serializeDirectoryContents(fileRoot, {
        gitignore: true,
      });

      const { host, organization, project, repo } = parseRepoUrl(
        repoUrl,
        integrations,
      );

      if (!organization || !project || !repo) {
        throw new InputError(
          `Invalid repoUrl: ${repoUrl}. Must be in the format dev.azure.com?organization=<org>&project=<project>&repo=<repo>`,
        );
      }

      const url = `https://${host}/${organization}`;
      const credentialProvider =
        DefaultAzureDevOpsCredentialsProvider.fromIntegrations(integrations);
      const credentials = await credentialProvider.getCredentials({ url });

      if (!credentials && !token) {
        throw new InputError(
          `No credentials provided for Azure DevOps. Please check your integrations config or provide a token.`,
        );
      }

      const authHandler =
        token || credentials?.type === 'pat'
          ? getPersonalAccessTokenHandler(token ?? credentials!.token)
          : getBearerHandler(credentials!.token);

      const webApi = new WebApi(url, authHandler);
      const gitApi = await webApi.getGitApi();

      if (ctx.isDryRun) {
        ctx.logger.info(
          `Dry run: Creating Azure DevOps pull request for ${repoUrl}`,
        );
        ctx.logger.info(
          `Files to be committed: ${directoryContents
            .map(f => f.path)
            .join(', ')}`,
        );
        ctx.output(
          'remoteUrl',
          `https://dev.azure.com/${organization}/${project}/_git/${repo}/pullrequest/123`,
        );
        ctx.output('pullRequestId', 123);
        ctx.output('targetBranchName', targetBranchName ?? 'master');
        return;
      }

      const repository = await ctx.checkpoint({
        key: `get-repo-${repo}`,
        fn: async () => gitApi.getRepository(repo, project) as any,
      });

      if (!repository || !repository.id) {
        throw new Error(
          `Repository ${repo} not found in project ${project} or is missing an ID.`,
        );
      }

      const resolvedTargetBranchName = await ctx.checkpoint({
        key: `resolve-target-branch-${repo}`,
        fn: () =>
          resolveTargetBranch(targetBranchName, repository, repo, ctx.logger),
      });

      const sourceBranchDoesNotExist = await ctx.checkpoint({
        key: `create-source-branch-${repo}-${sourceBranchName}`,
        fn: () =>
          createSourceBranchIfNotExists(
            gitApi,
            repo,
            sourceBranchName,
            project,
            ctx.logger,
            resolvedTargetBranchName,
            repository.id!,
          ),
      });

      const changes: GitChange[] = generateGitChanges(
        directoryContents,
        fileRoot,
        targetPath,
        filesToDelete,
      );

      const push: GitPush = {
        refUpdates: [
          {
            name: `refs/heads/${sourceBranchName}`,
            oldObjectId: await getLatestCommit(
              gitApi,
              repo,
              project,
              sourceBranchDoesNotExist
                ? resolvedTargetBranchName
                : sourceBranchName,
            ),
          },
        ],
        commits: [
          {
            comment:
              commitMessage ||
              `Automated commit from Backstage scaffolder. Added files: ${directoryContents
                .map(file => path.basename(file.path))
                .join(', ')}`,
            author: {
              name:
                gitAuthorName ??
                config.getOptionalString('scaffolder.defaultAuthor.name'),
              email:
                gitAuthorEmail ??
                config.getOptionalString('scaffolder.defaultAuthor.email'),
            },
            changes,
          },
        ],
      };
      if (!createWhenEmpty && (!changes || changes.length === 0)) {
        ctx.logger.info(
          'No changes to commit, skipping pull request creation.',
        );
        return;
      }
      await ctx.checkpoint({
        key: `create-push-${repo}-${sourceBranchName}`,
        fn: async () => {
          ctx.logger.info(`Pushing changes to branch ${sourceBranchName}`);
          return gitApi.createPush(push, repository.id!, project) as any;
        },
      });

      // Create the pull request
      const pullRequest: GitPullRequest = {
        sourceRefName: `refs/heads/${sourceBranchName}`,
        targetRefName: `refs/heads/${resolvedTargetBranchName}`,
        title,
        description,
        isDraft: draft,
        reviewers: (reviewers ?? [])
          .concat(assignees ?? [])
          .map(reviewer => ({ uniqueName: reviewer }))
          .concat(
            (teamReviewers ?? []).map(team => ({
              uniqueName: team,
              isContainer: true,
            })),
          ),
        labels: [{ name: 'devhub-generated' }], // Add label to the pull request
      };

      const existingPullRequests =
        (await gitApi.getPullRequests(
          repository.id!,
          {
            sourceRefName: `refs/heads/${sourceBranchName}`,
            targetRefName: `refs/heads/${resolvedTargetBranchName}`,
            status: PullRequestStatus.Active, // Filter for active pull requests
          },
          project,
        )) || [];
      if (existingPullRequests.length > 0) {
        const existingPullRequest = existingPullRequests[0];
        if (!existingPullRequest.pullRequestId) {
          throw new Error(
            `Pull request created without an ID: ${JSON.stringify(
              existingPullRequest,
            )}`,
          );
        }

        if (update) {
          await ctx.checkpoint({
            key: `update-pr-${repo}-${existingPullRequest.pullRequestId}`,
            fn: async () => {
              ctx.logger.info(
                `Updating existing pull request ${existingPullRequest.pullRequestId}`,
              );
              await gitApi.updatePullRequest(
                {
                  title,
                  description,
                  reviewers: (reviewers ?? [])
                    .concat(assignees ?? [])
                    .map(reviewer => ({ uniqueName: reviewer }))
                    .concat(
                      (teamReviewers ?? []).map(team => ({
                        uniqueName: team,
                        isContainer: true,
                      })),
                    ),
                },
                repository.id!,
                existingPullRequest.pullRequestId!,
                project,
              );
            },
          });
        } else {
          ctx.logger.info(
            `Pull request already exists: PR-${existingPullRequest.pullRequestId}`,
          );
        }

        ctx.output(
          'remoteUrl',
          getAzureRemotePullRequestUrl(
            host,
            organization,
            project,
            repo,
            existingPullRequest.pullRequestId,
          ),
        );
        ctx.output('pullRequestId', existingPullRequest.pullRequestId);
        ctx.output('targetBranchName', resolvedTargetBranchName);
      } else {
        const createdPullRequest = await ctx.checkpoint({
          key: `create-pr-${repo}-${sourceBranchName}`,
          fn: async () => {
            ctx.logger.info('Creating new pull request');
            return gitApi.createPullRequest(
              pullRequest,
              repository.id!,
              project,
            ) as any;
          },
        });
        if (!createdPullRequest.pullRequestId) {
          throw new Error(
            `Pull request created without an ID: ${JSON.stringify(
              createdPullRequest,
            )}`,
          );
        }
        ctx.logger.info(
          `Created pull request PR-${createdPullRequest.pullRequestId}`,
        );
        ctx.logger.debug(
          `Pull request created: ${JSON.stringify(
            createdPullRequest,
            null,
            2,
          )}`,
        );
        ctx.output(
          'remoteUrl',
          getAzureRemotePullRequestUrl(
            host,
            organization,
            project,
            repo,
            createdPullRequest.pullRequestId,
          ),
        );
        ctx.output('pullRequestId', createdPullRequest.pullRequestId);
        ctx.output('targetBranchName', resolvedTargetBranchName);
      }
    },
  });
}
