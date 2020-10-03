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

import fetch, { RequestInit, HeadersInit, Response } from 'node-fetch';
import { Config } from '@backstage/config';
import { ReaderFactory, UrlReader } from './types';
import { NotFoundError } from '../errors';

type Options = {
  // TODO: added here for future support, but we only allow bitbucket.org for now
  host: string;
  auth?: {
    username: string;
    appPassword: string;
  };
};

function readConfig(config: Config): Options[] {
  const optionsArr = Array<Options>();

  const providerConfigs =
    config.getOptionalConfigArray('integrations.bitbucket') ?? [];

  for (const providerConfig of providerConfigs) {
    const host = providerConfig.getOptionalString('host') ?? 'bitbucket.org';

    let auth;
    if (providerConfig.has('username')) {
      const username = providerConfig.getString('username');
      const appPassword = providerConfig.getString('appPassword');
      auth = { username, appPassword };
    }

    optionsArr.push({ host, auth });
  }

  // As a convenience we always make sure there's at least an unauthenticated
  // reader for public bitbucket repos.
  if (!optionsArr.some(p => p.host === 'bitbucket.org')) {
    optionsArr.push({ host: 'bitbucket.org' });
  }

  return optionsArr;
}

export class BitbucketUrlReader implements UrlReader {
  static factory: ReaderFactory = ({ config }) => {
    return readConfig(config).map(options => {
      const reader = new BitbucketUrlReader(options);
      const predicate = (url: URL) => url.host === options.host;
      return { reader, predicate };
    });
  };

  constructor(private readonly options: Options) {
    if (options.host !== 'bitbucket.org') {
      throw Error(
        `Bitbucket integration currently only supports 'bitbucket.org', tried to use host '${options.host}'`,
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

    if (response.ok) {
      return response.buffer();
    }

    const message = `${url} could not be read as ${builtUrl}, ${response.status} ${response.statusText}`;
    if (response.status === 404) {
      throw new NotFoundError(message);
    }
    throw new Error(message);
  }

  // Converts
  // from: https://bitbucket.org/orgname/reponame/src/master/file.yaml
  // to:   https://api.bitbucket.org/2.0/repositories/orgname/reponame/src/master/file.yaml
  private buildRawUrl(target: string): URL {
    try {
      const url = new URL(target);

      const [
        empty,
        userOrOrg,
        repoName,
        srcKeyword,
        ref,
        ...restOfPath
      ] = url.pathname.split('/');

      if (
        url.hostname !== 'bitbucket.org' ||
        empty !== '' ||
        userOrOrg === '' ||
        repoName === '' ||
        srcKeyword !== 'src'
      ) {
        throw new Error('Wrong Bitbucket URL or Invalid file path');
      }

      // transform to api
      url.pathname = [
        empty,
        '2.0',
        'repositories',
        userOrOrg,
        repoName,
        'src',
        ref,
        ...restOfPath,
      ].join('/');
      url.hostname = 'api.bitbucket.org';
      url.protocol = 'https';

      return url;
    } catch (e) {
      throw new Error(`Incorrect url: ${target}, ${e}`);
    }
  }

  private getRequestOptions(): RequestInit {
    const headers: HeadersInit = {};

    if (this.options.auth) {
      headers.Authorization = `Basic ${Buffer.from(
        `${this.options.auth.username}:${this.options.auth.appPassword}`,
        'utf8',
      ).toString('base64')}`;
    }

    return {
      headers,
    };
  }

  toString() {
    const { host, auth } = this.options;
    return `bitbucket{host=${host},authed=${Boolean(auth)}}`;
  }
}
