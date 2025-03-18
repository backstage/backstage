/*
 * Copyright 2024 The Backstage Authors
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
  commitAndPushBranch,
  addFiles,
  cloneRepo,
  parseRepoUrl,
} from '@backstage/plugin-scaffolder-node';
import { Config } from '@backstage/config';
import fs from 'fs-extra';
import { getAuthorizationHeader } from './helpers';
import { examples } from './bitbucketCloudPullRequest.examples';

const createPullRequest = async (opts: {
  workspace: string;
  repo: string;
  title: string;
  description?: string;
  targetBranch: string;
  sourceBranch: string;
  authorization: string;
  apiBaseUrl: string;
}) => {
  const {
    workspace,
    repo,
    title,
    description,
    targetBranch,
    sourceBranch,
    authorization,
    apiBaseUrl,
  } = opts;

  let response: Response;
  const data: RequestInit = {
    method: 'POST',
    body: JSON.stringify({
      title: title,
      summary: {
        raw: description,
      },
      state: 'OPEN',
      source: {
        branch: {
          name: sourceBranch,
        },
      },
      destination: {
        branch: {
          name: targetBranch,
        },
      },
    }),
    headers: {
      Authorization: authorization,
      'Content-Type': 'application/json',
    },
  };

  try {
    response = await fetch(
      `${apiBaseUrl}/repositories/${workspace}/${repo}/pullrequests`,
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
  return r.links.html.href;
};

const findBranches = async (opts: {
  workspace: string;
  repo: string;
  branchName: string;
  authorization: string;
  apiBaseUrl: string;
}) => {
  const { workspace, repo, branchName, authorization, apiBaseUrl } = opts;

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
      `${apiBaseUrl}/repositories/${workspace}/${repo}/refs/branches?q=${encodeURIComponent(
        `name = "${branchName}"`,
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

  return r.values[0];
};
const createBranch = async (opts: {
  workspace: string;
  repo: string;
  branchName: string;
  authorization: string;
  apiBaseUrl: string;
  startBranch: string;
}) => {
  const {
    workspace,
    repo,
    branchName,
    authorization,
    apiBaseUrl,
    startBranch,
  } = opts;

  let response: Response;
  const options: RequestInit = {
    method: 'POST',
    body: JSON.stringify({
      name: branchName,
      target: {
        hash: startBranch,
      },
    }),
    headers: {
      Authorization: authorization,
      'Content-Type': 'application/json',
    },
  };

  try {
    response = await fetch(
      `${apiBaseUrl}/repositories/${workspace}/${repo}/refs/branches`,
      options,
    );
  } catch (e) {
    throw new Error(`Unable to create branch, ${e}`);
  }

  if (response.status !== 201) {
    throw new Error(
      `Unable to create branch, ${response.status} ${
        response.statusText
      }, ${await response.text()}`,
    );
  }

  return await response.json();
};
const getDefaultBranch = async (opts: {
  workspace: string;
  repo: string;
  authorization: string;
  apiBaseUrl: string;
}): Promise<string> => {
  const { workspace, repo, authorization, apiBaseUrl } = opts;
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
      `${apiBaseUrl}/repositories/${workspace}/${repo}`,
      options,
    );
  } catch (error) {
    throw error;
  }

  const { mainbranch } = await response.json();
  const defaultBranch = mainbranch.name;
  if (!defaultBranch) {
    throw new Error(`Could not fetch default branch for ${workspace}/${repo}`);
  }
  return defaultBranch;
};
/**
 * Creates a Bitbucket Cloud Pull Request action.
 * @public
 */
export function createPublishBitbucketCloudPullRequestAction(options: {
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
    token?: string;
    gitAuthorName?: string;
    gitAuthorEmail?: string;
  }>({
    id: 'publish:bitbucketCloud:pull-request',
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
          token: {
            title: 'Authorization Token',
            type: 'string',
            description:
              'The token to use for authorization to BitBucket Cloud',
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
        gitAuthorName,
        gitAuthorEmail,
      } = ctx.input;

      const { workspace, repo, host } = parseRepoUrl(repoUrl, integrations);

      if (!workspace) {
        throw new InputError(
          `Invalid URL provider was included in the repo URL to create ${ctx.input.repoUrl}, missing workspace`,
        );
      }

      const integrationConfig = integrations.bitbucketCloud.byHost(host);
      if (!integrationConfig) {
        throw new InputError(
          `No matching integration configuration for host ${host}, please check your integrations config`,
        );
      }

      const authorization = getAuthorizationHeader(
        ctx.input.token ? { token: ctx.input.token } : integrationConfig.config,
      );

      const apiBaseUrl = integrationConfig.config.apiBaseUrl;

      let finalTargetBranch = targetBranch;
      if (!finalTargetBranch) {
        finalTargetBranch = await getDefaultBranch({
          workspace,
          repo,
          authorization,
          apiBaseUrl,
        });
      }

      const sourceBranchRef = await findBranches({
        workspace,
        repo,
        branchName: sourceBranch,
        authorization,
        apiBaseUrl,
      });

      if (!sourceBranchRef) {
        // create branch
        ctx.logger.info(
          `source branch not found -> creating branch named: ${sourceBranch}`,
        );

        await createBranch({
          workspace,
          repo,
          branchName: sourceBranch,
          authorization,
          apiBaseUrl,
          startBranch: finalTargetBranch,
        });

        const remoteUrl = `https://${host}/${workspace}/${repo}.git`;

        let auth;

        if (ctx.input.token) {
          auth = {
            username: 'x-token-auth',
            password: ctx.input.token,
          };
        } else {
          if (
            !integrationConfig.config.username ||
            !integrationConfig.config.appPassword
          ) {
            throw new Error(
              'Credentials for Bitbucket Cloud integration required for this action.',
            );
          }

          auth = {
            username: integrationConfig.config.username,
            password: integrationConfig.config.appPassword,
          };
        }

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
        workspace,
        repo,
        title,
        description,
        targetBranch: finalTargetBranch,
        sourceBranch,
        authorization,
        apiBaseUrl,
      });

      ctx.output('pullRequestUrl', pullRequestUrl);
    },
  });
}
