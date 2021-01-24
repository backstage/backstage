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
  GitHubIntegrationConfig,
  readGitHubIntegrationConfigs,
  getGitHubFileFetchUrl,
  GithubCredentialsProvider,
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
    const { ref, filepath, full_name } = parseGitUrl(url);
    // Caveat: The ref will totally be incorrect if the branch name includes a /
    // Thus, readTree can not work on url containing branch name that has a /

    const { headers } = await this.deps.credentialsProvider.getCredentials({
      url,
    });

    // Get GitHub API urls for the repository
    const repoGitHubResponse = await fetch(
      new URL(`${this.config.apiBaseUrl}/repos/${full_name}`).toString(),
      {
        headers,
      },
    );
    if (!repoGitHubResponse.ok) {
      const message = `Failed to read tree (repository) from ${url}, ${repoGitHubResponse.status} ${repoGitHubResponse.statusText}`;
      if (repoGitHubResponse.status === 404) {
        throw new NotFoundError(message);
      }
      throw new Error(message);
    }

    const repoResponseJson = await repoGitHubResponse.json();

    // ref is an empty string if no branch is set in provided url to readTree.
    // Use GitHub API to get the default branch of the repository.
    const branch = ref || repoResponseJson.default_branch;
    const branchesApiUrl = repoResponseJson.branches_url;
    const archiveApiUrl = repoResponseJson.archive_url;

    // Fetch the latest commit in the provided or default branch to compare against
    // the provided sha.
    const branchGitHubResponse = await fetch(
      // branchesApiUrl looks like "https://api.github.com/repos/owner/repo/branches{/branch}"
      branchesApiUrl.replace('{/branch}', `/${branch}`),
      {
        headers,
      },
    );
    if (!branchGitHubResponse.ok) {
      const message = `Failed to read tree (branch) from ${url}, ${branchGitHubResponse.status} ${branchGitHubResponse.statusText}`;
      if (branchGitHubResponse.status === 404) {
        throw new NotFoundError(message);
      }
      throw new Error(message);
    }
    const commitSha = (await branchGitHubResponse.json()).commit.sha;

    if (options?.etag && options.etag === commitSha) {
      throw new NotModifiedError();
    }

    const archive = await fetch(
      // archiveApiUrl looks like "https://api.github.com/repos/owner/repo/{archive_format}{/ref}"
      archiveApiUrl
        .replace('{archive_format}', 'tarball')
        .replace('{/ref}', `/${commitSha}`),
      { headers },
    );
    if (!archive.ok) {
      const message = `Failed to read tree (archive) from ${url}, ${archive.status} ${archive.statusText}`;
      if (archive.status === 404) {
        throw new NotFoundError(message);
      }
      throw new Error(message);
    }

    // Get the filename of archive from the header of the response
    const contentDispositionHeader = archive.headers.get(
      'content-disposition',
    ) as string;
    if (!contentDispositionHeader) {
      throw new Error(
        `Failed to read tree from ${url}. ` +
          'GitHub API response for downloading archive does not contain content-disposition header ',
      );
    }
    const fileNameRegEx = new RegExp(
      /^attachment; filename=(?<fileName>.*).tar.gz$/,
    );
    const archiveFileName = contentDispositionHeader.match(fileNameRegEx)
      ?.groups?.fileName;
    if (!archiveFileName) {
      throw new Error(
        `Failed to read tree from ${url}. GitHub API response for downloading archive has an unexpected ` +
          `format of content-disposition header ${contentDispositionHeader} `,
      );
    }

    // The path includes the name of the directory inside the tarball and a sub path
    // if requested in readTree.
    const path = `${archiveFileName}/${filepath}`;

    return await this.deps.treeResponseFactory.fromTarArchive({
      // TODO(Rugvip): Underlying implementation of fetch will be node-fetch, we probably want
      //               to stick to using that in exclusively backend code.
      stream: (archive.body as unknown) as Readable,
      path,
      etag: commitSha,
      filter: options?.filter,
    });
  }

  toString() {
    const { host, token } = this.config;
    return `github{host=${host},authed=${Boolean(token)}}`;
  }
}
