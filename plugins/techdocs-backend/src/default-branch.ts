/*
 * Copyright 2020 Spotify AB
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
import fetch, { RequestInit } from 'node-fetch';
import parseGitUrl from 'git-url-parse';
import { ConfigReader, Config } from '@backstage/config';
import { loadBackendConfig } from '@backstage/backend-common';

interface IGitlabBranch {
  name: string;
  merged: boolean;
  protected: boolean;
  default: boolean;
  developers_can_push: boolean;
  developers_can_merge: boolean;
  can_push: boolean;
  web_url: string;
  commit: {
    author_email: string;
    author_name: string;
    authored_date: string;
    committed_date: string;
    committer_email: string;
    committer_name: string;
    id: string;
    short_id: string;
    title: string;
    message: string;
    parent_ids: string[];
  };
}

function getGithubApiUrl(url: string): URL {
  const { protocol, owner, name } = parseGitUrl(url);
  const apiBaseUrl = 'api.github.com';
  const apiRepos = 'repos';

  return new URL(`${protocol}://${apiBaseUrl}/${apiRepos}/${owner}/${name}`);
}

function getGitlabApiUrl(url: string): URL {
  const { protocol, resource, full_name: fullName } = parseGitUrl(url);
  const apiProjectsBasePath = 'api/v4/projects';
  const project = encodeURIComponent(fullName);
  const branches = 'repository/branches';

  return new URL(
    `${protocol}://${resource}/${apiProjectsBasePath}/${project}/${branches}`,
  );
}

function getGithubRequestOptions(config: Config): RequestInit {
  const headers: HeadersInit = {
    Accept: 'application/vnd.github.v3.raw',
  };

  const token =
    config.getOptionalString('catalog.processors.github.privateToken') ??
    config.getOptionalString('catalog.processors.githubApi.privateToken') ??
    process.env.GITHUB_TOKEN;

  if (token) {
    headers.Authorization = `token ${token}`;
  }

  return {
    headers,
  };
}

function getGitlabRequestOptions(config: Config): RequestInit {
  const headers: HeadersInit = {
    'PRIVATE-TOKEN': '',
  };

  const token =
    config.getOptionalString('catalog.processors.gitlab.privateToken') ??
    config.getOptionalString('catalog.processors.gitlabApi.privateToken') ??
    process.env.GITLAB_TOKEN;

  if (token) {
    headers['PRIVATE-TOKEN'] = token;
  }

  return {
    headers,
  };
}

async function getGithubDefaultBranch(
  repositoryUrl: string,
  config: Config,
): Promise<string> {
  const path = getGithubApiUrl(repositoryUrl).toString();
  const options = getGithubRequestOptions(config);

  try {
    const raw = await fetch(path, options);

    if (!raw.ok) {
      throw new Error(
        `Failed to load url: ${raw.status} ${raw.statusText}. Make sure you have permission to repository: ${repositoryUrl}`,
      );
    }

    const { default_branch: branch } = await raw.json();

    if (!branch) {
      throw new Error('Not found github default branch');
    }

    return branch;
  } catch (error) {
    throw new Error(`Failed to get github default branch: ${error}`);
  }
}

async function getGitlabDefaultBranch(
  repositoryUrl: string,
  config: Config,
): Promise<string> {
  const path = getGitlabApiUrl(repositoryUrl).toString();

  const options = getGitlabRequestOptions(config);

  try {
    const raw = await fetch(path, options);

    if (!raw.ok) {
      throw new Error(
        `Failed to load url: ${raw.status} ${raw.statusText}. Make sure you have permission to repository: ${repositoryUrl}`,
      );
    }

    const result = await raw.json();
    const { name } = (result || []).find(
      (branch: IGitlabBranch) => branch.default === true,
    );

    if (!name) {
      throw new Error('Not found gitlab default branch');
    }

    return name;
  } catch (error) {
    throw new Error(`Failed to get gitlab default branch: ${error}`);
  }
}

export const getDefaultBranch = async (
  repositoryUrl: string,
): Promise<string> => {
  const config = ConfigReader.fromConfigs(await loadBackendConfig());
  const typeMapping = [
    { url: /github*/g, type: 'github' },
    { url: /gitlab*/g, type: 'gitlab' },
  ];

  const type = typeMapping.filter(item => item.url.test(repositoryUrl))[0]
    ?.type;

  try {
    switch (type) {
      case 'github':
        return await getGithubDefaultBranch(repositoryUrl, config);
      case 'gitlab':
        return await getGitlabDefaultBranch(repositoryUrl, config);

      default:
        throw new Error('Failed to get repository type');
    }
  } catch (error) {
    throw error;
  }
};
