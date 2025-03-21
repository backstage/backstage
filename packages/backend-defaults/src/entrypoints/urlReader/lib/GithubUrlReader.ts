/*
 * Copyright 2020 The Backstage Authors
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
  UrlReaderService,
  UrlReaderServiceReadTreeOptions,
  UrlReaderServiceReadTreeResponse,
  UrlReaderServiceReadUrlOptions,
  UrlReaderServiceReadUrlResponse,
  UrlReaderServiceSearchOptions,
  UrlReaderServiceSearchResponse,
  UrlReaderServiceSearchResponseFile,
} from '@backstage/backend-plugin-api';
import {
  getGithubFileFetchUrl,
  DefaultGithubCredentialsProvider,
  GithubCredentialsProvider,
  GithubIntegration,
  ScmIntegrations,
  GithubCredentials,
} from '@backstage/integration';
import { RestEndpointMethodTypes } from '@octokit/rest';
import fetch, { RequestInit, Response } from 'node-fetch';
import parseGitUrl from 'git-url-parse';
import { Minimatch } from 'minimatch';
import { Readable } from 'stream';
import {
  assertError,
  NotFoundError,
  NotModifiedError,
} from '@backstage/errors';
import { ReadTreeResponseFactory, ReaderFactory } from './types';
import { ReadUrlResponseFactory } from './ReadUrlResponseFactory';
import { parseLastModified } from './util';

export type GhRepoResponse =
  RestEndpointMethodTypes['repos']['get']['response']['data'];
export type GhCombinedCommitStatusResponse =
  RestEndpointMethodTypes['repos']['getCombinedStatusForRef']['response']['data'];
export type GhTreeResponse =
  RestEndpointMethodTypes['git']['getTree']['response']['data'];
export type GhBlobResponse =
  RestEndpointMethodTypes['git']['getBlob']['response']['data'];

/**
 * Implements a {@link @backstage/backend-plugin-api#UrlReaderService} for files through the GitHub v3 APIs, such as
 * the one exposed by GitHub itself.
 *
 * @public
 */
export class GithubUrlReader implements UrlReaderService {
  static factory: ReaderFactory = ({ config, treeResponseFactory }) => {
    const integrations = ScmIntegrations.fromConfig(config);
    const credentialsProvider =
      DefaultGithubCredentialsProvider.fromIntegrations(integrations);
    return integrations.github.list().map(integration => {
      const reader = new GithubUrlReader(integration, {
        treeResponseFactory,
        credentialsProvider,
      });
      const predicate = (url: URL) => url.host === integration.config.host;
      return { reader, predicate };
    });
  };

  constructor(
    private readonly integration: GithubIntegration,
    private readonly deps: {
      treeResponseFactory: ReadTreeResponseFactory;
      credentialsProvider: GithubCredentialsProvider;
    },
  ) {
    if (!integration.config.apiBaseUrl && !integration.config.rawBaseUrl) {
      throw new Error(
        `GitHub integration '${integration.title}' must configure an explicit apiBaseUrl or rawBaseUrl`,
      );
    }
  }

  async read(url: string): Promise<Buffer> {
    const response = await this.readUrl(url);
    return response.buffer();
  }

  private getCredentials = async (
    url: string,
    options?: { token?: string },
  ): Promise<GithubCredentials> => {
    if (options?.token) {
      return {
        headers: {
          Authorization: `Bearer ${options.token}`,
        },
        type: 'token',
        token: options.token,
      };
    }

    return await this.deps.credentialsProvider.getCredentials({
      url,
    });
  };

