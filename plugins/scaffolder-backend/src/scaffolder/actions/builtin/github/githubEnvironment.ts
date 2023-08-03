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
import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import { ScmIntegrationRegistry } from '@backstage/integration';
import { parseRepoUrl } from '../publish/util';
import { getOctokitOptions } from './helpers';
import { Octokit } from 'octokit';
import Sodium from 'libsodium-wrappers';

/**
 * Creates an `github:environment:create` Scaffolder action that creates a Github Environment.
 *
 * @public
 */
export function createGithubEnvironmentAction(options: {
  integrations: ScmIntegrationRegistry;
}) {
  const { integrations } = options;
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
    environmentVariables?: { [key: string]: string };
    secrets?: { [key: string]: string };
    token?: string;
  }>({
    id: 'github:environment:create',
    description: 'Creates Deployment Environments',
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
        },
      },
    },
    async handler(ctx) {
      const {
        repoUrl,
        name,
        deploymentBranchPolicy,
        customBranchPolicyNames,
        environmentVariables,
        secrets,
        token: providedToken,
      } = ctx.input;

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

      await client.rest.repos.createOrUpdateEnvironment({
        owner: owner,
        repo: repo,
        environment_name: name,
        deployment_branch_policy: deploymentBranchPolicy ?? null,
      });

      if (customBranchPolicyNames) {
        for (const item of customBranchPolicyNames) {
          await client.rest.repos.createDeploymentBranchPolicy({
            owner: owner,
            repo: repo,
            environment_name: name,
            name: item,
          });
        }
      }

      for (const [key, value] of Object.entries(environmentVariables ?? {})) {
        await client.rest.actions.createEnvironmentVariable({
          repository_id: repository.data.id,
          environment_name: name,
          name: key,
          value,
        });
      }

      if (secrets) {
        const publicKeyResponse = await client.rest.actions.getRepoPublicKey({
          owner: owner,
          repo: repo,
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
