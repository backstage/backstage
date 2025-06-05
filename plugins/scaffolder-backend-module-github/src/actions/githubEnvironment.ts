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
import { getOctokitOptions } from '../util';
import { Octokit } from 'octokit';
import Sodium from 'libsodium-wrappers';
import { examples } from './gitHubEnvironment.examples';
import { Entity } from '@backstage/catalog-model';
import { CatalogService } from '@backstage/plugin-catalog-node';

/**
 * Creates an `github:environment:create` Scaffolder action that creates a Github Environment.
 *
 * @public
 */
export function createGithubEnvironmentAction(options: {
  integrations: ScmIntegrationRegistry;
  catalog: CatalogService;
}) {
  const { integrations, catalog } = options;
  // For more information on how to define custom actions, see
  //   https://backstage.io/docs/features/software-templates/writing-custom-actions
  return createTemplateAction({
    id: 'github:environment:create',
    description: 'Creates Deployment Environments',
    examples,
    schema: {
      input: {
        repoUrl: z =>
          z.string({
            description:
              'Accepts the format `github.com?repo=reponame&owner=owner` where `reponame` is the new repository name and `owner` is an organization or username',
          }),
        name: z =>
          z.string({
            description: `Name of the deployment environment to create`,
          }),
        deploymentBranchPolicy: z =>
          z
            .object(
              {
                protected_branches: z.boolean({
                  description:
                    'Whether only branches with branch protection rules can deploy to this environment. If `protected_branches` is `true`, `custom_branch_policies` must be `false`; if `protected_branches` is `false`, `custom_branch_policies` must be `true`.',
                }),
                custom_branch_policies: z.boolean({
                  description:
                    'Whether only branches that match the specified name patterns can deploy to this environment. If `custom_branch_policies` is `true`, `protected_branches` must be `false`; if `custom_branch_policies` is `false`, `protected_branches` must be `true`.',
                }),
              },
              {
                description:
                  'The type of deployment branch policy for this environment. To allow all branches to deploy, set to `null`.',
              },
            )
            .optional(),
        customBranchPolicyNames: z =>
          z
            .array(z.string(), {
              description: `The name pattern that branches must match in order to deploy to the environment.

Wildcard characters will not match \`/\`. For example, to match branches that begin with \`release/\` and contain an additional single slash, use \`release/*/*\`. For more information about pattern matching syntax, see the Ruby File.fnmatch documentation.`,
            })
            .optional(),
        customTagPolicyNames: z =>
          z
            .array(z.string(), {
              description: `The name pattern that tags must match in order to deploy to the environment.

Wildcard characters will not match \`/\`. For example, to match tags that begin with \`release/\` and contain an additional single slash, use \`release/*/*\`. For more information about pattern matching syntax, see the Ruby File.fnmatch documentation.`,
            })
            .optional(),
        environmentVariables: z =>
          z
            .record(z.string(), {
              description: `Environment variables attached to the deployment environment`,
            })
            .optional(),
        secrets: z =>
          z
            .record(z.string(), {
              description: `Secrets attached to the deployment environment`,
            })
            .optional(),
        token: z =>
          z
            .string({
              description: 'The token to use for authorization to GitHub',
            })
            .optional(),
        waitTimer: z =>
          z
            .number({
              description:
                'The time to wait before creating or updating the environment (in milliseconds)',
            })
            .optional(),
        preventSelfReview: z =>
          z
            .boolean({
              description:
                'Whether to prevent self-review for this environment',
            })
            .optional(),
        reviewers: z =>
          z
            .array(z.string(), {
              description:
                'Reviewers for this environment. Must be a list of Backstage entity references.',
            })
            .optional(),
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

      const { host, owner, repo } = parseRepoUrl(repoUrl, integrations);

      if (!owner) {
        throw new InputError(`No owner provided for repo ${repoUrl}`);
      }

      const octokitOptions = await getOctokitOptions({
        integrations,
        token: providedToken,
        host,
        owner,
        repo,
      });
      const client = new Octokit({
        ...octokitOptions,
        log: ctx.logger,
      });

      const repositoryId = await ctx.checkpoint({
        key: `get.repo.${owner}.${repo}`,
        fn: async () => {
          const repository = await client.rest.repos.get({
            owner: owner,
            repo: repo,
          });
          return repository.data.id;
        },
      });

      // convert reviewers from catalog entity to Github user or team
      const githubReviewers: { type: 'User' | 'Team'; id: number }[] = [];
      if (reviewers) {
        let reviewersEntityRefs: Array<Entity | undefined> = [];
        // Fetch reviewers from Catalog
        const catalogResponse = await catalog.getEntitiesByRefs(
          {
            entityRefs: reviewers,
          },
          {
            credentials: await ctx.getInitiatorCredentials(),
          },
        );
        if (catalogResponse?.items?.length) {
          reviewersEntityRefs = catalogResponse.items;
        }

        for (const reviewerEntityRef of reviewersEntityRefs) {
          if (reviewerEntityRef?.kind === 'User') {
            try {
              const userId = await ctx.checkpoint({
                key: `get.user.${reviewerEntityRef.metadata.name}`,
                fn: async () => {
                  const user = await client.rest.users.getByUsername({
                    username: reviewerEntityRef.metadata.name,
                  });
                  return user.data.id;
                },
              });

              githubReviewers.push({
                type: 'User',
                id: userId,
              });
            } catch (error) {
              ctx.logger.error('User not found:', error);
            }
          } else if (reviewerEntityRef?.kind === 'Group') {
            try {
              const teamId = await ctx.checkpoint({
                key: `get.team.${reviewerEntityRef.metadata.name}`,
                fn: async () => {
                  const team = await client.rest.teams.getByName({
                    org: owner,
                    team_slug: reviewerEntityRef.metadata.name,
                  });
                  return team.data.id;
                },
              });

              githubReviewers.push({
                type: 'Team',
                id: teamId,
              });
            } catch (error) {
              ctx.logger.error('Team not found:', error);
            }
          }
        }
      }

      await ctx.checkpoint({
        key: `create.or.update.environment.${owner}.${repo}.${name}`,
        fn: async () => {
          await client.rest.repos.createOrUpdateEnvironment({
            owner: owner,
            repo: repo,
            environment_name: name,
            deployment_branch_policy: deploymentBranchPolicy ?? undefined,
            wait_timer: waitTimer ?? undefined,
            prevent_self_review: preventSelfReview ?? undefined,
            reviewers: githubReviewers.length ? githubReviewers : undefined,
          });
        },
      });

      if (customBranchPolicyNames) {
        for (const item of customBranchPolicyNames) {
          await ctx.checkpoint({
            key: `create.deployment.branch.policy.branch.${owner}.${repo}.${name}.${item}`,
            fn: async () => {
              await client.rest.repos.createDeploymentBranchPolicy({
                owner: owner,
                repo: repo,
                type: 'branch',
                environment_name: name,
                name: item,
              });
            },
          });
        }
      }

      if (customTagPolicyNames) {
        for (const item of customTagPolicyNames) {
          await ctx.checkpoint({
            key: `create.deployment.branch.policy.tag.${owner}.${repo}.${name}.${item}`,
            fn: async () => {
              await client.rest.repos.createDeploymentBranchPolicy({
                owner: owner,
                repo: repo,
                type: 'tag',
                environment_name: name,
                name: item,
              });
            },
          });
        }
      }

      for (const [key, value] of Object.entries(environmentVariables ?? {})) {
        await ctx.checkpoint({
          key: `create.env.variable.${owner}.${repo}.${name}.${key}`,
          fn: async () => {
            await client.rest.actions.createEnvironmentVariable({
              repository_id: repositoryId,
              owner: owner,
              repo: repo,
              environment_name: name,
              name: key,
              value,
            });
          },
        });
      }

      if (secrets) {
        const { publicKey, publicKeyId } = await ctx.checkpoint({
          key: `get.env.public.key.${owner}.${repo}.${name}`,
          fn: async () => {
            const publicKeyResponse =
              await client.rest.actions.getEnvironmentPublicKey({
                repository_id: repositoryId,
                owner: owner,
                repo: repo,
                environment_name: name,
              });
            return {
              publicKey: publicKeyResponse.data.key,
              publicKeyId: publicKeyResponse.data.key_id,
            };
          },
        });

        await Sodium.ready;
        const binaryKey = Sodium.from_base64(
          publicKey,
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

          await ctx.checkpoint({
            key: `create.or.update.env.secret.${owner}.${repo}.${name}.${key}`,
            fn: async () => {
              await client.rest.actions.createOrUpdateEnvironmentSecret({
                repository_id: repositoryId,
                owner: owner,
                repo: repo,
                environment_name: name,
                secret_name: key,
                encrypted_value: encryptedBase64Secret,
                key_id: publicKeyId,
              });
            },
          });
        }
      }
    },
  });
}
