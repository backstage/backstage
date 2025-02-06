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
  getAzureCommitsUrl,
  getAzureDownloadUrl,
  getAzureFileFetchUrl,
  AzureDevOpsCredentialsProvider,
  DefaultAzureDevOpsCredentialsProvider,
  ScmIntegrations,
  AzureIntegration,
} from '@backstage/integration';
import parseGitUrl from 'git-url-parse';
import { Minimatch } from 'minimatch';
import {
  assertError,
  NotFoundError,
  NotModifiedError,
} from '@backstage/errors';
import { ReadTreeResponseFactory, ReaderFactory } from './types';
import { ReadUrlResponseFactory } from './ReadUrlResponseFactory';

/**
 * Implements a {@link @backstage/backend-plugin-api#UrlReaderService} for Azure repos.
 *
 * @public
 */
export class AzureUrlReader implements UrlReaderService {
  static factory: ReaderFactory = ({ config, treeResponseFactory }) => {
    const integrations = ScmIntegrations.fromConfig(config);
    const credentialProvider =
      DefaultAzureDevOpsCredentialsProvider.fromIntegrations(integrations);
    return integrations.azure.list().map(integration => {
      const reader = new AzureUrlReader(integration, {
        treeResponseFactory,
        credentialsProvider: credentialProvider,
      });
      const predicate = (url: URL) => url.host === integration.config.host;
      return { reader, predicate };
    });
  };

  constructor(
    private readonly integration: AzureIntegration,
    private readonly deps: {
      treeResponseFactory: ReadTreeResponseFactory;
      credentialsProvider: AzureDevOpsCredentialsProvider;
    },
  ) {}

  async read(url: string): Promise<Buffer> {
    const response = await this.readUrl(url);
    return response.buffer();
  }

  async readUrl(
    url: string,
    options?: UrlReaderServiceReadUrlOptions,
  ): Promise<UrlReaderServiceReadUrlResponse> {
    // TODO: etag is not implemented yet.
    const { signal } = options ?? {};

    const builtUrl = getAzureFileFetchUrl(url);
    let response: Response;
    try {
      const credentials = await this.deps.credentialsProvider.getCredentials({
        url: builtUrl,
      });
      response = await fetch(builtUrl, {
        headers: credentials?.headers,
        // TODO(freben): The signal cast is there because pre-3.x versions of
        // node-fetch have a very slightly deviating AbortSignal type signature.
        // The difference does not affect us in practice however. The cast can
        // be removed after we support ESM for CLI dependencies and migrate to
        // version 3 of node-fetch.
        // https://github.com/backstage/backstage/issues/8242
        ...(signal && { signal: signal as any }),
      });
    } catch (e) {
      throw new Error(`Unable to read ${url}, ${e}`);
    }

    // for private repos when PAT is not valid, Azure API returns a http status code 203 with sign in page html
    if (response.ok && response.status !== 203) {
      return ReadUrlResponseFactory.fromResponse(response);
    }

    const message = `${url} could not be read as ${builtUrl}, ${response.status} ${response.statusText}`;
    if (response.status === 404) {
      throw new NotFoundError(message);
    }
    throw new Error(message);
  }

  async readTree(
    url: string,
    options?: UrlReaderServiceReadTreeOptions,
  ): Promise<UrlReaderServiceReadTreeResponse> {
    const { etag, filter, signal } = options ?? {};

    // TODO: Support filepath based reading tree feature like other providers

    // Get latest commit SHA

    const credentials = await this.deps.credentialsProvider.getCredentials({
      url: url,
    });

    const commitsAzureResponse = await fetch(getAzureCommitsUrl(url), {
      headers: credentials?.headers,
    });
    if (!commitsAzureResponse.ok) {
      const message = `Failed to read tree from ${url}, ${commitsAzureResponse.status} ${commitsAzureResponse.statusText}`;
      if (commitsAzureResponse.status === 404) {
        throw new NotFoundError(message);
      }
      throw new Error(message);
    }

    const commitSha = (await commitsAzureResponse.json()).value[0].commitId;
    if (etag && etag === commitSha) {
      throw new NotModifiedError();
    }

    const archiveAzureResponse = await fetch(getAzureDownloadUrl(url), {
      headers: {
        ...credentials?.headers,
        Accept: 'application/zip',
      },
      // TODO(freben): The signal cast is there because pre-3.x versions of
      // node-fetch have a very slightly deviating AbortSignal type signature.
      // The difference does not affect us in practice however. The cast can be
      // removed after we support ESM for CLI dependencies and migrate to
      // version 3 of node-fetch.
      // https://github.com/backstage/backstage/issues/8242
      ...(signal && { signal: signal as any }),
    });
    if (!archiveAzureResponse.ok) {
      const message = `Failed to read tree from ${url}, ${archiveAzureResponse.status} ${archiveAzureResponse.statusText}`;
      if (archiveAzureResponse.status === 404) {
        throw new NotFoundError(message);
      }
      throw new Error(message);
    }

    // When downloading a zip archive from azure on a subpath we get an extra directory
    // layer added at the top. With for example the file /a/b/c.txt and a download of
    // /a/b, we'll see /b/c.txt in the zip archive. This picks out /b so that we can remove it.
    let subpath;
    const path = new URL(url).searchParams.get('path');
    if (path) {
      subpath = path.split('/').filter(Boolean).slice(-1)[0];
    }

    return await this.deps.treeResponseFactory.fromZipArchive({
      response: archiveAzureResponse,
      etag: commitSha,
      filter,
      subpath,
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

    const treeUrl = new URL(url);

    const path = treeUrl.searchParams.get('path');
    const matcher = path && new Minimatch(path.replace(/^\/+/, ''));

    // TODO(freben): For now, read the entire repo and filter through that. In
    // a future improvement, we could be smart and try to deduce that non-glob
    // prefixes (like for filepaths such as some-prefix/**/a.yaml) can be used
    // to get just that part of the repo.
    treeUrl.searchParams.delete('path');

    const tree = await this.readTree(treeUrl.toString(), {
      etag: options?.etag,
      signal: options?.signal,
      filter: p => (matcher ? matcher.match(p) : true),
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
    const { host, credentials } = this.integration.config;
    return `azure{host=${host},authed=${Boolean(
      credentials !== undefined && credentials.length > 0,
    )}}`;
  }
}
