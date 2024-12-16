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
  getBitbucketServerRequestOptions,
  ScmIntegrationRegistry,
} from '@backstage/integration';
import {
  createTemplateAction,
  getRepoSourceDirectory,
  commitAndPushBranch,
  addFiles,
  cloneRepo,
  parseRepoUrl,
} from '@backstage/plugin-scaffolder-node';
import { Config } from '@backstage/config';
import fs from 'fs-extra';
import { examples } from './bitbucketServerPullRequest.examples';

const createPullRequest = async (opts: {
  project: string;
  repo: string;
  title: string;
  description?: string;
  toRef: {
    id: string;
    displayId: string;
    type: string;
    latestCommit: string;
    latestChangeset: string;
    isDefault: boolean;
  };
  fromRef: {
    id: string;
    displayId: string;
    type: string;
    latestCommit: string;
    latestChangeset: string;
    isDefault: boolean;
  };
  reviewers?: string[];
  authorization: string;
  apiBaseUrl: string;
}) => {
  const {
    project,
    repo,
    title,
    description,
    toRef,
    fromRef,
    reviewers,
    authorization,
    apiBaseUrl,
  } = opts;

  let response: Response;
  const data: RequestInit = {
    method: 'POST',
    body: JSON.stringify({
      title: title,
      description: description,
      state: 'OPEN',
      open: true,
      closed: false,
      locked: true,
      toRef: toRef,
      fromRef: fromRef,
      reviewers: reviewers?.map(reviewer => ({ user: { name: reviewer } })),
    }),
    headers: {
      Authorization: authorization,
      'Content-Type': 'application/json',
    },
  };

  try {
    response = await fetch(
      `${apiBaseUrl}/projects/${encodeURIComponent(
        project,
      )}/repos/${encodeURIComponent(repo)}/pull-requests`,
      data,
    );
  } catch (e) {
    throw new Error(`Unable to create pull-reqeusts, ${e}`);
  }

  if (response.status !== 201) {
    throw new Error(
      `Unable to create pull requests, ${response.status} ${
        response.statusText
      }, ${await response.text()}`,
    );
  }

  const r = await response.json();
  return `${r.links.self[0].href}`;
};
const findBranches = async (opts: {
  project: string;
  repo: string;
  branchName: string;
  authorization: string;
  apiBaseUrl: string;
}) => {
  const { project, repo, branchName, authorization, apiBaseUrl } = opts;

  let response: Response;
  const options: RequestInit = {
    method: 'GET',
    headers: {
      Authorization: authorization,
      'Content-Type': 'application/json',
    },
  };

  try {
    response = await fetch(
      `${apiBaseUrl}/projects/${encodeURIComponent(
        project,
      )}/repos/${encodeURIComponent(
        repo,
      )}/branches?boostMatches=true&filterText=${encodeURIComponent(
        branchName,
      )}`,
      options,
    );
  } catch (e) {
    throw new Error(`Unable to get branches, ${e}`);
  }

  if (response.status !== 200) {
    throw new Error(
      `Unable to get branches, ${response.status} ${
        response.statusText
      }, ${await response.text()}`,
    );
  }

  const r = await response.json();
  for (const object of r.values) {
    if (object.displayId === branchName) {
      return object;
    }
  }

  return undefined;
};
const createBranch = async (opts: {
  project: string;
  repo: string;
  branchName: string;
  authorization: string;
  apiBaseUrl: string;
  startPoint: string;
}) => {
  const { project, repo, branchName, authorization, apiBaseUrl, startPoint } =
    opts;

  let response: Response;
  const options: RequestInit = {
    method: 'POST',
    body: JSON.stringify({
      name: branchName,
      startPoint,
    }),
    headers: {
      Authorization: authorization,
      'Content-Type': 'application/json',
    },
  };

  try {
    response = await fetch(
      `${apiBaseUrl}/projects/${encodeURIComponent(
        project,
      )}/repos/${encodeURIComponent(repo)}/branches`,
      options,
    );
  } catch (e) {
    throw new Error(`Unable to create branch, ${e}`);
  }

  if (response.status !== 200) {
    throw new Error(
      `Unable to create branch, ${response.status} ${
        response.statusText
      }, ${await response.text()}`,
    );
  }

  return await response.json();
};
const getDefaultBranch = async (opts: {
  project: string;
  repo: string;
  authorization: string;
  apiBaseUrl: string;
}) => {
  const { project, repo, authorization, apiBaseUrl } = opts;
  let response: Response;

  const options: RequestInit = {
    method: 'GET',
    headers: {
      Authorization: authorization,
      'Content-Type': 'application/json',
    },
  };

  try {
    response = await fetch(
      `${apiBaseUrl}/projects/${project}/repos/${repo}/default-branch`,
      options,
    );
  } catch (error) {
    throw error;
  }

  const { displayId } = await response.json();
  const defaultBranch = displayId;
  if (!defaultBranch) {
    throw new Error(`Could not fetch default branch for ${project}/${repo}`);
  }
  return defaultBranch;
};
const isApiBaseUrlHttps = (apiBaseUrl: string): boolean => {
  const url = new URL(apiBaseUrl);
  return url.protocol === 'https:';
};
/**
 * Creates a BitbucketServer Pull Request action.
 * @public
 */
