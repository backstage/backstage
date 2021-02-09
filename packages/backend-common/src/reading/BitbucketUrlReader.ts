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
  BitbucketIntegrationConfig,
  getBitbucketDefaultBranch,
  getBitbucketDownloadUrl,
  getBitbucketFileFetchUrl,
  getBitbucketRequestOptions,
  readBitbucketIntegrationConfigs,
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

/**
 * A processor that adds the ability to read files from Bitbucket v1 and v2 APIs, such as
 * the one exposed by Bitbucket Cloud itself.
 */
export class BitbucketUrlReader implements UrlReader {
  private readonly config: BitbucketIntegrationConfig;
  private readonly treeResponseFactory: ReadTreeResponseFactory;

  static factory: ReaderFactory = ({ config, treeResponseFactory }) => {
    const configs = readBitbucketIntegrationConfigs(
      config.getOptionalConfigArray('integrations.bitbucket') ?? [],
    );
    return configs.map(provider => {
      const reader = new BitbucketUrlReader(provider, { treeResponseFactory });
      const predicate = (url: URL) => url.host === provider.host;
      return { reader, predicate };
    });
  };

  constructor(
    config: BitbucketIntegrationConfig,
    deps: { treeResponseFactory: ReadTreeResponseFactory },
  ) {
    const { host, apiBaseUrl, token, username, appPassword } = config;

    if (!apiBaseUrl) {
      throw new Error(
        `Bitbucket integration for '${host}' must configure an explicit apiBaseUrl`,
      );
    }

    if (!token && username && !appPassword) {
      throw new Error(
        `Bitbucket integration for '${host}' has configured a username but is missing a required appPassword.`,
      );
    }

    this.config = config;
    this.treeResponseFactory = deps.treeResponseFactory;
  }

  async read(url: string): Promise<Buffer> {
    const bitbucketUrl = getBitbucketFileFetchUrl(url, this.config);
    const options = getBitbucketRequestOptions(this.config);

    let response: Response;
    try {
      response = await fetch(bitbucketUrl.toString(), options);
    } catch (e) {
      throw new Error(`Unable to read ${url}, ${e}`);
    }

    if (response.ok) {
      return Buffer.from(await response.text());
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

    const downloadUrl = await getBitbucketDownloadUrl(url, this.config);
    const archiveBitbucketResponse = await fetch(
      downloadUrl,
      getBitbucketRequestOptions(this.config),
    );
    if (!archiveBitbucketResponse.ok) {
      const message = `Failed to read tree from ${url}, ${archiveBitbucketResponse.status} ${archiveBitbucketResponse.statusText}`;
      if (archiveBitbucketResponse.status === 404) {
        throw new NotFoundError(message);
      }
      throw new Error(message);
    }

    return await this.treeResponseFactory.fromZipArchive({
      stream: (archiveBitbucketResponse.body as unknown) as Readable,
      subpath: filepath,
      etag: lastCommitShortHash,
      filter: options?.filter,
    });
  }

  async search(): Promise<SearchResponse> {
    throw new Error('BitbucketUrlReader does not implement search');
  }

  toString() {
    const { host, token, username, appPassword } = this.config;
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
      branch = await getBitbucketDefaultBranch(url, this.config);
    }

    const isHosted = resource === 'bitbucket.org';
    // Bitbucket Server https://docs.atlassian.com/bitbucket-server/rest/7.9.0/bitbucket-rest.html#idp222
    const commitsApiUrl = isHosted
      ? `${this.config.apiBaseUrl}/repositories/${project}/${repoName}/commits/${branch}`
      : `${this.config.apiBaseUrl}/projects/${project}/repos/${repoName}/commits`;

    const commitsResponse = await fetch(
      commitsApiUrl,
      getBitbucketRequestOptions(this.config),
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
