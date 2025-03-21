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
} from '@backstage/backend-plugin-api';
import {
  assertError,
  NotFoundError,
  NotModifiedError,
} from '@backstage/errors';
import {
  BitbucketServerIntegration,
  getBitbucketServerDownloadUrl,
  getBitbucketServerFileFetchUrl,
  getBitbucketServerRequestOptions,
  ScmIntegrations,
} from '@backstage/integration';
import parseGitUrl from 'git-url-parse';
import { trimEnd } from 'lodash';
import { Minimatch } from 'minimatch';
import { ReaderFactory, ReadTreeResponseFactory } from './types';
import { ReadUrlResponseFactory } from './ReadUrlResponseFactory';

import pThrottle from 'p-throttle';

// 1 per second
const throttle = pThrottle({
  limit: 1,
  interval: 1000,
});

const throttledFetch = throttle(
  async (url: RequestInfo, options?: RequestInit) => {
    return await fetch(url, options);
  },
);

/**
 * Implements a {@link @backstage/backend-plugin-api#UrlReaderService} for files from Bitbucket Server APIs.
 *
 * @public
 */
export class BitbucketServerUrlReader implements UrlReaderService {
  static factory: ReaderFactory = ({ config, treeResponseFactory }) => {
    const integrations = ScmIntegrations.fromConfig(config);
    return integrations.bitbucketServer.list().map(integration => {
      const reader = new BitbucketServerUrlReader(integration, {
        treeResponseFactory,
      });
      const predicate = (url: URL) => url.host === integration.config.host;
      return { reader, predicate };
    });
  };

  constructor(
    private readonly integration: BitbucketServerIntegration,
    private readonly deps: { treeResponseFactory: ReadTreeResponseFactory },
  ) {}

  async read(url: string): Promise<Buffer> {
    const response = await this.readUrl(url);
    return response.buffer();
  }

  async readUrl(
    url: string,
    options?: UrlReaderServiceReadUrlOptions,
  ): Promise<UrlReaderServiceReadUrlResponse> {
    const { etag, lastModifiedAfter, signal } = options ?? {};
    const bitbucketUrl = getBitbucketServerFileFetchUrl(
      url,
      this.integration.config,
    );
    const requestOptions = getBitbucketServerRequestOptions(
      this.integration.config,
    );

    let response: Response;
    try {
      response = await throttledFetch(bitbucketUrl.toString(), {
        headers: {
          ...requestOptions.headers,
          ...(etag && { 'If-None-Match': etag }),
          ...(lastModifiedAfter && {
            'If-Modified-Since': lastModifiedAfter.toUTCString(),
          }),
        },
        // TODO(freben): The signal cast is there because pre-3.x versions of
        // node-fetch have a very slightly deviating AbortSignal type signature.
        // The difference does not affect us in practice however. The cast can be
        // removed after we support ESM for CLI dependencies and migrate to
        // version 3 of node-fetch.
        // https://github.com/backstage/backstage/issues/8242
        ...(signal && { signal: signal as any }),
      });
    } catch (e) {
      throw new Error(`Unable to read ${url}, ${e}`);
    }

    if (response.status === 304) {
      throw new NotModifiedError();
    }

    if (response.ok) {
      return ReadUrlResponseFactory.fromResponse(response);
    }

    const message = `${url} could not be read as ${bitbucketUrl}, ${response.status} ${response.statusText}`;
    if (response.status === 404) {
      throw new NotFoundError(message);
    }
    throw new Error(message);
  }

  async readTree(
    url: string,
    options?: UrlReaderServiceReadTreeOptions,
  ): Promise<UrlReaderServiceReadTreeResponse> {
    const { filepath } = parseGitUrl(url);

    const lastCommitShortHash = await this.getLastCommitShortHash(url);
    if (options?.etag && options.etag === lastCommitShortHash) {
      throw new NotModifiedError();
    }

    const downloadUrl = await getBitbucketServerDownloadUrl(
      url,
      this.integration.config,
    );
    const archiveResponse = await throttledFetch(
      downloadUrl,
      getBitbucketServerRequestOptions(this.integration.config),
    );
    if (!archiveResponse.ok) {
      const message = `Failed to read tree from ${url}, ${archiveResponse.status} ${archiveResponse.statusText}`;
      if (archiveResponse.status === 404) {
        throw new NotFoundError(message);
      }
      throw new Error(message);
    }

    return await this.deps.treeResponseFactory.fromTarArchive({
      response: archiveResponse,
      subpath: filepath,
      etag: lastCommitShortHash,
      filter: options?.filter,
    });
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

    const matcher = new Minimatch(filepath);

    // TODO(freben): For now, read the entire repo and filter through that. In
    // a future improvement, we could be smart and try to deduce that non-glob
    // prefixes (like for filepaths such as some-prefix/**/a.yaml) can be used
    // to get just that part of the repo.
    const treeUrl = trimEnd(url.replace(filepath, ''), '/');

    const tree = await this.readTree(treeUrl, {
      etag: options?.etag,
      filter: path => matcher.match(path),
    });
    const files = await tree.files();

    return {
      etag: tree.etag,
      files: files.map(file => ({
        url: this.integration.resolveUrl({
          url: `/${file.path}`,
          base: url,
        }),
        content: file.content,
        lastModifiedAt: file.lastModifiedAt,
      })),
    };
  }

  toString() {
    const { host, token } = this.integration.config;
    const authed = Boolean(token);
    return `bitbucketServer{host=${host},authed=${authed}}`;
  }

  private async getLastCommitShortHash(url: string): Promise<string> {
    const { name: repoName, owner: project, ref: branch } = parseGitUrl(url);

    // If a branch is provided use that otherwise fall back to the default branch
    const branchParameter = branch
      ? `?filterText=${encodeURIComponent(branch)}`
      : '/default';

    // https://docs.atlassian.com/bitbucket-server/rest/7.9.0/bitbucket-rest.html#idp211 (branches docs)
    const branchListUrl = `${this.integration.config.apiBaseUrl}/projects/${project}/repos/${repoName}/branches${branchParameter}`;

    const branchListResponse = await throttledFetch(
      branchListUrl,
      getBitbucketServerRequestOptions(this.integration.config),
    );
    if (!branchListResponse.ok) {
      const message = `Failed to retrieve branch list from ${branchListUrl}, ${branchListResponse.status} ${branchListResponse.statusText}`;
      if (branchListResponse.status === 404) {
        throw new NotFoundError(message);
      }
      throw new Error(message);
    }

    const branchMatches = await branchListResponse.json();

    if (branchMatches && branchMatches.size > 0) {
      const exactBranchMatch = branchMatches.values.filter(
        (branchDetails: { displayId: string }) =>
          branchDetails.displayId === branch,
      )[0];
      return exactBranchMatch.latestCommit.substring(0, 12);
    }

    // Handle when no branch is provided using the default as the fallback
    if (!branch && branchMatches) {
      return branchMatches.latestCommit.substring(0, 12);
    }

    throw new Error(
      `Failed to find Last Commit using ${
        branch ? `branch "${branch}"` : 'default branch'
      } in response from ${branchListUrl}`,
    );
  }
}