export function createPublishBitbucketServerPullRequestAction(options: {
  integrations: ScmIntegrationRegistry;
  config: Config;
}) {
  const { integrations, config } = options;

  return createTemplateAction<{
    repoUrl: string;
    title: string;
    description?: string;
    targetBranch?: string;
    sourceBranch: string;
    reviewers?: string[];
    token?: string;
    gitAuthorName?: string;
    gitAuthorEmail?: string;
  }>({
    id: 'publish:bitbucketServer:pull-request',
    examples,
    schema: {
      input: {
        type: 'object',
        required: ['repoUrl', 'title', 'sourceBranch'],
        properties: {
          repoUrl: {
            title: 'Repository Location',
            type: 'string',
          },
          title: {
            title: 'Pull Request title',
            type: 'string',
            description: 'The title for the pull request',
          },
          description: {
            title: 'Pull Request Description',
            type: 'string',
            description: 'The description of the pull request',
          },
          targetBranch: {
            title: 'Target Branch',
            type: 'string',
            description: `Branch of repository to apply changes to. The default value is 'master'`,
          },
          sourceBranch: {
            title: 'Source Branch',
            type: 'string',
            description: 'Branch of repository to copy changes from',
          },
          reviewers: {
            title: 'Pull Request Reviewers',
            type: 'array',
            items: {
              type: 'string',
            },
            description:
              'The usernames of reviewers that will be added to the pull request',
          },
          token: {
            title: 'Authorization Token',
            type: 'string',
            description:
              'The token to use for authorization to BitBucket Server',
          },
          gitAuthorName: {
            title: 'Author Name',
            type: 'string',
            description: `Sets the author name for the commit. The default value is 'Scaffolder'`,
          },
          gitAuthorEmail: {
            title: 'Author Email',
            type: 'string',
            description: `Sets the author email for the commit.`,
          },
        },
      },
      output: {
        type: 'object',
        properties: {
          pullRequestUrl: {
            title: 'A URL to the pull request with the provider',
            type: 'string',
          },
        },
      },
    },
    async handler(ctx) {
      const {
        repoUrl,
        title,
        description,
        targetBranch,
        sourceBranch,
        reviewers,
        gitAuthorName,
        gitAuthorEmail,
      } = ctx.input;

      const { project, repo, host } = parseRepoUrl(repoUrl, integrations);

      if (!project) {
        throw new InputError(
          `Invalid URL provider was included in the repo URL to create ${ctx.input.repoUrl}, missing project`,
        );
      }

      const integrationConfig = integrations.bitbucketServer.byHost(host);
      if (!integrationConfig) {
        throw new InputError(
          `No matching integration configuration for host ${host}, please check your integrations config`,
        );
      }

      const token = ctx.input.token ?? integrationConfig.config.token;

      const authConfig = {
        ...integrationConfig.config,
        ...{ token },
      };

      const reqOpts = getBitbucketServerRequestOptions(authConfig);
      const authorization = reqOpts.headers.Authorization;
      if (!authorization) {
        throw new Error(
          `Authorization has not been provided for ${integrationConfig.config.host}. Please add either (a) a user login auth token, or (b) a token input from the template or (c) username + password to the integration config.`,
        );
      }

      const apiBaseUrl = integrationConfig.config.apiBaseUrl;

      let finalTargetBranch = targetBranch;
      if (!finalTargetBranch) {
        finalTargetBranch = await getDefaultBranch({
          project,
          repo,
          authorization,
          apiBaseUrl,
        });
      }

      const toRef = await findBranches({
        project,
        repo,
        branchName: finalTargetBranch!,
        authorization,
        apiBaseUrl,
      });

      let fromRef = await findBranches({
        project,
        repo,
        branchName: sourceBranch,
        authorization,
        apiBaseUrl,
      });

      if (!fromRef) {
        // create branch
        ctx.logger.info(
          `source branch not found -> creating branch named: ${sourceBranch} lastCommit: ${toRef.latestCommit}`,
        );
        const latestCommit = toRef.latestCommit;

        fromRef = await createBranch({
          project,
          repo,
          branchName: sourceBranch,
          authorization,
          apiBaseUrl,
          startPoint: latestCommit,
        });

        const isHttps: boolean = isApiBaseUrlHttps(apiBaseUrl);
        const remoteUrl = `${
          isHttps ? 'https' : 'http'
        }://${host}/scm/${project}/${repo}.git`;

        const auth = authConfig.token
          ? {
              token: token!,
            }
          : {
              username: authConfig.username!,
              password: authConfig.password!,
            };

        const gitAuthorInfo = {
          name:
            gitAuthorName ||
            config.getOptionalString('scaffolder.defaultAuthor.name'),
          email:
            gitAuthorEmail ||
            config.getOptionalString('scaffolder.defaultAuthor.email'),
        };

        const tempDir = await ctx.createTemporaryDirectory();
        const sourceDir = getRepoSourceDirectory(ctx.workspacePath, undefined);
        await cloneRepo({
          url: remoteUrl,
          dir: tempDir,
          auth,
          logger: ctx.logger,
          ref: sourceBranch,
        });

        // copy files
        fs.cpSync(sourceDir, tempDir, {
          recursive: true,
          filter: path => {
            return !(path.indexOf('.git') > -1);
          },
        });

        await addFiles({
          dir: tempDir,
          auth,
          logger: ctx.logger,
          filepath: '.',
        });

        await commitAndPushBranch({
          dir: tempDir,
          auth,
          logger: ctx.logger,
          commitMessage:
            description ??
            config.getOptionalString('scaffolder.defaultCommitMessage') ??
            '',
          gitAuthorInfo,
          branch: sourceBranch,
        });
      }

      const pullRequestUrl = await createPullRequest({
        project,
        repo,
        title,
        description,
        toRef,
        fromRef,
        reviewers,
        authorization,
        apiBaseUrl,
      });

      ctx.output('pullRequestUrl', pullRequestUrl);
    },
  });
}
