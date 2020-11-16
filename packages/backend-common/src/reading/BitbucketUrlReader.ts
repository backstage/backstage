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
  readBitbucketIntegrationConfigs,
} from '@backstage/integration';
import fetch from 'cross-fetch';
import parseGitUri from 'git-url-parse';
import { NotFoundError } from '../errors';
import { ReaderFactory, ReadTreeResponse, UrlReader } from './types';

export function getApiRequestOptions(
  provider: BitbucketIntegrationConfig,
): RequestInit {
  const headers: HeadersInit = {};

  if (provider.token) {
    headers.Authorization = `Bearer ${provider.token}`;
  } else if (provider.username && provider.appPassword) {
    headers.Authorization = `Basic ${Buffer.from(
      `${provider.username}:${provider.appPassword}`,
      'utf8',
    ).toString('base64')}`;
  }

  return {
    headers,
  };
}

// Converts for example
// from: https://bitbucket.org/orgname/reponame/src/master/file.yaml
// to:   https://api.bitbucket.org/2.0/repositories/orgname/reponame/src/master/file.yaml
export function getApiUrl(
  target: string,
  provider: BitbucketIntegrationConfig,
): URL {
  try {
    const { owner, name, ref, filepathtype, filepath } = parseGitUri(target);
    if (
      !owner ||
      !name ||
      (filepathtype !== 'browse' &&
        filepathtype !== 'raw' &&
        filepathtype !== 'src')
    ) {
      throw new Error('Invalid Bitbucket URL or file path');
    }

    const pathWithoutSlash = filepath.replace(/^\//, '');

    if (provider.host === 'bitbucket.org') {
      if (!ref) {
        throw new Error('Invalid Bitbucket URL or file path');
      }
      return new URL(
        `${provider.apiBaseUrl}/repositories/${owner}/${name}/src/${ref}/${pathWithoutSlash}`,
      );
    }
    return new URL(
      `${provider.apiBaseUrl}/projects/${owner}/repos/${name}/raw/${pathWithoutSlash}?at=${ref}`,
    );
  } catch (e) {
    throw new Error(`Incorrect URL: ${target}, ${e}`);
  }
}

/**
 * A processor that adds the ability to read files from Bitbucket v1 and v2 APIs, such as
 * the one exposed by Bitbucket Cloud itself.
 */
export class BitbucketUrlReader implements UrlReader {
  private readonly config: BitbucketIntegrationConfig;

  static factory: ReaderFactory = ({ config }) => {
    const configs = readBitbucketIntegrationConfigs(
      config.getOptionalConfigArray('integrations.bitbucket') ?? [],
    );
    return configs.map(provider => {
      const reader = new BitbucketUrlReader(provider);
      const predicate = (url: URL) => url.host === provider.host;
      return { reader, predicate };
    });
  };

  constructor(config: BitbucketIntegrationConfig) {
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
  }

  async read(url: string): Promise<Buffer> {
    const bitbucketUrl = getApiUrl(url, this.config);

    const options = getApiRequestOptions(this.config);

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

  readTree(): Promise<ReadTreeResponse> {
    throw new Error('BitbucketUrlReader does not implement readTree');
  }

  toString() {
    const { host, token, username, appPassword } = this.config;
    let authed = Boolean(token);
    if (!authed) {
      authed = Boolean(username && appPassword);
    }
    return `bitbucket{host=${host},authed=${authed}}`;
  }
}
