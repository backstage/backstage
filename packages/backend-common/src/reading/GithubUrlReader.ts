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
import fetch, { HeadersInit, RequestInit, Response } from 'node-fetch';
import { NotFoundError } from '../errors';
import { ReaderFactory, UrlReader } from './types';

/**
 * The configuration parameters for a single GitHub API provider.
 */
export type ProviderConfig = {
  /**
   * The host of the target that this matches on, e.g. "github.com"
   */
  host: string;

  /**
   * The base URL of the API of this provider, e.g. "https://api.github.com",
   * with no trailing slash.
   *
   * May be omitted specifically for GitHub; then it will be deduced.
   *
   * The API will always be preferred if both its base URL and a token are
   * present.
   */
  apiBaseUrl?: string;

  /**
   * The base URL of the raw fetch endpoint of this provider, e.g.
   * "https://raw.githubusercontent.com", with no trailing slash.
   *
   * May be omitted specifically for GitHub; then it will be deduced.
   *
   * The API will always be preferred if both its base URL and a token are
   * present.
   */
  rawBaseUrl?: string;

  /**
   * The authorization token to use for requests to this provider.
   *
   * If no token is specified, anonymous access is used.
   */
  token?: string;
};

export function getApiRequestOptions(provider: ProviderConfig): RequestInit {
  const headers: HeadersInit = {
    Accept: 'application/vnd.github.v3.raw',
  };

  if (provider.token) {
    headers.Authorization = `token ${provider.token}`;
  }

  return {
    headers,
  };
}

export function getRawRequestOptions(provider: ProviderConfig): RequestInit {
  const headers: HeadersInit = {};

  if (provider.token) {
    headers.Authorization = `token ${provider.token}`;
  }

  return {
    headers,
  };
}

// Converts for example
// from: https://github.com/a/b/blob/branchname/path/to/c.yaml
// to:   https://api.github.com/repos/a/b/contents/path/to/c.yaml?ref=branchname
export function getApiUrl(target: string, provider: ProviderConfig): URL {
  try {
    const { owner, name, ref, filepathtype, filepath } = parseGitUri(target);

    if (
      !owner ||
      !name ||
      !ref ||
      (filepathtype !== 'blob' && filepathtype !== 'raw')
    ) {
      throw new Error('Invalid GitHub URL or file path');
    }

    const pathWithoutSlash = filepath.replace(/^\//, '');
    return new URL(
      `${provider.apiBaseUrl}/repos/${owner}/${name}/contents/${pathWithoutSlash}?ref=${ref}`,
    );
  } catch (e) {
    throw new Error(`Incorrect URL: ${target}, ${e}`);
  }
}

// Converts for example
// from: https://github.com/a/b/blob/branchname/c.yaml
// to:   https://raw.githubusercontent.com/a/b/branchname/c.yaml
export function getRawUrl(target: string, provider: ProviderConfig): URL {
  try {
    const { owner, name, ref, filepathtype, filepath } = parseGitUri(target);

    if (
      !owner ||
      !name ||
      !ref ||
      (filepathtype !== 'blob' && filepathtype !== 'raw')
    ) {
      throw new Error('Invalid GitHub URL or file path');
    }

    const pathWithoutSlash = filepath.replace(/^\//, '');
    return new URL(
      `${provider.rawBaseUrl}/${owner}/${name}/${ref}/${pathWithoutSlash}`,
    );
  } catch (e) {
    throw new Error(`Incorrect URL: ${target}, ${e}`);
  }
}

export function readConfig(config: Config): ProviderConfig[] {
  const providers: ProviderConfig[] = [];

  const providerConfigs =
    config.getOptionalConfigArray('integrations.github') ?? [];

  // First read all the explicit providers
  for (const providerConfig of providerConfigs) {
    const host = providerConfig.getOptionalString('host') ?? 'github.com';
    let apiBaseUrl = providerConfig.getOptionalString('apiBaseUrl');
    let rawBaseUrl = providerConfig.getOptionalString('rawBaseUrl');
    const token = providerConfig.getOptionalString('token');

    if (apiBaseUrl) {
      apiBaseUrl = apiBaseUrl.replace(/\/+$/, '');
    } else if (host === 'github.com') {
      apiBaseUrl = 'https://api.github.com';
    }

    if (rawBaseUrl) {
      rawBaseUrl = rawBaseUrl.replace(/\/+$/, '');
    } else if (host === 'github.com') {
      rawBaseUrl = 'https://raw.githubusercontent.com';
    }

    if (!apiBaseUrl && !rawBaseUrl) {
      throw new Error(
        `GitHub integration for '${host}' must configure an explicit apiBaseUrl and rawBaseUrl`,
      );
    }

    providers.push({ host, apiBaseUrl, rawBaseUrl, token });
  }

  // If no explicit github.com provider was added, put one in the list as
  // a convenience
  if (!providers.some(p => p.host === 'github.com')) {
    providers.push({
      host: 'github.com',
      apiBaseUrl: 'https://api.github.com',
      rawBaseUrl: 'https://raw.githubusercontent.com',
    });
  }

  return providers;
}

/**
 * A processor that adds the ability to read files from GitHub v3 APIs, such as
 * the one exposed by GitHub itself.
 */
export class GithubUrlReader implements UrlReader {
  private config: ProviderConfig;

  static factory: ReaderFactory = ({ config }) => {
    return readConfig(config).map(provider => {
      const reader = new GithubUrlReader(provider);
      const predicate = (url: URL) => url.host === provider.host;
      return { reader, predicate };
    });
  };

  constructor(config: ProviderConfig) {
    this.config = config;
  }

  async read(url: string): Promise<Buffer> {
    const useApi =
      this.config.apiBaseUrl && (this.config.token || !this.config.rawBaseUrl);
    const ghUrl = useApi
      ? getApiUrl(url, this.config)
      : getRawUrl(url, this.config);
    const options = useApi
      ? getApiRequestOptions(this.config)
      : getRawRequestOptions(this.config);

    let response: Response;
    try {
      response = await fetch(ghUrl.toString(), options);
    } catch (e) {
      throw new Error(`Unable to read ${url}, ${e}`);
    }

    if (response.ok) {
      return response.buffer();
    }

    const message = `${url} could not be read as ${ghUrl}, ${response.status} ${response.statusText}`;
    if (response.status === 404) {
      throw new NotFoundError(message);
    }
    throw new Error(message);
  }

  toString() {
    const { host, token } = this.config;
    return `github{host=${host},authed=${Boolean(token)}}`;
  }
}
