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
import { Config } from '@backstage/config';
import { InputError } from '@backstage/errors';
import {
  GithubCredentialsProvider,
  ScmIntegrationRegistry,
} from '@backstage/integration';
import { Octokit } from 'octokit';
import { createTemplateAction } from '../../createTemplateAction';
import {
  createGithubRepoWithCollaboratorsAndTopics,
  getOctokitOptions,
  initRepoPushAndProtect,
} from '../github/helpers';
import * as inputProps from '../github/inputProperties';
import * as outputProps from '../github/outputProperties';
import { parseRepoUrl } from './util';

/**
 * Creates a new action that initializes a git repository of the content in the workspace
 * and publishes it to GitHub.
 *
 * @public
 */
export function createPublishGithubAction(options: {
  integrations: ScmIntegrationRegistry;
  config: Config;
  githubCredentialsProvider?: GithubCredentialsProvider;
}) {
  const { integrations, config, githubCredentialsProvider } = options;

  return createTemplateAction<{
    repoUrl: string;
    description?: string;
    homepage?: string;
    access?: string;
    defaultBranch?: string;
    protectDefaultBranch?: boolean;
    protectEnforceAdmins?: boolean;
    deleteBranchOnMerge?: boolean;
    gitCommitMessage?: string;
    gitAuthorName?: string;
    gitAuthorEmail?: string;
    allowRebaseMerge?: boolean;
    allowSquashMerge?: boolean;
    squashMergeCommitTitle?: 'PR_TITLE' | 'COMMIT_OR_PR_TITLE';
    squashMergeCommitMessage?: 'PR_BODY' | 'COMMIT_MESSAGES' | 'BLANK';
    allowMergeCommit?: boolean;
    allowAutoMerge?: boolean;
    sourcePath?: string;
    bypassPullRequestAllowances?:
      | {
          users?: string[];
          teams?: string[];
          apps?: string[];
        }
      | undefined;
    requiredApprovingReviewCount?: number;
    restrictions?:
      | {
          users: string[];
          teams: string[];
          apps?: string[];
        }
      | undefined;
    requireCodeOwnerReviews?: boolean;
    dismissStaleReviews?: boolean;
    requiredStatusCheckContexts?: string[];
    requireBranchesToBeUpToDate?: boolean;
    requiredConversationResolution?: boolean;
    repoVisibility?: 'private' | 'internal' | 'public';
    collaborators?: Array<
      | {
          user: string;
          access: string;
        }
      | {
          team: string;
          access: string;
        }
      | {
          /** @deprecated This field is deprecated in favor of team */
          username: string;
          access: 'pull' | 'push' | 'admin' | 'maintain' | 'triage';
        }
    >;
    hasProjects?: boolean | undefined;
    hasWiki?: boolean | undefined;
    hasIssues?: boolean | undefined;
    token?: string;
    topics?: string[];
    requiredCommitSigning?: boolean;
  }>({
    id: 'publish:github',
    description:
      'Initializes a git repository of contents in workspace and publishes it to GitHub.',
    schema: {
      input: {
        type: 'object',
        required: ['repoUrl'],
        properties: {
          repoUrl: inputProps.repoUrl,
          description: inputProps.description,
          homepage: inputProps.homepage,
          access: inputProps.access,
          bypassPullRequestAllowances: inputProps.bypassPullRequestAllowances,
          requiredApprovingReviewCount: inputProps.requiredApprovingReviewCount,
          restrictions: inputProps.restrictions,
          requireCodeOwnerReviews: inputProps.requireCodeOwnerReviews,
          dismissStaleReviews: inputProps.dismissStaleReviews,
          requiredStatusCheckContexts: inputProps.requiredStatusCheckContexts,
          requireBranchesToBeUpToDate: inputProps.requireBranchesToBeUpToDate,
          requiredConversationResolution:
            inputProps.requiredConversationResolution,
          repoVisibility: inputProps.repoVisibility,
          defaultBranch: inputProps.defaultBranch,
          protectDefaultBranch: inputProps.protectDefaultBranch,
          protectEnforceAdmins: inputProps.protectEnforceAdmins,
          deleteBranchOnMerge: inputProps.deleteBranchOnMerge,
          gitCommitMessage: inputProps.gitCommitMessage,
          gitAuthorName: inputProps.gitAuthorName,
          gitAuthorEmail: inputProps.gitAuthorEmail,
          allowMergeCommit: inputProps.allowMergeCommit,
          allowSquashMerge: inputProps.allowSquashMerge,
          squashMergeCommitTitle: inputProps.squashMergeCommitTitle,
          squashMergeCommitMessage: inputProps.squashMergeCommitMessage,
          allowRebaseMerge: inputProps.allowRebaseMerge,
          allowAutoMerge: inputProps.allowAutoMerge,
          sourcePath: inputProps.sourcePath,
          collaborators: inputProps.collaborators,
          hasProjects: inputProps.hasProjects,
          hasWiki: inputProps.hasWiki,
          hasIssues: inputProps.hasIssues,
          token: inputProps.token,
          topics: inputProps.topics,
          requiredCommitSigning: inputProps.requiredCommitSigning,
        },
      },
      output: {
        type: 'object',
        properties: {
          remoteUrl: outputProps.remoteUrl,
          repoContentsUrl: outputProps.repoContentsUrl,
        },
      },
    },
    async handler(ctx) {
      const {
        repoUrl,
        description,
        homepage,
        access,
        requireCodeOwnerReviews = false,
        dismissStaleReviews = false,
        bypassPullRequestAllowances,
        requiredApprovingReviewCount = 1,
        restrictions,
        requiredStatusCheckContexts = [],
        requireBranchesToBeUpToDate = true,
        requiredConversationResolution = false,
        repoVisibility = 'private',
        defaultBranch = 'master',
        protectDefaultBranch = true,
        protectEnforceAdmins = true,
        deleteBranchOnMerge = false,
        gitCommitMessage = 'initial commit',
        gitAuthorName,
        gitAuthorEmail,
        allowMergeCommit = true,
        allowSquashMerge = true,
        squashMergeCommitTitle = 'COMMIT_OR_PR_TITLE',
        squashMergeCommitMessage = 'COMMIT_MESSAGES',
        allowRebaseMerge = true,
        allowAutoMerge = false,
        collaborators,
        hasProjects = undefined,
        hasWiki = undefined,
        hasIssues = undefined,
        topics,
        token: providedToken,
        requiredCommitSigning = false,
      } = ctx.input;

      const octokitOptions = await getOctokitOptions({
        integrations,
        credentialsProvider: githubCredentialsProvider,
        token: providedToken,
        repoUrl: repoUrl,
      });
      const client = new Octokit(octokitOptions);

      const { owner, repo } = parseRepoUrl(repoUrl, integrations);

      if (!owner) {
        throw new InputError('Invalid repository owner provided in repoUrl');
      }

      const newRepo = await createGithubRepoWithCollaboratorsAndTopics(
        client,
        repo,
        owner,
        repoVisibility,
        description,
        homepage,
        deleteBranchOnMerge,
        allowMergeCommit,
        allowSquashMerge,
        squashMergeCommitTitle,
        squashMergeCommitMessage,
        allowRebaseMerge,
        allowAutoMerge,
        access,
        collaborators,
        hasProjects,
        hasWiki,
        hasIssues,
        topics,
        ctx.logger,
      );

      const remoteUrl = newRepo.clone_url;
      const repoContentsUrl = `${newRepo.html_url}/blob/${defaultBranch}`;

      await initRepoPushAndProtect(
        remoteUrl,
        octokitOptions.auth,
        ctx.workspacePath,
        ctx.input.sourcePath,
        defaultBranch,
        protectDefaultBranch,
        protectEnforceAdmins,
        owner,
        client,
        repo,
        requireCodeOwnerReviews,
        bypassPullRequestAllowances,
        requiredApprovingReviewCount,
        restrictions,
        requiredStatusCheckContexts,
        requireBranchesToBeUpToDate,
        requiredConversationResolution,
        config,
        ctx.logger,
        gitCommitMessage,
        gitAuthorName,
        gitAuthorEmail,
        dismissStaleReviews,
        requiredCommitSigning,
      );

      ctx.output('remoteUrl', remoteUrl);
      ctx.output('repoContentsUrl', repoContentsUrl);
    },
  });
}
