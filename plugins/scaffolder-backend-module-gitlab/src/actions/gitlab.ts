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
import { LoggerService } from '@backstage/backend-plugin-api';
import { examples } from './gitlab.examples';

/**
 * Custom Git implementation using child_process to bypass HTTP client timeout issues
 */
async function customGitPush(input: {
  dir: string;
  remoteUrl: string;
  auth: { username: string; password: string } | { token: string };
  logger: LoggerService;
  defaultBranch?: string;
  commitMessage?: string;
  gitAuthorInfo?: { name?: string; email?: string };
  timeout?: number;
}): Promise<{ commitHash: string }> {
  const {
    dir,
    remoteUrl,
    auth,
    logger,
    defaultBranch = 'master',
    commitMessage = 'Initial commit',
    gitAuthorInfo,
    timeout = 60,
  } = input;

  const { spawn } = require('child_process');

  logger.info(`Starting git operation with ${timeout}s timeout`);

  const runGitCommand = (
    args: string[],
    options: any = {},
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      logger.info(`Running git command: git ${args.join(' ')}`);

      const gitProcess = spawn('git', args, {
        cwd: dir,
        stdio: ['pipe', 'pipe', 'pipe'],
        env: { ...process.env, GIT_TERMINAL_PROMPT: '0' },
        ...options,
      });

      let stdout = '';
      let stderr = '';

      gitProcess.stdout?.on('data', (data: any) => {
        stdout += data.toString();
      });

      gitProcess.stderr?.on('data', (data: any) => {
        stderr += data.toString();
      });

      gitProcess.on('close', (code: number | null) => {
        if (code === 0) {
          resolve(stdout.trim());
        } else {
          reject(
            new Error(
              `Git command failed (exit code ${code}): ${stderr || stdout}`,
            ),
          );
        }
      });

      gitProcess.on('error', (error: any) => {
        reject(new Error(`Git command error: ${error.message}`));
      });

      const timeoutId = setTimeout(() => {
        gitProcess.kill('SIGKILL');
        reject(new Error(`Git command timed out after ${timeout} seconds`));
      }, timeout * 1000);

      gitProcess.on('close', () => {
        clearTimeout(timeoutId);
      });
    });
  };

  try {
    await runGitCommand(['init', '-b', defaultBranch]);

    const authorName = gitAuthorInfo?.name || 'Scaffolder';
    const authorEmail = gitAuthorInfo?.email || 'scaffolder@backstage.io';

    await runGitCommand(['config', 'user.name', authorName]);
    await runGitCommand(['config', 'user.email', authorEmail]);
    await runGitCommand(['config', 'http.timeout', String(timeout)]);
    await runGitCommand(['config', 'http.lowSpeedLimit', '1000']);
    await runGitCommand(['config', 'http.lowSpeedTime', String(timeout)]);

    const authUrl =
      'token' in auth
        ? remoteUrl.replace(/^https?:\/\//, `https://oauth2:${auth.token}@`)
        : remoteUrl.replace(
            /^https?:\/\//,
            `https://${auth.username}:${auth.password}@`,
          );

    await runGitCommand(['remote', 'add', 'origin', authUrl]);
    await runGitCommand(['add', '.']);

    const commitOutput = await runGitCommand(['commit', '-m', commitMessage]);
    const commitHash =
      commitOutput.match(/\[.+?\s([a-f0-9]+)\]/)?.[1] || 'unknown';

    await runGitCommand(['push', '-u', 'origin', defaultBranch]);

    logger.info('Git operation completed successfully');
    return { commitHash };
  } catch (error: any) {
    logger.error(`Git operation failed: ${error.message}`);
    throw error;
  }
}

/**
 * Wrapper that chooses between original and custom git implementation
 */