  async readUrl(
    url: string,
    options?: UrlReaderServiceReadUrlOptions,
  ): Promise<UrlReaderServiceReadUrlResponse> {
    const credentials = await this.getCredentials(url, options);

    const ghUrl = getGithubFileFetchUrl(
      url,
      this.integration.config,
      credentials,
    );

    const response = await this.fetchResponse(ghUrl, {
      headers: {
        ...credentials?.headers,
        ...(options?.etag && { 'If-None-Match': options.etag }),
        ...(options?.lastModifiedAfter && {
          'If-Modified-Since': options.lastModifiedAfter.toUTCString(),
        }),
        Accept: 'application/vnd.github.v3.raw',
      },
      // TODO(freben): The signal cast is there because pre-3.x versions of
      // node-fetch have a very slightly deviating AbortSignal type signature.
      // The difference does not affect us in practice however. The cast can
      // be removed after we support ESM for CLI dependencies and migrate to
      // version 3 of node-fetch.
      // https://github.com/backstage/backstage/issues/8242
      signal: options?.signal as any,
    });

    return ReadUrlResponseFactory.fromNodeJSReadable(response.body, {
      etag: response.headers.get('ETag') ?? undefined,
      lastModifiedAt: parseLastModified(response.headers.get('Last-Modified')),
    });
  }

  async readTree(
    url: string,
    options?: UrlReaderServiceReadTreeOptions,
  ): Promise<UrlReaderServiceReadTreeResponse> {
    const repoDetails = await this.getRepoDetails(url);
    const commitSha = repoDetails.commitSha;

    if (options?.etag && options.etag === commitSha) {
      throw new NotModifiedError();
    }

    const { filepath } = parseGitUrl(url);
    const { headers } = await this.getCredentials(url, options);

    return this.doReadTree(
      repoDetails.repo.archive_url,
      commitSha,
      filepath,
      // TODO(freben): The signal cast is there because pre-3.x versions of
      // node-fetch have a very slightly deviating AbortSignal type signature.
      // The difference does not affect us in practice however. The cast can be
      // removed after we support ESM for CLI dependencies and migrate to
      // version 3 of node-fetch.
      // https://github.com/backstage/backstage/issues/8242
      { headers, signal: options?.signal as any },
      options,
    );
  }

  async search(
    url: string,
    options?: UrlReaderServiceSearchOptions,
  ): Promise<UrlReaderServiceSearchResponse> {
    const { filepath } = parseGitUrl(url);

    // If it's a direct URL we use readUrl instead
    if (!filepath?.match(/[*?]/)) {
      try {
        const data = await this.readUrl(url, options);

        return {
          files: [
            {
              url: url,
              content: data.buffer,
              lastModifiedAt: data.lastModifiedAt,
            },
          ],
          etag: data.etag ?? '',
        };
      } catch (error) {
        assertError(error);
        if (error.name === 'NotFoundError') {
          return {
            files: [],
            etag: '',
          };
        }
        throw error;
      }
    }

    const repoDetails = await this.getRepoDetails(url);
    const commitSha = repoDetails.commitSha;

    if (options?.etag && options.etag === commitSha) {
      throw new NotModifiedError();
    }

    const { headers } = await this.getCredentials(url, options);

    const files = await this.doSearch(
      url,
      repoDetails.repo.trees_url,
      repoDetails.repo.archive_url,
      commitSha,
      filepath,
      { headers, signal: options?.signal as any },
    );

    return { files, etag: commitSha };
  }

  toString() {
    const { host, token } = this.integration.config;
    return `github{host=${host},authed=${Boolean(token)}}`;
  }

  private async doReadTree(
    archiveUrl: string,
    sha: string,
    subpath: string,
    init: RequestInit,
    options?: UrlReaderServiceReadTreeOptions,
  ): Promise<UrlReaderServiceReadTreeResponse> {
    // archive_url looks like "https://api.github.com/repos/owner/repo/{archive_format}{/ref}"
    const archive = await this.fetchResponse(
      archiveUrl
        .replace('{archive_format}', 'tarball')
        .replace('{/ref}', `/${sha}`),
      init,
    );

    return await this.deps.treeResponseFactory.fromTarArchive({
      // TODO(Rugvip): Underlying implementation of fetch will be node-fetch, we probably want
      //               to stick to using that in exclusively backend code.
      stream: Readable.from(archive.body),
      subpath,
      etag: sha,
      filter: options?.filter,
    });
  }

