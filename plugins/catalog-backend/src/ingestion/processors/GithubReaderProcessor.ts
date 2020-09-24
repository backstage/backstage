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

import { LocationSpec } from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import parseGitUri from 'git-url-parse';
import fetch, { HeadersInit, RequestInit } from 'node-fetch';
import { Logger } from 'winston';
import * as result from './results';
import { LocationProcessor, LocationProcessorEmit } from './types';

/**
 * The configuration parameters for a single GitHub API provider.
 */
export type ProviderConfig = {
  /**
   * The prefix of the target that this matches on, e.g. "https://github.com",
   * with no trailing slash.
   */
  target: string;

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

// getRequestOptions(token?: string): RequestInit {
//   const headers: HeadersInit = {
//     Accept: 'application/vnd.github.v3.raw',
//   };

//   if (token !== '') {
//     headers.Authorization = `token ${token}`;
//   }

//   if (token === '' && this.privateToken !== '') {
//     headers.Authorization = `token ${this.privateToken}`;

export function getApiRequestOptions(
  provider: ProviderConfig,
  token?: string,
): RequestInit {
  const headers: HeadersInit = {
    Accept: 'application/vnd.github.v3.raw',
  };

  if (provider.token) {
    headers.Authorization = `token ${provider.token}`;
  }

  if (token) {
    headers.Authorization = `token ${token}`;
  }

  return {
    headers,
  };
}

export function getRawRequestOptions(
  provider: ProviderConfig,
  token?: string,
): RequestInit {
  const headers: HeadersInit = {};

  if (provider.token) {
    headers.Authorization = `token ${provider.token}`;
  }

  if (token) {
    headers.Authorization = `token ${token}`;
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
      (filepathtype !== 'blob' && filepathtype !== 'raw') ||
      !filepath?.match(/\.ya?ml$/)
    ) {
      throw new Error('Wrong URL or invalid file path');
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
      (filepathtype !== 'blob' && filepathtype !== 'raw') ||
      !filepath?.match(/\.ya?ml$/)
    ) {
      throw new Error('Wrong URL or invalid file path');
    }

    const pathWithoutSlash = filepath.replace(/^\//, '');
    return new URL(
      `${provider.rawBaseUrl}/${owner}/${name}/${ref}/${pathWithoutSlash}`,
    );
  } catch (e) {
    throw new Error(`Incorrect URL: ${target}, ${e}`);
  }
}

export function readConfig(config: Config, logger: Logger): ProviderConfig[] {
  const providers: ProviderConfig[] = [];

  // TODO(freben): Deprecate the old config root entirely in a later release
  if (config.has('catalog.processors.githubApi')) {
    logger.warn(
      'The catalog.processors.githubApi configuration key has been deprecated, please use catalog.processors.github instead',
    );
  }

  // In a previous version of the configuration, we only supported github,
  // and the "privateToken" key held the token to use for it. The new
  // configuration method is to use the "providers" key instead.
  const providerConfigs =
    config.getOptionalConfigArray('catalog.processors.github.providers') ??
    config.getOptionalConfigArray('catalog.processors.githubApi.providers') ??
    [];
  const legacyToken =
    config.getOptionalString('catalog.processors.github.privateToken') ??
    config.getOptionalString('catalog.processors.githubApi.privateToken');

  // First read all the explicit providers
  for (const providerConfig of providerConfigs) {
    const target = providerConfig.getString('target').replace(/\/+$/, '');
    let apiBaseUrl = providerConfig.getOptionalString('apiBaseUrl');
    let rawBaseUrl = providerConfig.getOptionalString('rawBaseUrl');
    const token = providerConfig.getOptionalString('token');

    if (apiBaseUrl) {
      apiBaseUrl = apiBaseUrl.replace(/\/+$/, '');
    } else if (target === 'https://github.com') {
      apiBaseUrl = 'https://api.github.com';
    }

    if (rawBaseUrl) {
      rawBaseUrl = rawBaseUrl.replace(/\/+$/, '');
    } else if (target === 'https://github.com') {
      rawBaseUrl = 'https://raw.githubusercontent.com';
    }

    if (!apiBaseUrl && !rawBaseUrl) {
      throw new Error(
        `Provider at ${target} must configure an explicit apiBaseUrl or rawBaseUrl`,
      );
    }

    providers.push({ target, apiBaseUrl, rawBaseUrl, token });
  }

  // If no explicit github.com provider was added, put one in the list as
  // a convenience
  if (!providers.some(p => p.target === 'https://github.com')) {
    providers.push({
      target: 'https://github.com',
      apiBaseUrl: 'https://api.github.com',
      rawBaseUrl: 'https://raw.githubusercontent.com',
      token: legacyToken,
    });
  }

  return providers;
}

/**
 * A processor that adds the ability to read files from GitHub v3 APIs, such as
 * the one exposed by GitHub itself.
 */
export class GithubReaderProcessor implements LocationProcessor {
  private providers: ProviderConfig[];

  static fromConfig(config: Config, logger: Logger) {
    return new GithubReaderProcessor(readConfig(config, logger));
  }

  constructor(providers: ProviderConfig[]) {
    this.providers = providers;
  }

  async readLocation(
    location: LocationSpec,
    optional: boolean,
    emit: LocationProcessorEmit,
  ): Promise<boolean> {
    // The github/api type is for backward compatibility
    if (location.type !== 'github' && location.type !== 'github/api') {
      return false;
    }

    const provider = this.providers.find(p =>
      location.target.startsWith(`${p.target}/`),
    );
    if (!provider) {
      throw new Error(
        `There is no GitHub provider that matches ${location.target}. Please add a configuration entry for it under catalog.processors.github.providers.`,
      );
    }

    try {
      const useApi =
        provider.apiBaseUrl && (provider.token || !provider.rawBaseUrl);
      const url = useApi
        ? getApiUrl(location.target, provider)
        : getRawUrl(location.target, provider);
      const options = useApi
        ? getApiRequestOptions(provider, location.token)
        : getRawRequestOptions(provider, location.token);
      const response = await fetch(url.toString(), options);

      if (response.ok) {
        const data = await response.buffer();
        emit(result.data(location, data));
      } else {
        const message = `${location.target} could not be read as ${url}, ${response.status} ${response.statusText}`;
        if (response.status === 404) {
          if (!optional) {
            emit(result.notFoundError(location, message));
          }
        } else {
          emit(result.generalError(location, message));
        }
      }
    } catch (e) {
      const message = `Unable to read ${location.type} ${location.target}, ${e}`;
      emit(result.generalError(location, message));
    }

    return true;
  }
}
