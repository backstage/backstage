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

import {
  getGitLabFileFetchUrl,
  getGitLabRequestOptions,
  GitLabIntegrationConfig,
  readGitLabIntegrationConfigs,
} from '@backstage/integration';
import fetch from 'cross-fetch';
import parseGitUrl from 'git-url-parse';
import { Readable } from 'stream';
import { NotFoundError, NotModifiedError } from '../errors';
import { ReadTreeResponseFactory } from './tree';
import {
  ReaderFactory,
  ReadTreeOptions,
  ReadTreeResponse,
  SearchResponse,
  UrlReader,
} from './types';

export class GitlabUrlReader implements UrlReader {
  private readonly treeResponseFactory: ReadTreeResponseFactory;

  static factory: ReaderFactory = ({ config, treeResponseFactory }) => {
    const configs = readGitLabIntegrationConfigs(
      config.getOptionalConfigArray('integrations.gitlab') ?? [],
    );
    return configs.map(provider => {
      const reader = new GitlabUrlReader(provider, { treeResponseFactory });
      const predicate = (url: URL) => url.host === provider.host;
      return { reader, predicate };
    });
  };

  constructor(
    private readonly config: GitLabIntegrationConfig,
    deps: { treeResponseFactory: ReadTreeResponseFactory },
  ) {
    this.treeResponseFactory = deps.treeResponseFactory;

    if (!config.apiBaseUrl) {
      throw new Error(
        `GitLab integration for '${config.host}' must configure an explicit apiBaseUrl`,
      );
    }
  }

  async read(url: string): Promise<Buffer> {
    const builtUrl = await getGitLabFileFetchUrl(url, this.config);

    let response: Response;
    try {
      response = await fetch(builtUrl, getGitLabRequestOptions(this.config));
    } catch (e) {
      throw new Error(`Unable to read ${url}, ${e}`);
    }

    if (response.ok) {
      return Buffer.from(await response.text());
    }

    const message = `${url} could not be read as ${builtUrl}, ${response.status} ${response.statusText}`;
    if (response.status === 404) {
      throw new NotFoundError(message);
    }
    throw new Error(message);
  }

  async readTree(
    url: string,
    options?: ReadTreeOptions,
  ): Promise<ReadTreeResponse> {
    const { ref, full_name, filepath } = parseGitUrl(url);

    // Use GitLab API to get the default branch
    // encodeURIComponent is required for GitLab API
    // https://docs.gitlab.com/ee/api/README.html#namespaced-path-encoding
    const projectGitlabResponse = await fetch(
      new URL(
        `${this.config.apiBaseUrl}/projects/${encodeURIComponent(full_name)}`,
      ).toString(),
      getGitLabRequestOptions(this.config),
    );
    if (!projectGitlabResponse.ok) {
      const msg = `Failed to read tree from ${url}, ${projectGitlabResponse.status} ${projectGitlabResponse.statusText}`;
      if (projectGitlabResponse.status === 404) {
        throw new NotFoundError(msg);
      }
      throw new Error(msg);
    }
    const projectGitlabResponseJson = await projectGitlabResponse.json();

    // ref is an empty string if no branch is set in provided url to readTree.
    const branch = ref || projectGitlabResponseJson.default_branch;

    // Fetch the latest commit in the provided or default branch to compare against
    // the provided sha.
    const branchGitlabResponse = await fetch(
      new URL(
        `${this.config.apiBaseUrl}/projects/${encodeURIComponent(
          full_name,
        )}/repository/branches/${branch}`,
      ).toString(),
      getGitLabRequestOptions(this.config),
    );
    if (!branchGitlabResponse.ok) {
      const message = `Failed to read tree (branch) from ${url}, ${branchGitlabResponse.status} ${branchGitlabResponse.statusText}`;
      if (branchGitlabResponse.status === 404) {
        throw new NotFoundError(message);
      }
      throw new Error(message);
    }

    const commitSha = (await branchGitlabResponse.json()).commit.id;

    if (options?.etag && options.etag === commitSha) {
      throw new NotModifiedError();
    }

    // https://docs.gitlab.com/ee/api/repositories.html#get-file-archive
    const archiveGitLabResponse = await fetch(
      `${this.config.apiBaseUrl}/projects/${encodeURIComponent(
        full_name,
      )}/repository/archive.zip?sha=${branch}`,
      getGitLabRequestOptions(this.config),
    );
    if (!archiveGitLabResponse.ok) {
      const message = `Failed to read tree (archive) from ${url}, ${archiveGitLabResponse.status} ${archiveGitLabResponse.statusText}`;
      if (archiveGitLabResponse.status === 404) {
        throw new NotFoundError(message);
      }
      throw new Error(message);
    }

    return await this.treeResponseFactory.fromZipArchive({
      stream: (archiveGitLabResponse.body as unknown) as Readable,
      subpath: filepath,
      etag: commitSha,
      filter: options?.filter,
    });
  }

  async search(): Promise<SearchResponse> {
    throw new Error('GitlabUrlReader does not implement search');
  }

  toString() {
    const { host, token } = this.config;
    return `gitlab{host=${host},authed=${Boolean(token)}}`;
  }
}
