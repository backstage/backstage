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

import { Config } from '@backstage/config';
import parseGitUri from 'git-url-parse';
import fetch from 'cross-fetch';
import { NotFoundError } from '../errors';
import { ReaderFactory, UrlReader } from './types';

const DEFAULT_BASE_URL = 'https://api.bitbucket.org/2.0';

/**
 * The configuration parameters for a single Bitbucket API provider.
 */
export type ProviderConfig = {
  /**
   * The host of the target that this matches on, e.g. "bitbucket.com"
   */
  host: string;

  /**
   * The base URL of the API of this provider, e.g. "https://api.bitbucket.org/2.0",
   * with no trailing slash.
   *
   * May be omitted specifically for Bitbucket Cloud; then it will be deduced.
   *
   * The API will always be preferred if both its base URL and a token are
   * present.
   */
  apiBaseUrl?: string;

  /**
   * The authorization token to use for requests to a Bitbucket Server provider.
   *
   * See https://confluence.atlassian.com/bitbucketserver/personal-access-tokens-939515499.html
   *
   * If no token is specified, anonymous access is used.
   */
  token?: string;

  /**
   * The username to use for requests to Bitbucket Cloud (bitbucket.org).
   */
  username?: string;

  /**
   * Authentication with Bitbucket Cloud (bitbucket.org) is done using app passwords.
   *
   * See https://support.atlassian.com/bitbucket-cloud/docs/app-passwords/
   */
  appPassword?: string;
};

export function getApiRequestOptions(provider: ProviderConfig): RequestInit {
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
export function getApiUrl(target: string, provider: ProviderConfig): URL {
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

export function readConfig(config: Config): ProviderConfig[] {
  const providers: ProviderConfig[] = [];

  const providerConfigs =
    config.getOptionalConfigArray('integrations.bitbucket') ?? [];

  // First read all the explicit providers
  for (const providerConfig of providerConfigs) {
    const host = providerConfig.getOptionalString('host') ?? 'bitbucket.org';
    let apiBaseUrl = providerConfig.getOptionalString('apiBaseUrl');
    const token = providerConfig.getOptionalString('token');
    const username = providerConfig.getOptionalString('username');
    const appPassword = providerConfig.getOptionalString('appPassword');

    if (apiBaseUrl) {
      apiBaseUrl = apiBaseUrl.replace(/\/+$/, '');
    } else if (host === 'bitbucket.org') {
      apiBaseUrl = DEFAULT_BASE_URL;
    }

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

    providers.push({
      host,
      apiBaseUrl,
      token,
      username,
      appPassword,
    });
  }

  // If no explicit bitbucket.org provider was added, put one in the list as
  // a convenience
  if (!providers.some(p => p.host === 'bitbucket.org')) {
    providers.push({
      host: 'bitbucket.org',
      apiBaseUrl: DEFAULT_BASE_URL,
    });
  }

  return providers;
}

/**
 * A processor that adds the ability to read files from Bitbucket v1 and v2 APIs, such as
 * the one exposed by Bitbucket Cloud itself.
 */
export class BitbucketUrlReader implements UrlReader {
  private config: ProviderConfig;

  static factory: ReaderFactory = ({ config }) => {
    return readConfig(config).map(provider => {
      const reader = new BitbucketUrlReader(provider);
      const predicate = (url: URL) => url.host === provider.host;
      return { reader, predicate };
    });
  };

  constructor(config: ProviderConfig) {
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

  toString() {
    const { host, token, username, appPassword } = this.config;
    let authed = Boolean(token);
    if (!authed) {
      authed = Boolean(username && appPassword);
    }
    return `bitbucket{host=${host},authed=${authed}}`;
  }
}
