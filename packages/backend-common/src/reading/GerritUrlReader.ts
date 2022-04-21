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

import { NotFoundError } from '@backstage/errors';
import {
  GerritIntegration,
  getGerritFileContentsApiUrl,
  getGerritRequestOptions,
} from '@backstage/integration';
import fetch, { Response } from 'node-fetch';
import {
  ReaderFactory,
  ReadTreeResponse,
  ReadUrlOptions,
  ReadUrlResponse,
  SearchResponse,
  UrlReader,
} from './types';
import { ScmIntegrations } from '@backstage/integration';

/**
 * Implements a {@link UrlReader} for files in Gerrit.
 *
 * @remarks
 * To be able to link to Git contents for Gerrit providers in a user friendly
 * way we are depending on that there is a Gitiles installation somewhere
 * that we can link to. It is perfectly possible to integrate Gerrit with
 * Backstage without Gitiles since all API calls goes directly to Gerrit.
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
export class GerritUrlReader implements UrlReader {
  static factory: ReaderFactory = ({ config }) => {
    const integrations = ScmIntegrations.fromConfig(config);
    if (!integrations.gerrit) {
      return [];
    }
    return integrations.gerrit.list().map(integration => {
      const reader = new GerritUrlReader(integration);
      const predicate = (url: URL) => {
        const gitilesUrl = new URL(integration.config.gitilesBaseUrl!);
        // If gitilesUrl is not specfified it will default to
        // "integration.config.host".
        return url.host === gitilesUrl.host;
      };
      return { reader, predicate };
    });
  };

  constructor(private readonly integration: GerritIntegration) {}

  async read(url: string): Promise<Buffer> {
    const response = await this.readUrl(url);
    return response.buffer();
  }

  async readUrl(
    url: string,
    options?: ReadUrlOptions,
  ): Promise<ReadUrlResponse> {
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
      const responseBody = await response.text();
      return {
        buffer: async () => Buffer.from(responseBody, 'base64'),
      };
    }
    if (response.status === 404) {
      throw new NotFoundError(`File ${url} not found.`);
    }
    throw new Error(
      `${url} could not be read as ${apiUrl}, ${response.status} ${response.statusText}`,
    );
  }

  async readTree(): Promise<ReadTreeResponse> {
    throw new Error('GerritReader does not implement readTree');
  }

  async search(): Promise<SearchResponse> {
    throw new Error('GerritReader does not implement search');
  }

  toString() {
    const { host, password } = this.integration.config;
    return `gerrit{host=${host},authed=${Boolean(password)}}`;
  }
}
