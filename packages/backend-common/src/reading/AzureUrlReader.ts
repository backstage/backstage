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

import fetch from 'cross-fetch';
import { Config } from '@backstage/config';
import { NotFoundError } from '../errors';
import { ReaderFactory, UrlReader } from './types';

type Options = {
  // TODO: added here for future support, but we only allow dev.azure.com for now
  host: string;
  token?: string;
};

function readConfig(config: Config): Options[] {
  const optionsArr = Array<Options>();

  const providerConfigs =
    config.getOptionalConfigArray('integrations.azure') ?? [];

  for (const providerConfig of providerConfigs) {
    const host = providerConfig.getOptionalString('host') ?? 'dev.azure.com';
    const token = providerConfig.getOptionalString('token');

    optionsArr.push({ host, token });
  }

  // As a convenience we always make sure there's at least an unauthenticated
  // reader for public azure repos.
  if (!optionsArr.some(p => p.host === 'dev.azure.com')) {
    optionsArr.push({ host: 'dev.azure.com' });
  }

  return optionsArr;
}

export class AzureUrlReader implements UrlReader {
  static factory: ReaderFactory = ({ config }) => {
    return readConfig(config).map(options => {
      const reader = new AzureUrlReader(options);
      const predicate = (url: URL) => url.host === options.host;
      return { reader, predicate };
    });
  };

  constructor(private readonly options: Options) {
    if (options.host !== 'dev.azure.com') {
      throw Error(
        `Azure integration currently only supports 'dev.azure.com', tried to use host '${options.host}'`,
      );
    }
  }

  async read(url: string): Promise<Buffer> {
    const builtUrl = this.buildRawUrl(url);

    let response: Response;
    try {
      response = await fetch(builtUrl.toString(), this.getRequestOptions());
    } catch (e) {
      throw new Error(`Unable to read ${url}, ${e}`);
    }

    // for private repos when PAT is not valid, Azure API returns a http status code 203 with sign in page html
    if (response.ok && response.status !== 203) {
      return Buffer.from(await response.text());
    }

    const message = `${url} could not be read as ${builtUrl}, ${response.status} ${response.statusText}`;
    if (response.status === 404) {
      throw new NotFoundError(message);
    }
    throw new Error(message);
  }

  // Converts
  // from: https://dev.azure.com/{organization}/{project}/_git/reponame?path={path}&version=GB{commitOrBranch}&_a=contents
  // to:   https://dev.azure.com/{organization}/{project}/_apis/git/repositories/reponame/items?path={path}&version={commitOrBranch}
  private buildRawUrl(target: string): URL {
    try {
      const url = new URL(target);

      const [
        empty,
        userOrOrg,
        project,
        srcKeyword,
        repoName,
      ] = url.pathname.split('/');

      const path = url.searchParams.get('path') || '';
      const ref = url.searchParams.get('version')?.substr(2);

      if (
        url.hostname !== 'dev.azure.com' ||
        empty !== '' ||
        userOrOrg === '' ||
        project === '' ||
        srcKeyword !== '_git' ||
        repoName === '' ||
        path === '' ||
        ref === ''
      ) {
        throw new Error('Wrong Azure Devops URL or Invalid file path');
      }

      // transform to api
      url.pathname = [
        empty,
        userOrOrg,
        project,
        '_apis',
        'git',
        'repositories',
        repoName,
        'items',
      ].join('/');

      const queryParams = [`path=${path}`];

      if (ref) {
        queryParams.push(`version=${ref}`);
      }

      url.search = queryParams.join('&');

      url.protocol = 'https';

      return url;
    } catch (e) {
      throw new Error(`Incorrect url: ${target}, ${e}`);
    }
  }

  private getRequestOptions(): RequestInit {
    const headers: HeadersInit = {};

    if (this.options.token) {
      headers.Authorization = `Basic ${Buffer.from(
        `:${this.options.token}`,
        'utf8',
      ).toString('base64')}`;
    }

    return { headers };
  }

  toString() {
    const { host, token } = this.options;
    return `azure{host=${host},authed=${Boolean(token)}}`;
  }
}
