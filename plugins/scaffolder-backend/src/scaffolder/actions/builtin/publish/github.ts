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
    allowMergeCommit?: boolean;
    allowAutoMerge?: boolean;
    sourcePath?: string;
    requireCodeOwnerReviews?: boolean;
    requiredStatusCheckContexts?: string[];
    requireBranchesToBeUpToDate?: boolean;
    repoVisibility?: 'private' | 'internal' | 'public';
    collaborators?: Array<
      | {
          user: string;
          access: 'pull' | 'push' | 'admin' | 'maintain' | 'triage';
        }
      | {
          team: string;
          access: 'pull' | 'push' | 'admin' | 'maintain' | 'triage';
        }
      | {
          /** @deprecated This field is deprecated in favor of team */
          username: string;
          access: 'pull' | 'push' | 'admin' | 'maintain' | 'triage';
        }
    >;
    token?: string;
    topics?: string[];
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
          requireCodeOwnerReviews: inputProps.requireCodeOwnerReviews,
          requiredStatusCheckContexts: inputProps.requiredStatusCheckContexts,
          requireBranchesToBeUpToDate: inputProps.requireBranchesToBeUpToDate,
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
          allowRebaseMerge: inputProps.allowRebaseMerge,
          allowAutoMerge: inputProps.allowAutoMerge,
          sourcePath: inputProps.sourcePath,
          collaborators: inputProps.collaborators,
          token: inputProps.token,
          topics: inputProps.topics,
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
        requiredStatusCheckContexts = [],
        requireBranchesToBeUpToDate = true,
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
        allowRebaseMerge = true,
        allowAutoMerge = false,
        collaborators,
        topics,
        token: providedToken,
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
        allowRebaseMerge,
        allowAutoMerge,
        access,
        collaborators,
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
        requiredStatusCheckContexts,
        requireBranchesToBeUpToDate,
        config,
        ctx.logger,
        gitCommitMessage,
        gitAuthorName,
        gitAuthorEmail,
      );

      ctx.output('remoteUrl', remoteUrl);
      ctx.output('repoContentsUrl', repoContentsUrl);
    },
  });
}
