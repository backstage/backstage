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
  BitbucketIntegration,
  getBitbucketDefaultBranch,
  getBitbucketDownloadUrl,
  getBitbucketFileFetchUrl,
  getBitbucketRequestOptions,
  ScmIntegrations,
} from '@backstage/integration';
import parseGitUrl from 'git-url-parse';
import { trimEnd } from 'lodash';
import { Minimatch } from 'minimatch';
import { LoggerService } from '@backstage/backend-plugin-api';
import { ReaderFactory, ReadTreeResponseFactory } from './types';
import { ReadUrlResponseFactory } from './ReadUrlResponseFactory';

/**
 * Implements a {@link @backstage/backend-plugin-api#UrlReaderService} for files from Bitbucket v1 and v2 APIs, such
 * as the one exposed by Bitbucket Cloud itself.
 *
 * @public
 * @deprecated in favor of BitbucketCloudUrlReader and BitbucketServerUrlReader
 */
export class BitbucketUrlReader implements UrlReaderService {
  static factory: ReaderFactory = ({ config, logger, treeResponseFactory }) => {
    const integrations = ScmIntegrations.fromConfig(config);
    return integrations.bitbucket
      .list()
      .filter(
        item =>
          !integrations.bitbucketCloud.byHost(item.config.host) &&
          !integrations.bitbucketServer.byHost(item.config.host),
      )
      .map(integration => {
        const reader = new BitbucketUrlReader(integration, logger, {
          treeResponseFactory,
        });
        const predicate = (url: URL) => url.host === integration.config.host;
        return { reader, predicate };
      });
  };

  constructor(
    private readonly integration: BitbucketIntegration,
    logger: LoggerService,
    private readonly deps: { treeResponseFactory: ReadTreeResponseFactory },
  ) {
    const { host, token, username, appPassword } = integration.config;
    const replacement =
      host === 'bitbucket.org' ? 'bitbucketCloud' : 'bitbucketServer';
    logger.warn(
      `[Deprecated] Please migrate from "integrations.bitbucket" to "integrations.${replacement}".`,
    );

    if (!token && username && !appPassword) {
      throw new Error(
        `Bitbucket integration for '${host}' has configured a username but is missing a required appPassword.`,
      );
    }
  }

  async read(url: string): Promise<Buffer> {
    const response = await this.readUrl(url);
    return response.buffer();
  }

  async readUrl(
    url: string,
    options?: UrlReaderServiceReadUrlOptions,
  ): Promise<UrlReaderServiceReadUrlResponse> {
    const { etag, lastModifiedAfter, signal } = options ?? {};
    const bitbucketUrl = getBitbucketFileFetchUrl(url, this.integration.config);
    const requestOptions = getBitbucketRequestOptions(this.integration.config);

    let response: Response;
    try {
      response = await fetch(bitbucketUrl.toString(), {
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

    const downloadUrl = await getBitbucketDownloadUrl(
      url,
      this.integration.config,
    );
    const archiveBitbucketResponse = await fetch(
      downloadUrl,
      getBitbucketRequestOptions(this.integration.config),
    );
    if (!archiveBitbucketResponse.ok) {
      const message = `Failed to read tree from ${url}, ${archiveBitbucketResponse.status} ${archiveBitbucketResponse.statusText}`;
      if (archiveBitbucketResponse.status === 404) {
        throw new NotFoundError(message);
      }
      throw new Error(message);
    }

    return await this.deps.treeResponseFactory.fromTarArchive({
      response: archiveBitbucketResponse,
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
    const { host, token, username, appPassword } = this.integration.config;
    let authed = Boolean(token);
    if (!authed) {
      authed = Boolean(username && appPassword);
    }
    return `bitbucket{host=${host},authed=${authed}}`;
  }

  private async getLastCommitShortHash(url: string): Promise<string> {
    const { resource, name: repoName, owner: project, ref } = parseGitUrl(url);

    let branch = ref;
    if (!branch) {
      branch = await getBitbucketDefaultBranch(url, this.integration.config);
    }

    const isHosted = resource === 'bitbucket.org';
    // Bitbucket Server https://docs.atlassian.com/bitbucket-server/rest/7.9.0/bitbucket-rest.html#idp222
    const commitsApiUrl = isHosted
      ? `${this.integration.config.apiBaseUrl}/repositories/${project}/${repoName}/commits/${branch}`
      : `${this.integration.config.apiBaseUrl}/projects/${project}/repos/${repoName}/commits`;

    const commitsResponse = await fetch(
      commitsApiUrl,
      getBitbucketRequestOptions(this.integration.config),
    );
    if (!commitsResponse.ok) {
      const message = `Failed to retrieve commits from ${commitsApiUrl}, ${commitsResponse.status} ${commitsResponse.statusText}`;
      if (commitsResponse.status === 404) {
        throw new NotFoundError(message);
      }
      throw new Error(message);
    }

    const commits = await commitsResponse.json();
    if (isHosted) {
      if (
        commits &&
        commits.values &&
        commits.values.length > 0 &&
        commits.values[0].hash
      ) {
        return commits.values[0].hash.substring(0, 12);
      }
    } else {
      if (
        commits &&
        commits.values &&
        commits.values.length > 0 &&
        commits.values[0].id
      ) {
        return commits.values[0].id.substring(0, 12);
      }
    }

    throw new Error(`Failed to read response from ${commitsApiUrl}`);
  }
}
