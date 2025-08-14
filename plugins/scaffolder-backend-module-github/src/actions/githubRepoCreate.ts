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

import { InputError } from '@backstage/errors';
import {
  GithubCredentialsProvider,
  ScmIntegrationRegistry,
} from '@backstage/integration';
import { Octokit } from 'octokit';
import {
  createTemplateAction,
  parseRepoUrl,
} from '@backstage/plugin-scaffolder-node';
import { createGithubRepoWithCollaboratorsAndTopics } from './helpers';
import { getOctokitOptions } from '../util';
import * as inputProps from './inputProperties';
import * as outputProps from './outputProperties';
import { examples } from './githubRepoCreate.examples';

/**
 * Creates a new action that initializes a git repository
 *
 * @public
 */
export function createGithubRepoCreateAction(options: {
  integrations: ScmIntegrationRegistry;
  githubCredentialsProvider?: GithubCredentialsProvider;
}) {
  const { integrations, githubCredentialsProvider } = options;

  return createTemplateAction({
    id: 'github:repo:create',
    description: 'Creates a GitHub repository.',
    examples,
    schema: {
      input: {
        repoUrl: inputProps.repoUrl,
        description: inputProps.description,
        homepage: inputProps.homepage,
        access: inputProps.access,
        requireCodeOwnerReviews: inputProps.requireCodeOwnerReviews,
        bypassPullRequestAllowances: inputProps.bypassPullRequestAllowances,
        requiredApprovingReviewCount: inputProps.requiredApprovingReviewCount,
        restrictions: inputProps.restrictions,
        requiredStatusCheckContexts: inputProps.requiredStatusCheckContexts,
        requireBranchesToBeUpToDate: inputProps.requireBranchesToBeUpToDate,
        requiredConversationResolution:
          inputProps.requiredConversationResolution,
        repoVisibility: inputProps.repoVisibility,
        deleteBranchOnMerge: inputProps.deleteBranchOnMerge,
        allowMergeCommit: inputProps.allowMergeCommit,
        allowSquashMerge: inputProps.allowSquashMerge,
        squashMergeCommitTitle: inputProps.squashMergeCommitTitle,
        squashMergeCommitMessage: inputProps.squashMergeCommitMessage,
        allowRebaseMerge: inputProps.allowRebaseMerge,
        allowAutoMerge: inputProps.allowAutoMerge,
        allowUpdateBranch: inputProps.allowUpdateBranch,
        collaborators: inputProps.collaborators,
        hasProjects: inputProps.hasProjects,
        hasWiki: inputProps.hasWiki,
        hasIssues: inputProps.hasIssues,
        token: inputProps.token,
        topics: inputProps.topics,
        repoVariables: inputProps.repoVariables,
        secrets: inputProps.secrets,
        oidcCustomization: inputProps.oidcCustomization,
        requiredCommitSigning: inputProps.requiredCommitSigning,
        requiredLinearHistory: inputProps.requiredLinearHistory,
        customProperties: inputProps.customProperties,
        subscribe: inputProps.subscribe,
      },
      output: {
        remoteUrl: outputProps.remoteUrl,
        repoContentsUrl: outputProps.repoContentsUrl,
      },
    },
    async handler(ctx) {
      const {
        repoUrl,
        description,
        homepage,
        access,
        repoVisibility = 'private',
        deleteBranchOnMerge = false,
        allowMergeCommit = true,
        allowSquashMerge = true,
        squashMergeCommitTitle = 'COMMIT_OR_PR_TITLE',
        squashMergeCommitMessage = 'COMMIT_MESSAGES',
        allowRebaseMerge = true,
        allowAutoMerge = false,
        allowUpdateBranch = false,
        collaborators,
        hasProjects = undefined,
        hasWiki = undefined,
        hasIssues = undefined,
        topics,
        repoVariables,
        secrets,
        oidcCustomization,
        customProperties,
        subscribe,
        token: providedToken,
      } = ctx.input;

      const { host, owner, repo } = parseRepoUrl(repoUrl, integrations);

      if (!owner) {
        throw new InputError('Invalid repository owner provided in repoUrl');
      }

      const octokitOptions = await getOctokitOptions({
        integrations,
        credentialsProvider: githubCredentialsProvider,
        token: providedToken,
        host,
        owner,
        repo,
      });
      const client = new Octokit({
        ...octokitOptions,
        log: ctx.logger,
      });

      const remoteUrl = await ctx.checkpoint({
        key: `create.repo.and.topics.${owner}.${repo}`,
        fn: async () => {
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
            allowUpdateBranch,
            access,
            collaborators,
            hasProjects,
            hasWiki,
            hasIssues,
            topics,
            repoVariables,
            secrets,
            oidcCustomization,
            customProperties,
            subscribe,
            ctx.logger,
          );
          return newRepo.clone_url;
        },
      });

      ctx.output('remoteUrl', remoteUrl);
    },
  });
}