async function initRepoAndPushWithTimeout(input: {
  dir: string;
  remoteUrl: string;
  auth: { username: string; password: string } | { token: string };
  logger: LoggerService;
  defaultBranch?: string;
  commitMessage?: string;
  gitAuthorInfo?: { name?: string; email?: string };
  signingKey?: string;
  timeout?: number;
  useCustomGit?: boolean;
}): Promise<{ commitHash: string }> {
  const { timeout = 60, useCustomGit = false, ...restInput } = input;

  if (useCustomGit) {
    return customGitPush({ ...restInput, timeout });
  }

  // Original implementation with timeout wrapper (default behavior)
  // Remove timeout and useCustomGit from input as initRepoAndPush doesn't expect them
  const originalInput = {
    dir: input.dir,
    remoteUrl: input.remoteUrl,
    auth: input.auth,
    logger: input.logger,
    defaultBranch: input.defaultBranch,
    commitMessage: input.commitMessage,
    gitAuthorInfo: input.gitAuthorInfo,
    signingKey: input.signingKey,
  };

  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(
        new Error(`Git push operation timed out after ${timeout} seconds`),
      );
    }, timeout * 1000);

    const result = initRepoAndPush(originalInput);

    result
      .then(gitResult => {
        clearTimeout(timeoutId);
        resolve(gitResult);
      })
      .catch((error: any) => {
        clearTimeout(timeoutId);
        reject(error);
      });
  });
}

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
        gitTimeout: z =>
          z
            .number({
              description:
                'Timeout in seconds for git operations (default: 60)',
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
                raw: z.boolean().optional(),
                environment_scope: z.string().optional(),
              }),
            )
            .optional(),
        useCustomGit: z =>
          z
            .boolean({
              description:
                'Use custom git implementation to avoid HTTP client timeout issues. Defaults to false for backward compatibility.',
            })
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
        gitTimeout = 60,
        useCustomGit = false,
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
      } catch (e: any) {
        if (e?.cause?.response?.status === 404) {
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

        let projectId: number;
        let http_url_to_repo: string;

        try {
          const result = await client.Projects.create({
            namespaceId: targetNamespaceId,
            name: repo,
            visibility: repoVisibility,
            ...(topics.length ? { topics } : {}),
            ...(Object.keys(settings).length ? { ...settings } : {}),
          });
          projectId = result.id;
          http_url_to_repo = result.http_url_to_repo;
        } catch (e: any) {
          ctx.logger.error(`GitLab repository creation failed: ${e.message}`, {
            error: e,
          });

          // Check if this is a duplicate repository error
          if (e.cause?.response?.status === 400) {
            const errorMessage = e.description || e.message || '';
            const responseBody = e.cause?.response?.body;

            // Check for duplicate repository patterns
            const responseBodyStr =
              typeof responseBody === 'string'
                ? responseBody
                : JSON.stringify(responseBody || '');
            if (
              errorMessage.includes('has already been taken') ||
              errorMessage.includes('already exists') ||
              (responseBodyStr &&
                (responseBodyStr.includes('has already been taken') ||
                  responseBodyStr.includes('already exists')))
            ) {
              throw new InputError(
                `Repository '${repo}' already exists in namespace '${owner}'. Please choose a different repository name or enable the 'skipExisting' option.`,
              );
            }

            // Check for invalid repository name
            if (
              errorMessage.includes('can contain only') ||
              errorMessage.includes('invalid') ||
              errorMessage.includes('not allowed')
            ) {
              throw new InputError(
                `Invalid repository name '${repo}'. Repository names must contain only letters, digits, '_', '-' and '.'. They cannot start with '-', end in '.git' or end in '.atom'.`,
              );
            }
          }

          // Check for permission errors
          if (e.cause?.response?.status === 403) {
            throw new InputError(
              `Insufficient permissions to create repository '${repo}' in namespace '${owner}'. Please check your GitLab token permissions.`,
            );
          }

          // Check for namespace not found
          if (e.cause?.response?.status === 404) {
            throw new InputError(
              `Namespace '${owner}' not found or not accessible. Please verify the namespace exists and you have access to it.`,
            );
          }

          // For other errors, provide a more helpful message
          throw new InputError(
            `Failed to create GitLab repository '${repo}' in namespace '${owner}': ${
              e.description || e.message
            }. ${printGitlabError(e)}`,
          );
        }

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
          const commitResult = await initRepoAndPushWithTimeout({
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
            timeout: gitTimeout,
            useCustomGit,
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
                } catch (e: any) {
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
                } catch (e: any) {
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
          ctx.output('commitHash', commitResult.commitHash);
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
            } catch (e: any) {
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
  // Extract more detailed error information
  const errorInfo: any = {
    code: error.code,
    message: error.description || error.message,
  };

  // Add HTTP status if available
  if (error.cause?.response?.status) {
    errorInfo.status = error.cause.response.status;
  }

  // Add response body if available for more context
  if (error.cause?.response?.body) {
    try {
      const body =
        typeof error.cause.response.body === 'string'
          ? JSON.parse(error.cause.response.body)
          : error.cause.response.body;
      if (body.message) {
        errorInfo.details = body.message;
      }
    } catch {
      // Ignore JSON parsing errors
    }
  }

  return JSON.stringify(errorInfo);
}
