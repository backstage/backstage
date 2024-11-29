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
  createTemplateAction,
  parseRepoUrl,
} from '@backstage/plugin-scaffolder-node';
import { ScmIntegrationRegistry } from '@backstage/integration';
import { getOctokitOptions } from './helpers';
import { Octokit } from 'octokit';
import Sodium from 'libsodium-wrappers';
import { examples } from './gitHubEnvironment.examples';
import { CatalogApi } from '@backstage/catalog-client';
import { Entity } from '@backstage/catalog-model';

/**
 * Creates an `github:environment:create` Scaffolder action that creates a Github Environment.
 *
 * @public
 */
export function createGithubEnvironmentAction(options: {
  integrations: ScmIntegrationRegistry;
  catalogClient?: CatalogApi;
}) {
  const { integrations, catalogClient } = options;
  // For more information on how to define custom actions, see
  //   https://backstage.io/docs/features/software-templates/writing-custom-actions
  return createTemplateAction<{
    repoUrl: string;
    name: string;
    deploymentBranchPolicy?: {
      protected_branches: boolean;
      custom_branch_policies: boolean;
    };
    customBranchPolicyNames?: string[];
    customTagPolicyNames?: string[];
    environmentVariables?: { [key: string]: string };
    secrets?: { [key: string]: string };
    token?: string;
    waitTimer?: number;
    preventSelfReview?: boolean;
    reviewers?: string[];
  }>({
    id: 'github:environment:create',
    description: 'Creates Deployment Environments',
    examples,
    schema: {
      input: {
        type: 'object',
        required: ['repoUrl', 'name'],
        properties: {
          repoUrl: {
            title: 'Repository Location',
            description: `Accepts the format 'github.com?repo=reponame&owner=owner' where 'reponame' is the new repository name and 'owner' is an organization or username`,
            type: 'string',
          },
          name: {
            title: 'Environment Name',
            description: `Name of the deployment environment to create`,
            type: 'string',
          },
          deploymentBranchPolicy: {
            title: 'Deployment Branch Policy',
            description: `The type of deployment branch policy for this environment. To allow all branches to deploy, set to null.`,
            type: 'object',
            required: ['protected_branches', 'custom_branch_policies'],
            properties: {
              protected_branches: {
                title: 'Protected Branches',
                description: `Whether only branches with branch protection rules can deploy to this environment. If protected_branches is true, custom_branch_policies must be false; if protected_branches is false, custom_branch_policies must be true.`,
                type: 'boolean',
              },
              custom_branch_policies: {
                title: 'Custom Branch Policies',
                description: `Whether only branches that match the specified name patterns can deploy to this environment. If custom_branch_policies is true, protected_branches must be false; if custom_branch_policies is false, protected_branches must be true.`,
                type: 'boolean',
              },
            },
          },
          customBranchPolicyNames: {
            title: 'Custom Branch Policy Name',
            description: `The name pattern that branches must match in order to deploy to the environment.

            Wildcard characters will not match /. For example, to match branches that begin with release/ and contain an additional single slash, use release/*/*. For more information about pattern matching syntax, see the Ruby File.fnmatch documentation.`,
            type: 'array',
            items: {
              type: 'string',
            },
          },
          customTagPolicyNames: {
            title: 'Custom Tag Policy Name',
            description: `The name pattern that tags must match in order to deploy to the environment.

            Wildcard characters will not match /. For example, to match tags that begin with release/ and contain an additional single slash, use release/*/*. For more information about pattern matching syntax, see the Ruby File.fnmatch documentation.`,
            type: 'array',
            items: {
              type: 'string',
            },
          },
          environmentVariables: {
            title: 'Environment Variables',
            description: `Environment variables attached to the deployment environment`,
            type: 'object',
          },
          secrets: {
            title: 'Deployment Secrets',
            description: `Secrets attached to the deployment environment`,
            type: 'object',
          },
          token: {
            title: 'Authentication Token',
            type: 'string',
            description: 'The token to use for authorization to GitHub',
          },
          waitTimer: {
            title: 'Wait Timer',
            type: 'integer',
            description:
              'The time to wait before creating or updating the environment (in milliseconds)',
          },
          preventSelfReview: {
            title: 'Prevent Self Review',
            type: 'boolean',
            description: 'Whether to prevent self-review for this environment',
          },
          reviewers: {
            title: 'Reviewers',
            type: 'array',
            description: 'Reviewers for this environment',
            items: {
              type: 'string',
            },
          },
        },
      },
    },
    async handler(ctx) {
      const {
        repoUrl,
        name,
        deploymentBranchPolicy,
        customBranchPolicyNames,
        customTagPolicyNames,
        environmentVariables,
        secrets,
        token: providedToken,
        waitTimer,
        preventSelfReview,
        reviewers,
      } = ctx.input;

      // When environment creation step is executed right after a repo publish step, the repository might not be available immediately.
      // Add a 2-second delay before initiating the steps in this action.
      await new Promise(resolve => setTimeout(resolve, 2000));

      const octokitOptions = await getOctokitOptions({
        integrations,
        token: providedToken,
        repoUrl: repoUrl,
      });

      const { owner, repo } = parseRepoUrl(repoUrl, integrations);

      if (!owner) {
        throw new InputError(`No owner provided for repo ${repoUrl}`);
      }

      const client = new Octokit(octokitOptions);
      const repository = await client.rest.repos.get({
        owner: owner,
        repo: repo,
      });

      // convert reviewers from catalog entity to Github user or team
      const githubReviewers: { type: 'User' | 'Team'; id: number }[] = [];
      if (reviewers) {
        let reviewersEntityRefs: Array<Entity | undefined> = [];
        // Fetch reviewers from Catalog
        const catalogResponse = await catalogClient?.getEntitiesByRefs({
          entityRefs: reviewers,
        });
        if (catalogResponse?.items?.length) {
          reviewersEntityRefs = catalogResponse.items;
        }

        for (const reviewerEntityRef of reviewersEntityRefs) {
          if (reviewerEntityRef?.kind === 'User') {
            try {
              const user = await client.rest.users.getByUsername({
                username: reviewerEntityRef.metadata.name,
              });
              githubReviewers.push({
                type: 'User',
                id: user.data.id,
              });
            } catch (error) {
              ctx.logger.error('User not found:', error);
            }
          } else if (reviewerEntityRef?.kind === 'Group') {
            try {
              const team = await client.rest.teams.getByName({
                org: owner,
                team_slug: reviewerEntityRef.metadata.name,
              });
              githubReviewers.push({
                type: 'Team',
                id: team.data.id,
              });
            } catch (error) {
              ctx.logger.error('Team not found:', error);
            }
          }
        }
      }

      await client.rest.repos.createOrUpdateEnvironment({
        owner: owner,
        repo: repo,
        environment_name: name,
        deployment_branch_policy: deploymentBranchPolicy ?? null,
        wait_timer: waitTimer ?? 0,
        prevent_self_review: preventSelfReview ?? false,
        reviewers: githubReviewers.length ? githubReviewers : null,
      });

      if (customBranchPolicyNames) {
        for (const item of customBranchPolicyNames) {
          await client.rest.repos.createDeploymentBranchPolicy({
            owner: owner,
            repo: repo,
            type: 'branch',
            environment_name: name,
            name: item,
          });
        }
      }

      if (customTagPolicyNames) {
        for (const item of customTagPolicyNames) {
          await client.rest.repos.createDeploymentBranchPolicy({
            owner: owner,
            repo: repo,
            type: 'tag',
            environment_name: name,
            name: item,
          });
        }
      }

      for (const [key, value] of Object.entries(environmentVariables ?? {})) {
        await client.rest.actions.createEnvironmentVariable({
          repository_id: repository.data.id,
          owner: owner,
          repo: repo,
          environment_name: name,
          name: key,
          value,
        });
      }

      if (secrets) {
        const publicKeyResponse =
          await client.rest.actions.getEnvironmentPublicKey({
            repository_id: repository.data.id,
            owner: owner,
            repo: repo,
            environment_name: name,
          });

        await Sodium.ready;
        const binaryKey = Sodium.from_base64(
          publicKeyResponse.data.key,
          Sodium.base64_variants.ORIGINAL,
        );
        for (const [key, value] of Object.entries(secrets)) {
          const binarySecret = Sodium.from_string(value);
          const encryptedBinarySecret = Sodium.crypto_box_seal(
            binarySecret,
            binaryKey,
          );
          const encryptedBase64Secret = Sodium.to_base64(
            encryptedBinarySecret,
            Sodium.base64_variants.ORIGINAL,
          );

          await client.rest.actions.createOrUpdateEnvironmentSecret({
            repository_id: repository.data.id,
            owner: owner,
            repo: repo,
            environment_name: name,
            secret_name: key,
            encrypted_value: encryptedBase64Secret,
            key_id: publicKeyResponse.data.key_id,
          });
        }
      }
    },
  });
}
