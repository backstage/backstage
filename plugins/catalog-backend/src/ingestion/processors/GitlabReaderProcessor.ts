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
 * The configuration parameters for a single GitLab API provider.
 */
export type ProviderConfig = {
  /**
   * The prefix of the target that this matches on, e.g. "https://gitlab.com",
   * with no trailing slash.
   */
  target: string;

  /**
   * The base URL of the API of this provider, e.g. "https://gitlab.com/api/v4",
   * with no trailing slash.
   *
   * May be omitted specifically for GitLab; then it will be deduced.
   *
   * The API will always be preferred if both its base URL and a token are
   * present.
   */
  apiBaseUrl?: string;

  /**
   * The base URL of the raw fetch endpoint of this provider, e.g.
   * "https://gitlab.com", with no trailing slash.
   *
   * May be omitted specifically for GitLab; then it will be deduced.
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
    Accept: 'application/json',
  };

  if (provider.token) {
    headers['PRIVATE-TOKEN'] = provider.token;
  }

  return {
    headers,
  };
}

export function getRawRequestOptions(provider: ProviderConfig): RequestInit {
  const headers: HeadersInit = {};

  if (provider.token) {
    headers['PRIVATE-TOKEN'] = provider.token;
  }

  return {
    headers,
  };
}

// Converts for example
// from: https://gitlab.com/a/b/blob/branchname/path/to/c.yaml
// to:   https://gitlab.com/api/v4/repos/a/b/contents/path/to/c.yaml?ref=branchname
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
      `${provider.apiBaseUrl}/projects/${`${owner}/${name}`.replace(
        /\//g,
        '%2F',
      )}/repository/files/${pathWithoutSlash}/raw?ref=${ref}`,
    );
  } catch (e) {
    throw new Error(`Incorrect URL: ${target}, ${e}`);
  }
}

// Converts for example
// from: https://gitlab.com/a/b/blob/branchname/c.yaml
// to:   https://gitlab.com/a/b/raw/branchname/c.yaml
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
      `${provider.rawBaseUrl}/${owner}/${name}/-/raw/${ref}/${pathWithoutSlash}`,
    );
  } catch (e) {
    throw new Error(`Incorrect URL: ${target}, ${e}`);
  }
}

export function readConfig(config: Config, logger: Logger): ProviderConfig[] {
  const providers: ProviderConfig[] = [];

  // TODO(freben): Deprecate the old config root entirely in a later release
  if (config.has('catalog.processors.gitLab')) {
    logger.warn(
      'The catalog.processors.gitlabApi configuration key has been deprecated, please use catalog.processors.gitlab instead',
    );
  }

  // In a previous version of the configuration, we only supported gitlab,
  // and the "privateToken" key held the token to use for it. The new
  // configuration method is to use the "providers" key instead.
  const providerConfigs =
    config.getOptionalConfigArray('catalog.processors.gitlab.providers') ??
    config.getOptionalConfigArray('catalog.processors.gitlabApi.providers') ??
    [];
  const legacyToken =
    config.getOptionalString('catalog.processors.gitlab.privateToken') ??
    config.getOptionalString('catalog.processors.gitlabApi.privateToken');

  // First read all the explicit providers
  for (const providerConfig of providerConfigs) {
    const target = providerConfig.getString('target').replace(/\/+$/, '');
    let apiBaseUrl = providerConfig.getOptionalString('apiBaseUrl');
    let rawBaseUrl = providerConfig.getOptionalString('rawBaseUrl');
    const token = providerConfig.getOptionalString('token');

    if (apiBaseUrl) {
      apiBaseUrl = apiBaseUrl.replace(/\/+$/, '');
    } else if (target === 'https://gitlab.com') {
      apiBaseUrl = 'https://gitlab.com/api/v4';
    }

    if (rawBaseUrl) {
      rawBaseUrl = rawBaseUrl.replace(/\/+$/, '');
    } else if (target === 'https://gitlab.com') {
      rawBaseUrl = 'https://gitlab.com';
    }

    if (!apiBaseUrl && !rawBaseUrl) {
      throw new Error(
        `Provider at ${target} must configure an explicit apiBaseUrl or rawBaseUrl`,
      );
    }

    providers.push({ target, apiBaseUrl, rawBaseUrl, token });
  }

  // If no explicit gitlab.com provider was added, put one in the list as
  // a convenience
  if (!providers.some(p => p.target === 'https://gitlab.com')) {
    providers.push({
      target: 'https://gitlab.com',
      apiBaseUrl: 'https://gitlab.com/api/v4',
      rawBaseUrl: 'https://gitlab.com',
      token: legacyToken,
    });
  }

  return providers;
}

/**
 * A processor that adds the ability to read files from GitLab v4 APIs, such as
 * the one exposed by GitLab itself.
 */
export class GitLabReaderProcessor implements LocationProcessor {
  private providers: ProviderConfig[];

  static fromConfig(config: Config, logger: Logger) {
    return new GitLabReaderProcessor(readConfig(config, logger));
  }

  constructor(providers: ProviderConfig[]) {
    this.providers = providers;
  }

  async readLocation(
    location: LocationSpec,
    optional: boolean,
    emit: LocationProcessorEmit,
  ): Promise<boolean> {
    // The gitlab/api type is for backward compatibility
    if (location.type !== 'gitlab' && location.type !== 'gitlab/api') {
      return false;
    }

    const provider = this.providers.find(p =>
      location.target.startsWith(`${p.target}/`),
    );
    if (!provider) {
      throw new Error(
        `There is no GitLab provider that matches ${location.target}. Please add a configuration entry for it under catalog.processors.gitlab.providers.`,
      );
    }

    try {
      const useApi =
        provider.apiBaseUrl && (provider.token || !provider.rawBaseUrl);
      const url = useApi
        ? getApiUrl(location.target, provider)
        : getRawUrl(location.target, provider);
      const options = useApi
        ? getApiRequestOptions(provider)
        : getRawRequestOptions(provider);
      const response = await fetch(url.toString(), options);

      if (response.ok) {
        const data = await response.buffer();
        console.log(data);
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
