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

  return createTemplateAction<{
    repoUrl: string;
    defaultBranch?: string;
    /** @deprecated in favour of settings.visibility field */
    repoVisibility?: 'private' | 'internal' | 'public';
    sourcePath?: string | boolean;
    skipExisting?: boolean;
    token?: string;
    gitCommitMessage?: string;
    gitAuthorName?: string;
    gitAuthorEmail?: string;
    signCommit?: boolean;
    setUserAsOwner?: boolean;
    /** @deprecated in favour of settings.topics field */
    topics?: string[];
    settings?: {
      path?: string;
      auto_devops_enabled?: boolean;
      ci_config_path?: string;
      description?: string;
      merge_method?: 'merge' | 'rebase_merge' | 'ff';
      squash_option?: 'default_off' | 'default_on' | 'never' | 'always';
      topics?: string[];
      visibility?: 'private' | 'internal' | 'public';
      only_allow_merge_if_all_discussions_are_resolved?: boolean;
      only_allow_merge_if_pipeline_succeeds?: boolean;
      allow_merge_on_skipped_pipeline?: boolean;
    };
    branches?: Array<{
      name: string;
      protect?: boolean;
      create?: boolean;
      ref?: string;
    }>;
    projectVariables?: Array<{
      key: string;
      value: string;
      description?: string;
      variable_type?: string;
      protected?: boolean;
      masked?: boolean;
      raw?: boolean;
      environment_scope?: string;
    }>;
  }>({
    id: 'publish:gitlab',
    description:
      'Initializes a git repository of the content in the workspace, and publishes it to GitLab.',
    examples,
    schema: {
      input: {
        type: 'object',
        required: ['repoUrl'],
        properties: {
          repoUrl: {
            title: 'Repository Location',
            type: 'string',
            description: `Accepts the format 'gitlab.com?repo=project_name&owner=group_name' where 'project_name' is the repository name and 'group_name' is a group or username`,
          },
          repoVisibility: {
            title: 'Repository Visibility',
            description: `Sets the visibility of the repository. The default value is 'private'. (deprecated, use settings.visibility instead)`,
            type: 'string',
            enum: ['private', 'public', 'internal'],
          },
          defaultBranch: {
            title: 'Default Branch',
            type: 'string',
            description: `Sets the default branch on the repository. The default value is 'master'`,
          },
          gitCommitMessage: {
            title: 'Git Commit Message',
            type: 'string',
            description: `Sets the commit message on the repository. The default value is 'initial commit'`,
          },
          gitAuthorName: {
            title: 'Default Author Name',
            type: 'string',
            description: `Sets the default author name for the commit. The default value is 'Scaffolder'`,
          },
          gitAuthorEmail: {
            title: 'Default Author Email',
            type: 'string',
            description: `Sets the default author email for the commit.`,
          },
          signCommit: {
            title: 'Sign commit',
            type: 'boolean',
            description: 'Sign commit with configured PGP private key',
          },
          sourcePath: {
            title: 'Source Path',
            description:
              'Path within the workspace that will be used as the repository root. If omitted or set to true, the entire workspace will be published as the repository. If set to false, the created repository will be empty.',
            type: ['string', 'boolean'],
          },
          skipExisting: {
            title: 'Skip if repository exists',
            description:
              'Do not publish the repository if it already exists. The default value is false.',
            type: ['boolean'],
          },
          token: {
            title: 'Authentication Token',
            type: 'string',
            description: 'The token to use for authorization to GitLab',
          },
          setUserAsOwner: {
            title: 'Set User As Owner',
            type: 'boolean',
            description:
              'Set the token user as owner of the newly created repository. Requires a token authorized to do the edit in the integration configuration for the matching host',
          },
          topics: {
            title: 'Topic labels',
            description:
              'Topic labels to apply on the repository. (deprecated, use settings.topics instead)',
            type: 'array',
            items: {
              type: 'string',
            },
          },
          settings: {
            title: 'Project settings',
            description:
              'Additional project settings, based on https://docs.gitlab.com/ee/api/projects.html#create-project attributes',
            type: 'object',
            properties: {
              path: {
                title: 'Project path',
                description:
                  'Repository name for new project. Generated based on name if not provided (generated as lowercase with dashes).',
                type: 'string',
              },
              auto_devops_enabled: {
                title: 'Auto DevOps enabled',
                description: 'Enable Auto DevOps for this project',
                type: 'boolean',
              },
              ci_config_path: {
                title: 'CI config path',
                description: 'Custom CI config path for this project',
                type: 'string',
              },
              description: {
                title: 'Project description',
                description: 'Short project description',
                type: 'string',
              },
              merge_method: {
                title: 'Merge Method to use',
                description: 'Merge Methods (merge, rebase_merge, ff)',
                type: 'string',
                enum: ['merge', 'rebase_merge', 'ff'],
              },
              squash_option: {
                title: 'Squash option',
                description:
                  'Set squash option for the project (never, always, default_on, default_off)',
                type: 'string',
                enum: ['default_off', 'default_on', 'never', 'always'],
              },
              topics: {
                title: 'Topic labels',
                description: 'Topic labels to apply on the repository',
                type: 'array',
                items: {
                  type: 'string',
                },
              },
              visibility: {
                title: 'Project visibility',
                description:
                  'The visibility of the project. Can be private, internal, or public. The default value is private.',
                type: 'string',
                enum: ['private', 'public', 'internal'],
              },
              only_allow_merge_if_all_discussions_are_resolved: {
                title: 'All threads must be resolved',
                description:
                  'Set whether merge requests can only be merged when all the discussions are resolved.',
                type: 'boolean',
              },
              only_allow_merge_if_pipeline_succeeds: {
                title: 'Pipelines must succeed',
                description:
                  'Set whether merge requests can only be merged with successful pipelines. This setting is named Pipelines must succeed in the project settings.',
                type: 'boolean',
              },
              allow_merge_on_skipped_pipeline: {
                title: 'Skipped pipelines are considered successful',
                description:
                  'Set whether or not merge requests can be merged with skipped jobs.',
                type: 'boolean',
              },
            },
          },
          branches: {
            title: 'Project branches settings',
            type: 'array',
            items: {
              type: 'object',
              required: ['name'],
              properties: {
                name: {
                  title: 'Branch name',
                  type: 'string',
                },
                protect: {
                  title: 'Should branch be protected',
                  description: `Will mark branch as protected. The default value is 'false'`,
                  type: 'boolean',
                },
                create: {
                  title: 'Should branch be created',
                  description: `If branch does not exist, it will be created from provided ref. The default value is 'false'`,
                  type: 'boolean',
                },
                ref: {
                  title: 'Branch reference',
                  description: `Branch reference to create branch from. The default value is 'master'`,
                  type: 'string',
                },
              },
            },
          },
          projectVariables: {
            title: 'Project variables',
            description:
              'Project variables settings based on Gitlab Project Environments API - https://docs.gitlab.com/ee/api/project_level_variables.html#create-a-variable',
            type: 'array',
            items: {
              type: 'object',
              required: ['key', 'value'],
              properties: {
                key: {
                  title: 'Variable key',
                  description:
                    'The key of a variable; must have no more than 255 characters; only A-Z, a-z, 0-9, and _ are allowed',
                  type: 'string',
                },
                value: {
                  title: 'Variable value',
                  description: 'The value of a variable',
                  type: 'string',
                },
                description: {
                  title: 'Variable description',
                  description: `The description of the variable. The default value is 'null'`,
                  type: 'string',
                },
                variable_type: {
                  title: 'Variable type',
                  description: `The type of a variable. The default value is 'env_var'`,
                  type: 'string',
                  enum: ['env_var', 'file'],
                },
                protected: {
                  title: 'Variable protection',
                  description: `Whether the variable is protected. The default value is 'false'`,
                  type: 'boolean',
                },
                raw: {
                  title: 'Variable raw',
                  description: `Whether the variable is in raw format. The default value is 'false'`,
                  type: 'boolean',
                },
                environment_scope: {
                  title: 'Variable environment scope',
                  description: `The environment_scope of the variable. The default value is '*'`,
                  type: 'string',
                },
              },
            },
          },
        },
      },
      output: {
        type: 'object',
        properties: {
          remoteUrl: {
            title: 'A URL to the repository with the provider',
            type: 'string',
          },
          repoContentsUrl: {
            title: 'A URL to the root of the repository',
            type: 'string',
          },
          projectId: {
            title: 'The ID of the project',
            type: 'number',
          },
          commitHash: {
            title: 'The git commit hash of the initial commit',
            type: 'string',
          },
          created: {
            title: 'Whether the repository was created or not',
            type: 'boolean',
          },
        },
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

          await adminClient.ProjectMembers.add(projectId, userId, 50);
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
