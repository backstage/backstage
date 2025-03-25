/*
 * Copyright 2022 The Backstage Authors
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
import { Base64Decode } from 'base64-stream';
import fetch, { Response } from 'node-fetch';
import { Readable } from 'stream';
import {
  GerritIntegration,
  ScmIntegrations,
  buildGerritGitilesArchiveUrlFromLocation,
  getGerritBranchApiUrl,
  getGerritFileContentsApiUrl,
  getGerritRequestOptions,
  parseGerritJsonResponse,
  parseGitilesUrlRef,
} from '@backstage/integration';
import {
  NotFoundError,
  NotModifiedError,
  ResponseError,
  assertError,
} from '@backstage/errors';
import { ReadTreeResponseFactory, ReaderFactory } from './types';
import { Minimatch } from 'minimatch';
import { getGitilesAuthenticationUrl } from '@backstage/integration';

/**
 * Implements a {@link @backstage/backend-plugin-api#UrlReaderService} for files in Gerrit.
 *
 * @remarks
 * To be able to link to Git contents for Gerrit providers in a user friendly
 * way we are depending on that there is a Gitiles installation somewhere
 * that we can link to. It is perfectly possible to integrate Gerrit with
 * Backstage without Gitiles since all API calls goes directly to Gerrit.
 * However if Gitiles is configured, readTree will use it to fetch
 * an archive instead of cloning the repository.
 *
 * The "host" variable in the config is the Gerrit host. The address where
 * Gitiles is installed may be on the same host but it could be on a
 * separate host. For example a Gerrit instance could be hosted on
 * "gerrit-review.company.com" but the repos could be browsable on a separate
 * host, e.g. "gerrit.company.com" and the human readable URL would then
 * not point to the API host.
 *
 * @public
 */
export class GerritUrlReader implements UrlReaderService {
  static factory: ReaderFactory = ({ config, treeResponseFactory }) => {
    const integrations = ScmIntegrations.fromConfig(config);
    if (!integrations.gerrit) {
      return [];
    }
    return integrations.gerrit.list().map(integration => {
      const reader = new GerritUrlReader(integration, { treeResponseFactory });
      const predicate = (url: URL) => {
        const gitilesUrl = new URL(integration.config.gitilesBaseUrl!);
        // If gitilesUrl is not specified it will default to
        // "integration.config.host".
        return url.host === gitilesUrl.host;
      };
      return { reader, predicate };
    });
  };

  constructor(
    private readonly integration: GerritIntegration,
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
    const apiUrl = getGerritFileContentsApiUrl(this.integration.config, url);
    let response: Response;
    try {
      response = await fetch(apiUrl, {
        method: 'GET',
        ...getGerritRequestOptions(this.integration.config),
        // TODO(freben): The signal cast is there because pre-3.x versions of
        // node-fetch have a very slightly deviating AbortSignal type signature.
        // The difference does not affect us in practice however. The cast can
        // be removed after we support ESM for CLI dependencies and migrate to
        // version 3 of node-fetch.
        // https://github.com/backstage/backstage/issues/8242
        signal: options?.signal as any,
      });
    } catch (e) {
      throw new Error(`Unable to read gerrit file ${url}, ${e}`);
    }

    if (response.ok) {
      let responseBody: string;
      return {
        buffer: async () => {
          if (responseBody === undefined) {
            responseBody = await response.text();
          }
          return Buffer.from(responseBody, 'base64');
        },
        stream: () => {
          const readable = Readable.from(response.body);
          return readable.pipe(new Base64Decode());
        },
      };
    }
    if (response.status === 404) {
      throw new NotFoundError(`File ${url} not found.`);
    }
    throw new Error(
      `${url} could not be read as ${apiUrl}, ${response.status} ${response.statusText}`,
    );
  }

  async readTree(
    url: string,
    options?: UrlReaderServiceReadTreeOptions,
  ): Promise<UrlReaderServiceReadTreeResponse> {
    const urlRevision = await this.getRevisionForUrl(url, options);

    return this.readTreeFromGitiles(url, urlRevision, options);
  }