  private async doSearch(
    url: string,
    treesUrl: string,
    archiveUrl: string,
    sha: string,
    query: string,
    init: RequestInit,
  ): Promise<UrlReaderServiceSearchResponseFile[]> {
    function pathToUrl(path: string): string {
      // TODO(freben): Use the integration package facility for this instead
      // pathname starts as /backstage/backstage/blob/master/<path>
      const updated = new URL(url);
      const base = updated.pathname.split('/').slice(1, 5).join('/');
      updated.pathname = `${base}/${path}`;
      return updated.toString();
    }

    const matcher = new Minimatch(query.replace(/^\/+/, ''));

    // trees_url looks like "https://api.github.com/repos/octocat/Hello-World/git/trees{/sha}"
    const recursiveTree: GhTreeResponse = await this.fetchJson(
      treesUrl.replace('{/sha}', `/${sha}?recursive=true`),
      init,
    );

    // The simple case is that we got the entire tree in a single operation.
    if (!recursiveTree.truncated) {
      const matching = recursiveTree.tree.filter(
        item =>
          item.type === 'blob' &&
          item.path &&
          item.url &&
          matcher.match(item.path),
      );

      return matching.map(item => ({
        url: pathToUrl(item.path!),
        content: async () => {
          const blob: GhBlobResponse = await this.fetchJson(item.url!, init);
          return Buffer.from(blob.content, 'base64');
        },
      }));
    }

    // For larger repos, we leverage readTree and filter through that instead
    const tree = await this.doReadTree(archiveUrl, sha, '', init, {
      filter: path => matcher.match(path),
    });
    const files = await tree.files();

    return files.map(file => ({
      url: pathToUrl(file.path),
      content: file.content,
      lastModifiedAt: file.lastModifiedAt,
    }));
  }

  private async getRepoDetails(url: string): Promise<{
    commitSha: string;
    repo: {
      archive_url: string;
      trees_url: string;
    };
  }> {
    const parsed = parseGitUrl(url);
    const { ref, full_name } = parsed;

    const credentials = await this.deps.credentialsProvider.getCredentials({
      url,
    });
    const { headers } = credentials;

    const commitStatus: GhCombinedCommitStatusResponse = await this.fetchJson(
      `${this.integration.config.apiBaseUrl}/repos/${full_name}/commits/${
        ref || (await this.getDefaultBranch(full_name, credentials))
      }/status?per_page=0`,
      { headers },
    );

    return {
      commitSha: commitStatus.sha,
      repo: commitStatus.repository,
    };
  }

  private async getDefaultBranch(
    repoFullName: string,
    credentials: GithubCredentials,
  ): Promise<string> {
    const repo: GhRepoResponse = await this.fetchJson(
      `${this.integration.config.apiBaseUrl}/repos/${repoFullName}`,
      { headers: credentials.headers },
    );

    return repo.default_branch;
  }

  private async fetchResponse(
    url: string | URL,
    init: RequestInit,
  ): Promise<Response> {
    const urlAsString = url.toString();
    const response = await fetch(urlAsString, init);

    if (!response.ok) {
      let message = `Request failed for ${urlAsString}, ${response.status} ${response.statusText}`;

      if (response.status === 304) {
        throw new NotModifiedError();
      }

      if (response.status === 404) {
        throw new NotFoundError(message);
      }

      // GitHub returns a 403 response with a couple of headers indicating rate
      // limit status. See more in the GitHub docs:
      // https://docs.github.com/en/rest/overview/resources-in-the-rest-api#rate-limiting
      if (this.integration.parseRateLimitInfo(response).isRateLimited) {
        message += ' (rate limit exceeded)';
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
