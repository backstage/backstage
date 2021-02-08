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
  getGitHubFileFetchUrl,
  GithubCredentialsProvider,
  GitHubIntegrationConfig,
  readGitHubIntegrationConfigs,
} from '@backstage/integration';
import { RestEndpointMethodTypes } from '@octokit/rest';
import fetch from 'cross-fetch';
import parseGitUrl from 'git-url-parse';
import { Readable } from 'stream';
import { NotFoundError, NotModifiedError } from '../errors';
import { ReadTreeResponseFactory } from './tree';
import {
  ReaderFactory,
  ReadTreeOptions,
  ReadTreeResponse,
  UrlReader,
} from './types';

/**
 * A processor that adds the ability to read files from GitHub v3 APIs, such as
 * the one exposed by GitHub itself.
 */
export class GithubUrlReader implements UrlReader {
  static factory: ReaderFactory = ({ config, treeResponseFactory }) => {
    const configs = readGitHubIntegrationConfigs(
      config.getOptionalConfigArray('integrations.github') ?? [],
    );
    return configs.map(provider => {
      const credentialsProvider = GithubCredentialsProvider.create(provider);
      const reader = new GithubUrlReader(provider, {
        treeResponseFactory,
        credentialsProvider,
      });
      const predicate = (url: URL) => url.host === provider.host;
      return { reader, predicate };
    });
  };

  constructor(
    private readonly config: GitHubIntegrationConfig,
    private readonly deps: {
      treeResponseFactory: ReadTreeResponseFactory;
      credentialsProvider: GithubCredentialsProvider;
    },
  ) {
    if (!config.apiBaseUrl && !config.rawBaseUrl) {
      throw new Error(
        `GitHub integration for '${config.host}' must configure an explicit apiBaseUrl and rawBaseUrl`,
      );
    }
  }

  async read(url: string): Promise<Buffer> {
    const ghUrl = getGitHubFileFetchUrl(url, this.config);
    const { headers } = await this.deps.credentialsProvider.getCredentials({
      url,
    });
    let response: Response;
    try {
      response = await fetch(ghUrl.toString(), {
        headers: {
          ...headers,
          Accept: 'application/vnd.github.v3.raw',
        },
      });
    } catch (e) {
      throw new Error(`Unable to read ${url}, ${e}`);
    }

    if (response.ok) {
      return Buffer.from(await response.text());
    }

    const message = `${url} could not be read as ${ghUrl}, ${response.status} ${response.statusText}`;
    if (response.status === 404) {
      throw new NotFoundError(message);
    }
    throw new Error(message);
  }

  async readTree(
    url: string,
    options?: ReadTreeOptions,
  ): Promise<ReadTreeResponse> {
    const repoDetails = await this.getRepoDetails(url);
    const commitSha = repoDetails.branch.commit.sha!;

    if (options?.etag && options.etag === commitSha) {
      throw new NotModifiedError();
    }

    const { headers } = await this.deps.credentialsProvider.getCredentials({
      url,
    });

    // archive_url looks like "https://api.github.com/repos/owner/repo/{archive_format}{/ref}"
    const archive = await this.fetchResponse(
      repoDetails.repo.archive_url
        .replace('{archive_format}', 'tarball')
        .replace('{/ref}', `/${commitSha}`),
      { headers },
    );

    const { filepath } = parseGitUrl(url);
    return await this.deps.treeResponseFactory.fromTarArchive({
      // TODO(Rugvip): Underlying implementation of fetch will be node-fetch, we probably want
      //               to stick to using that in exclusively backend code.
      stream: (archive.body as unknown) as Readable,
      subpath: filepath,
      etag: commitSha,
      filter: options?.filter,
    });
  }

  toString() {
    const { host, token } = this.config;
    return `github{host=${host},authed=${Boolean(token)}}`;
  }

  private async getRepoDetails(
    url: string,
  ): Promise<{
    repo: RestEndpointMethodTypes['repos']['get']['response']['data'];
    branch: RestEndpointMethodTypes['repos']['getBranch']['response']['data'];
  }> {
    const parsed = parseGitUrl(url);
    const { ref, full_name } = parsed;

    // Caveat: The ref will totally be incorrect if the branch name includes a
    // slash. Thus, some operations can not work on URLs containing branch
    // names that have a slash in them.

    const { headers } = await this.deps.credentialsProvider.getCredentials({
      url,
    });

    const repo: RestEndpointMethodTypes['repos']['get']['response']['data'] = await this.fetchJson(
      `${this.config.apiBaseUrl}/repos/${full_name}`,
      { headers },
    );

    // branches_url looks like "https://api.github.com/repos/owner/repo/branches{/branch}"
    const branch: RestEndpointMethodTypes['repos']['getBranch']['response']['data'] = await this.fetchJson(
      repo.branches_url.replace('{/branch}', `/${ref || repo.default_branch}`),
      { headers },
    );

    return { repo, branch };
  }

  private async fetchResponse(
    url: string | URL,
    init: RequestInit,
  ): Promise<Response> {
    const urlAsString = url.toString();

    const response = await fetch(urlAsString, init);

    if (!response.ok) {
      const message = `Request failed for ${urlAsString}, ${response.status} ${response.statusText}`;
      if (response.status === 404) {
        throw new NotFoundError(message);
      }
      throw new Error(message);
    }

    return response;
  }

  private async fetchJson(url: string | URL, init: RequestInit): Promise<any> {
    const response = await this.fetchResponse(url, init);
    return await response.json();
  }
}