  async search(
    url: string,
    options?: UrlReaderServiceSearchOptions,
  ): Promise<UrlReaderServiceSearchResponse> {
    const { path } = parseGitilesUrlRef(this.integration.config, url);

    if (!path.match(/[*?]/)) {
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

    const urlRevision = await this.getRevisionForUrl(url, options);

    const files = await this.searchFilesFromGitiles(url, options);

    return { files, etag: urlRevision };
  }

  toString() {
    const { host, password } = this.integration.config;
    return `gerrit{host=${host},authed=${Boolean(password)}}`;
  }

  private async readTreeFromGitiles(
    url: string,
    revision: string,
    options?: UrlReaderServiceReadTreeOptions,
  ) {
    const archiveUrl = buildGerritGitilesArchiveUrlFromLocation(
      this.integration.config,
      url,
    );
    const archiveResponse = await fetch(archiveUrl, {
      ...getGerritRequestOptions(this.integration.config),
      // TODO(freben): The signal cast is there because pre-3.x versions of
      // node-fetch have a very slightly deviating AbortSignal type signature.
      // The difference does not affect us in practice however. The cast can
      // be removed after we support ESM for CLI dependencies and migrate to
      // version 3 of node-fetch.
      // https://github.com/backstage/backstage/issues/8242
      signal: options?.signal as any,
    });

    if (archiveResponse.status === 404) {
      throw new NotFoundError(`Not found: ${archiveUrl}`);
    }

    if (!archiveResponse.ok) {
      throw new Error(
        `${url} could not be read as ${archiveUrl}, ${archiveResponse.status} ${archiveResponse.statusText}`,
      );
    }

    return await this.deps.treeResponseFactory.fromTarArchive({
      stream: archiveResponse.body as unknown as Readable,
      etag: revision,
      filter: options?.filter,
      stripFirstDirectory: false,
    });
  }

  private async getRevisionForUrl(
    url: string,
    options?: UrlReaderServiceReadTreeOptions,
  ): Promise<string> {
    const { ref, refType } = parseGitilesUrlRef(this.integration.config, url);
    // The url points to a static revision.
    if (refType === 'sha') {
      if (options?.etag === ref) {
        throw new NotModifiedError();
      }
      return ref;
    }

    const apiUrl = getGerritBranchApiUrl(this.integration.config, url);
    let response: Response;
    try {
      response = await fetch(apiUrl, {
        method: 'GET',
        ...getGerritRequestOptions(this.integration.config),
      });
    } catch (e) {
      throw new Error(`Unable to read branch state ${url}, ${e}`);
    }

    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }

    const branchInfo = (await parseGerritJsonResponse(response as any)) as {
      revision: string;
    };
    if (options?.etag === branchInfo.revision) {
      throw new NotModifiedError();
    }
    return branchInfo.revision;
  }

  private async searchFilesFromGitiles(
    url: string,
    options?: UrlReaderServiceReadTreeOptions,
  ): Promise<UrlReaderServiceSearchResponse['files']> {
    const { path, basePath } = parseGitilesUrlRef(this.integration.config, url);

    const treeUrl = `${basePath}/?format=JSON&recursive`.replace(
      this.integration.config.gitilesBaseUrl,
      getGitilesAuthenticationUrl(this.integration.config),
    );

    const treeResponse = await fetch(treeUrl, {
      ...getGerritRequestOptions(this.integration.config),
      // TODO(freben): The signal cast is there because pre-3.x versions of
      // node-fetch have a very slightly deviating AbortSignal type signature.
      // The difference does not affect us in practice however. The cast can
      // be removed after we support ESM for CLI dependencies and migrate to
      // version 3 of node-fetch.
      // https://github.com/backstage/backstage/issues/8242
      signal: options?.signal as any,
    });
    if (!treeResponse.ok) {
      throw await ResponseError.fromResponse(treeResponse);
    }

    const res = (await parseGerritJsonResponse(treeResponse as any)) as {
      id: string;
      entries: { mode: number; type: string; id: string; name: string }[];
    };

    const matcher = new Minimatch(decodeURIComponent(path).replace(/^\/+/, ''));

    const matching = res.entries.filter(
      item => item.type === 'blob' && item.name && matcher.match(item.name),
    );

    return matching.map(item => ({
      url: `${basePath}/${item.name}`,
      content: async () => {
        const apiUrl = getGerritFileContentsApiUrl(
          this.integration.config,
          `${basePath}/${item.name}`,
        );
        const response = await fetch(apiUrl, {
          method: 'GET',
          ...getGerritRequestOptions(this.integration.config),
          // TODO(freben): The signal cast is there because pre-3.x versions of
          // node-fetch have a very slightly deviating AbortSignal type signature.
          // The difference does not affect us in practice however. The cast can
          // be removed after we support ESM for CLI dependencies and migrate to
          // version 3 of node-fetch.
          // https://github.com/backstage/backstage/issues/8242
          signal: options?.signal as any,
        });

        const responseBody = await response.text();
        return Buffer.from(responseBody, 'base64');
      },
    }));
  }
}
