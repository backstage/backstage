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
import { createTemplateAction } from '../../createTemplateAction';
import { parseRepoUrl } from '../publish/util';
import {
  createGithubTemplateRepoWithCollaboratorsAndTopics,
  getOctokitOptions,
} from './helpers';
import * as inputProps from './inputProperties';
import * as outputProps from './outputProperties';

/**
 * Creates a new action that initializes a git repository
 *
 * @public
 */
export function createGithubTemplateRepoCreateAction(options: {
  integrations: ScmIntegrationRegistry;
  githubCredentialsProvider?: GithubCredentialsProvider;
}) {
  const { integrations, githubCredentialsProvider } = options;

  return createTemplateAction<{
    repoUrl: string;
    templateOwner: string;
    templateRepo: string;
    description?: string;
    access?: string;
    repoVisibility?: 'private' | 'public';
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
  }>({
    id: 'github:template-repo:create',
    description: 'Creates a GitHub Template repository.',
    schema: {
      input: {
        type: 'object',
        required: ['repoUrl', 'templateOwner', 'templateRepo'],
        properties: {
          repoUrl: inputProps.repoUrl,
          templateOwner: inputProps.templateOwner,
          templateRepo: inputProps.templateRepo,
          description: inputProps.description,
          access: inputProps.access,
          collaborators: inputProps.collaborators,
          token: inputProps.token,
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
        templateOwner,
        templateRepo,
        description,
        repoVisibility = 'private',
        access,
        collaborators,
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

      const newRepo = await createGithubTemplateRepoWithCollaboratorsAndTopics(
        client,
        repo,
        owner,
        templateOwner,
        templateRepo,
        repoVisibility,
        description,
        access,
        collaborators,
        ctx.logger,
      );

      ctx.output('remoteUrl', newRepo.clone_url);
    },
  });
}
