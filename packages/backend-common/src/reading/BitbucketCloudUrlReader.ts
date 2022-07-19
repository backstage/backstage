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

import { NotFoundError, NotModifiedError } from '@backstage/errors';
import {
  BitbucketCloudIntegration,
  getBitbucketCloudDefaultBranch,
  getBitbucketCloudDownloadUrl,
  getBitbucketCloudFileFetchUrl,
  getBitbucketCloudRequestOptions,
  ScmIntegrations,
} from '@backstage/integration';
import fetch, { Response } from 'node-fetch';
import parseGitUrl from 'git-url-parse';
import { trimEnd } from 'lodash';
import { Minimatch } from 'minimatch';
import { Readable } from 'stream';
import {
  ReaderFactory,
  ReadTreeOptions,
  ReadTreeResponse,
  ReadTreeResponseFactory,
  ReadUrlOptions,
  ReadUrlResponse,
  SearchOptions,
  SearchResponse,
  UrlReader,
} from './types';
import { ReadUrlResponseFactory } from './ReadUrlResponseFactory';

/**
 * Implements a {@link UrlReader} for files from Bitbucket Cloud.
 *
 * @public
 */
export class BitbucketCloudUrlReader implements UrlReader {
  static factory: ReaderFactory = ({ config, treeResponseFactory }) => {
    const integrations = ScmIntegrations.fromConfig(config);
    return integrations.bitbucketCloud.list().map(integration => {
      const reader = new BitbucketCloudUrlReader(integration, {
        treeResponseFactory,
      });
      const predicate = (url: URL) => url.host === integration.config.host;
      return { reader, predicate };
    });
  };

  constructor(
    private readonly integration: BitbucketCloudIntegration,
    private readonly deps: { treeResponseFactory: ReadTreeResponseFactory },
  ) {
    const { host, username, appPassword } = integration.config;

    if (username && !appPassword) {
      throw new Error(
        `Bitbucket Cloud integration for '${host}' has configured a username but is missing a required appPassword.`,
      );
    }
  }

  async read(url: string): Promise<Buffer> {
    const response = await this.readUrl(url);
    return response.buffer();
  }

  async readUrl(
    url: string,
    options?: ReadUrlOptions,
  ): Promise<ReadUrlResponse> {
    const { etag, signal } = options ?? {};
    const bitbucketUrl = getBitbucketCloudFileFetchUrl(
      url,
      this.integration.config,
    );
    const requestOptions = getBitbucketCloudRequestOptions(
      this.integration.config,
    );

    let response: Response;
    try {
      response = await fetch(bitbucketUrl.toString(), {
        headers: {
          ...requestOptions.headers,
          ...(etag && { 'If-None-Match': etag }),
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
      return ReadUrlResponseFactory.fromNodeJSReadable(response.body, {
        etag: response.headers.get('ETag') ?? undefined,
      });
    }

    const message = `${url} could not be read as ${bitbucketUrl}, ${response.status} ${response.statusText}`;
    if (response.status === 404) {
      throw new NotFoundError(message);
    }
    throw new Error(message);
  }

  async readTree(
    url: string,
    options?: ReadTreeOptions,
  ): Promise<ReadTreeResponse> {
    const { filepath } = parseGitUrl(url);

    const lastCommitShortHash = await this.getLastCommitShortHash(url);
    if (options?.etag && options.etag === lastCommitShortHash) {
      throw new NotModifiedError();
    }

    const downloadUrl = await getBitbucketCloudDownloadUrl(
      url,
      this.integration.config,
    );
    const archiveResponse = await fetch(
      downloadUrl,
      getBitbucketCloudRequestOptions(this.integration.config),
    );
    if (!archiveResponse.ok) {
      const message = `Failed to read tree from ${url}, ${archiveResponse.status} ${archiveResponse.statusText}`;
      if (archiveResponse.status === 404) {
        throw new NotFoundError(message);
      }
      throw new Error(message);
    }

    return await this.deps.treeResponseFactory.fromTarArchive({
      stream: archiveResponse.body as unknown as Readable,
      subpath: filepath,
      etag: lastCommitShortHash,
      filter: options?.filter,
    });
  }

  async search(url: string, options?: SearchOptions): Promise<SearchResponse> {
    const { filepath } = parseGitUrl(url);
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
      })),
    };
  }

  toString() {
    const { host, username, appPassword } = this.integration.config;
    const authed = Boolean(username && appPassword);
    return `bitbucketCloud{host=${host},authed=${authed}}`;
  }

  private async getLastCommitShortHash(url: string): Promise<string> {
    const { name: repoName, owner: project, ref } = parseGitUrl(url);

    let branch = ref;
    if (!branch) {
      branch = await getBitbucketCloudDefaultBranch(
        url,
        this.integration.config,
      );
    }

    const commitsApiUrl = `${this.integration.config.apiBaseUrl}/repositories/${project}/${repoName}/commits/${branch}`;

    const commitsResponse = await fetch(
      commitsApiUrl,
      getBitbucketCloudRequestOptions(this.integration.config),
    );
    if (!commitsResponse.ok) {
      const message = `Failed to retrieve commits from ${commitsApiUrl}, ${commitsResponse.status} ${commitsResponse.statusText}`;
      if (commitsResponse.status === 404) {
        throw new NotFoundError(message);
      }
      throw new Error(message);
    }

    const commits = await commitsResponse.json();
    if (
      commits &&
      commits.values &&
      commits.values.length > 0 &&
      commits.values[0].hash
    ) {
      return commits.values[0].hash.substring(0, 12);
    }

    throw new Error(`Failed to read response from ${commitsApiUrl}`);
  }
}
