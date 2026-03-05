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
import { ScmIntegrationRegistry } from '@backstage/integration';
import {
  createTemplateAction,
  getRepoSourceDirectory,
  initRepoAndPush,
  parseRepoUrl,
} from '@backstage/plugin-scaffolder-node';
import { Gitlab, VariableType } from '@gitbeaker/rest';
import { Config } from '@backstage/config';
import { examples } from './gitlab.examples';

/**
 * Creates a new action that initializes a git repository of the content in the workspace
 * and publishes it to GitLab.
 *
 * @public
 */
export function createPublishGitlabAction(options: {
  integrations: ScmIntegrationRegistry;
  config: Config;
}) {
  const { integrations, config } = options;

  return createTemplateAction({
    id: 'publish:gitlab',
    description:
      'Initializes a git repository of the content in the workspace, and publishes it to GitLab.',
    examples,
    schema: {
      input: {
        repoUrl: z =>
          z.string({
            description: `Accepts the format 'gitlab.com?repo=project_name&owner=group_name' where 'project_name' is the repository name and 'group_name' is a group or username`,
          }),
        repoVisibility: z =>
          z
            .enum(['private', 'public', 'internal'], {
              description: `Sets the visibility of the repository. The default value is 'private'. (deprecated, use settings.visibility instead)`,
            })
            .optional(),
        defaultBranch: z =>
          z
            .string({
              description: `Sets the default branch on the repository. The default value is 'master'`,
            })
            .optional(),
        gitCommitMessage: z =>
          z
            .string({
              description: `Sets the commit message on the repository. The default value is 'initial commit'`,
            })
            .optional(),
        gitAuthorName: z =>
          z
            .string({
              description: `Sets the default author name for the commit. The default value is 'Scaffolder'`,
            })
            .optional(),
        gitAuthorEmail: z =>
          z
            .string({
              description: `Sets the default author email for the commit.`,
            })
            .optional(),
        signCommit: z =>
          z
            .boolean({
              description: 'Sign commit with configured PGP private key',
            })
            .optional(),
        sourcePath: z =>
          z
            .union([z.string(), z.boolean()], {
              description:
                'Path within the workspace that will be used as the repository root. If omitted or set to true, the entire workspace will be published as the repository. If set to false, the created repository will be empty.',
            })
            .optional(),
        skipExisting: z =>
          z
            .boolean({
              description:
                'Do not publish the repository if it already exists. The default value is false.',
            })
            .optional(),
        token: z =>
          z
            .string({
              description: 'The token to use for authorization to GitLab',
            })
            .optional(),
        setUserAsOwner: z =>
          z
            .boolean({
              description:
                'Set the token user as owner of the newly created repository. Requires a token authorized to do the edit in the integration configuration for the matching host',
            })
            .optional(),
        topics: z =>
          z
            .array(z.string(), {
              description:
                'Topic labels to apply on the repository. (deprecated, use settings.topics instead)',
            })
            .optional(),
        settings: z =>
          z
            .object({
              path: z
                .string({
                  description:
                    'Repository name for new project. Generated based on name if not provided (generated as lowercase with dashes).',
                })
                .optional(),
              auto_devops_enabled: z
                .boolean({
                  description: 'Enable Auto DevOps for this project',
                })
                .optional(),
              ci_config_path: z
                .string({
                  description: 'Custom CI config path for this project',
                })
                .optional(),
              description: z
                .string({
                  description: 'Short project description',
                })
                .optional(),
              merge_method: z
                .enum(['merge', 'rebase_merge', 'ff'], {
                  description: 'Merge Methods (merge, rebase_merge, ff)',
                })
                .optional(),
              squash_option: z
                .enum(['default_off', 'default_on', 'never', 'always'], {
                  description:
                    'Set squash option for the project (never, always, default_on, default_off)',
                })
                .optional(),
              topics: z
                .array(z.string(), {
                  description: 'Topic labels to apply on the repository',
                })
                .optional(),
              visibility: z
                .enum(['private', 'public', 'internal'], {
                  description:
                    'The visibility of the project. Can be private, internal, or public. The default value is private.',
                })
                .optional(),
              only_allow_merge_if_all_discussions_are_resolved: z
                .boolean({
                  description:
                    'Set whether merge requests can only be merged when all the discussions are resolved.',
                })
                .optional(),
              only_allow_merge_if_pipeline_succeeds: z
                .boolean({
                  description:
                    'Set whether merge requests can only be merged with successful pipelines. This setting is named Pipelines must succeed in the project settings.',
                })
                .optional(),
              allow_merge_on_skipped_pipeline: z
                .boolean({
                  description:
                    'Set whether or not merge requests can be merged with skipped jobs.',
                })
                .optional(),
            })
            .optional(),
        branches: z =>
          z
            .array(
              z.object({
                name: z.string(),
                protect: z.boolean().optional(),
                create: z.boolean().optional(),
                ref: z.string().optional(),
              }),
            )
            .optional(),
        projectVariables: z =>
          z
            .array(
              z.object({
                key: z.string(),
                value: z.string(),
                description: z.string().optional(),
                variable_type: z.enum(['env_var', 'file']).optional(),
                protected: z.boolean().optional(),
                masked: z.boolean().optional(),
                masked_and_hidden: z.boolean().optional(),
                raw: z.boolean().optional(),
                environment_scope: z.string().optional(),
              }),
            )
            .optional(),
      },
      output: {
        remoteUrl: z =>
          z.string({
            description: 'A URL to the repository with the provider',
          }),
        repoContentsUrl: z =>
          z.string({
            description: 'A URL to the root of the repository',
          }),
        projectId: z =>
          z.number({
            description: 'The ID of the project',
          }),
        commitHash: z =>
          z.string({
            description: 'The git commit hash of the initial commit',
          }),
        created: z =>
          z.boolean({
            description: 'Whether the repository was created or not',
          }),
      },
    },
    async handler(ctx) {
      const {
        repoUrl,
        repoVisibility = 'private',
        defaultBranch = 'master',
        gitCommitMessage = 'initial commit',
        gitAuthorName,
        gitAuthorEmail,
        setUserAsOwner = false,
        topics = [],
        settings = {},
        branches = [],
        projectVariables = [],
        skipExisting = false,
        signCommit,
      } = ctx.input;
      const { owner, repo, host } = parseRepoUrl(repoUrl, integrations);

      if (!owner) {
        throw new InputError(
          `No owner provided for host: ${host}, and repo ${repo}`,
        );
      }

      const integrationConfig = integrations.gitlab.byHost(host);

      if (!integrationConfig) {
        throw new InputError(
          `No matching integration configuration for host ${host}, please check your integrations config`,
        );
      }

      if (!integrationConfig.config.token && !ctx.input.token) {
        throw new InputError(`No token available for host ${host}`);
      }

      const token = ctx.input.token || integrationConfig.config.token!;
      const tokenType = ctx.input.token ? 'oauthToken' : 'token';

      const client = new Gitlab({
        host: integrationConfig.config.baseUrl,
        [tokenType]: token,
      });

      let targetNamespaceId;
      let targetNamespaceKind;
      try {
        const namespaceResponse = (await client.Namespaces.show(owner)) as {
          id: number;
          kind: string;
        };

        targetNamespaceId = namespaceResponse.id;
        targetNamespaceKind = namespaceResponse.kind;
      } catch (e) {
        if (e.cause?.response?.status === 404) {
          throw new InputError(
            `The namespace ${owner} is not found or the user doesn't have permissions to access it`,
          );
        }
        throw e;
      }

      const { id: userId } = (await client.Users.showCurrentUser()) as {
        id: number;
      };

      if (!targetNamespaceId) {
        targetNamespaceId = userId;
        targetNamespaceKind = 'user';
      }

      const existingProjects =
        targetNamespaceKind === 'user'
          ? await client.Users.allProjects(owner, { search: repo })
          : await client.Groups.allProjects(owner, { search: repo });

      const existingProject = existingProjects.find(
        project => project.path === repo,
      );

      if (!skipExisting || (skipExisting && !existingProject)) {
        ctx.logger.info(`Creating repo ${repo} in namespace ${owner}.`);
        const { id: projectId, http_url_to_repo } =
          await client.Projects.create({
            namespaceId: targetNamespaceId,
            name: repo,
            visibility: repoVisibility,
            ...(topics.length ? { topics } : {}),
            ...(Object.keys(settings).length ? { ...settings } : {}),
          });

        // When setUserAsOwner is true the input token is expected to come from an unprivileged user GitLab
        // OAuth flow. In this case GitLab works in a way that allows the unprivileged user to
        // create the repository, but not to push the default protected branch (e.g. master).
        // In order to set the user as owner of the newly created repository we need to check that the
        // GitLab integration configuration for the matching host contains a token and use
        // such token to bootstrap a new privileged client.
        if (setUserAsOwner && integrationConfig.config.token) {
          const adminClient = new Gitlab({
            host: integrationConfig.config.baseUrl,
            token: integrationConfig.config.token,
          });

          await adminClient.ProjectMembers.add(projectId, 50, { userId });
        }

        const remoteUrl = (http_url_to_repo as string).replace(/\.git$/, '');
        const repoContentsUrl = `${remoteUrl}/-/blob/${defaultBranch}`;

        const gitAuthorInfo = {
          name: gitAuthorName
            ? gitAuthorName
            : config.getOptionalString('scaffolder.defaultAuthor.name'),
          email: gitAuthorEmail
            ? gitAuthorEmail
            : config.getOptionalString('scaffolder.defaultAuthor.email'),
        };
        const signingKey =
          integrationConfig.config.commitSigningKey ??
          config.getOptionalString('scaffolder.defaultCommitSigningKey');
        if (signCommit && !signingKey) {
          throw new Error(
            'Signing commits is enabled but no signing key is provided in the configuration',
          );
        }

        const shouldSkipPublish =
          typeof ctx.input.sourcePath === 'boolean' && !ctx.input.sourcePath;
        if (!shouldSkipPublish) {
          const commitResult = await initRepoAndPush({
            dir:
              typeof ctx.input.sourcePath === 'boolean'
                ? ctx.workspacePath
                : getRepoSourceDirectory(
                    ctx.workspacePath,
                    ctx.input.sourcePath,
                  ),
            remoteUrl: http_url_to_repo as string,
            defaultBranch,
            auth: {
              username: 'oauth2',
              password: token,
            },
            logger: ctx.logger,
            commitMessage: gitCommitMessage
              ? gitCommitMessage
              : config.getOptionalString('scaffolder.defaultCommitMessage'),
            gitAuthorInfo,
            signingKey: signCommit ? signingKey : undefined,
          });

          if (branches) {
            for (const branch of branches) {
              const {
                name,
                protect = false,
                create = false,
                ref = 'master',
              } = branch;

              if (create) {
                try {
                  await client.Branches.create(projectId, name, ref);
                } catch (e) {
                  throw new InputError(
                    `Branch creation failed for ${name}. ${printGitlabError(
                      e,
                    )}`,
                  );
                }
                ctx.logger.info(
                  `Branch ${name} created for ${projectId} with ref ${ref}`,
                );
              }

              if (protect) {
                try {
                  await client.ProtectedBranches.protect(projectId, name);
                } catch (e) {
                  throw new InputError(
                    `Branch protection failed for ${name}. ${printGitlabError(
                      e,
                    )}`,
                  );
                }
                ctx.logger.info(`Branch ${name} protected for ${projectId}`);
              }
            }
          }
          ctx.output('commitHash', commitResult?.commitHash);
        }

        if (projectVariables) {
          for (const variable of projectVariables) {
            const variableWithDefaults = Object.assign(variable, {
              variable_type: (variable.variable_type ??
                'env_var') as VariableType,
              protected: variable.protected ?? false,
              masked: variable.masked ?? false,
              masked_and_hidden: variable.masked_and_hidden ?? false,
              raw: variable.raw ?? false,
              environment_scope: variable.environment_scope ?? '*',
            });

            try {
              await client.ProjectVariables.create(
                projectId,
                variableWithDefaults.key,
                variableWithDefaults.value,
                {
                  variableType: variableWithDefaults.variable_type,
                  protected: variableWithDefaults.protected,
                  masked: variableWithDefaults.masked,
                  masked_and_hidden: variableWithDefaults.masked_and_hidden,
                  environmentScope: variableWithDefaults.environment_scope,
                  description: variableWithDefaults.description,
                  raw: variableWithDefaults.raw,
                },
              );
            } catch (e) {
              throw new InputError(
                `Environment variable creation failed for ${
                  variableWithDefaults.key
                }. ${printGitlabError(e)}`,
              );
            }
          }
        }
        ctx.output('remoteUrl', remoteUrl);
        ctx.output('repoContentsUrl', repoContentsUrl);
        ctx.output('projectId', projectId);
        ctx.output('created', true);
      } else if (existingProject) {
        ctx.logger.info(`Repo ${repo} already exists in namespace ${owner}.`);
        const {
          id: projectId,
          http_url_to_repo,
          default_branch,
        } = existingProject;
        const remoteUrl = (http_url_to_repo as string).replace(/\.git$/, '');
        ctx.output('remoteUrl', remoteUrl);
        ctx.output('repoContentsUrl', `${remoteUrl}/-/blob/${default_branch}`);
        ctx.output('projectId', projectId);
        ctx.output('created', false);
      }
    },
  });
}

function printGitlabError(error: any): string {
  return JSON.stringify({ code: error.code, message: error.description });
}
