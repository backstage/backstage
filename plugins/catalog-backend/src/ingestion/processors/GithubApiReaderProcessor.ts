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
import fetch, { HeadersInit, RequestInit } from 'node-fetch';
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
   */
  apiBaseUrl: string;

  /**
   * The authorization token to use for requests to this provider.
   *
   * If no token is specified, anonymous API access is used.
   */
  token?: string;
};

export function getRequestOptions(provider: ProviderConfig): RequestInit {
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

// Converts for example
// from: https://github.com/a/b/blob/branchname/path/to/c.yaml
// to:   https://api.github.com/repos/a/b/contents/path/to/c.yaml?ref=branchname
export function getRawUrl(target: string, provider: ProviderConfig): URL {
  try {
    const oldPath = new URL(target).pathname.split('/');
    const [, userOrOrg, repoName, blobOrRaw, ref, ...restOfPath] = oldPath;

    if (
      !userOrOrg ||
      !repoName ||
      (blobOrRaw !== 'blob' && blobOrRaw !== 'raw') ||
      !restOfPath.join('/').match(/\.ya?ml$/)
    ) {
      throw new Error('Wrong URL or Invalid file path');
    }

    // Transform to API path
    const newPath = [
      'repos',
      userOrOrg,
      repoName,
      'contents',
      ...restOfPath,
    ].join('/');
    return new URL(`${provider.apiBaseUrl}/${newPath}?ref=${ref}`);
  } catch (e) {
    throw new Error(`Incorrect URL: ${target}, ${e}`);
  }
}

export function readConfig(configRoot: Config): ProviderConfig[] {
  const providers: ProviderConfig[] = [];

  // In a previous version of the configuration, we only supported github,
  // and the "privateToken" key held the token to use for it. The new
  // configuration method is to use the "providers" key instead.
  const config = configRoot.getOptionalConfig('catalog.processors.githubApi');
  const providerConfigs = config?.getOptionalConfigArray('providers') ?? [];
  const legacyToken = config?.getOptionalString('privateToken');

  // First read all the explicit providers
  for (const providerConfig of providerConfigs) {
    const target = providerConfig.getString('target').replace(/\/+$/, '');
    let apiBaseUrl = providerConfig.getOptionalString('apiBaseUrl');
    const token = providerConfig.getOptionalString('token');

    if (apiBaseUrl) {
      apiBaseUrl = apiBaseUrl.replace(/\/+$/, '');
    } else if (target === 'https://github.com') {
      apiBaseUrl = 'https://api.github.com';
    } else {
      throw new Error(
        `Provider at ${target} must configure an explicit apiBaseUrl`,
      );
    }

    providers.push({ target, apiBaseUrl, token });
  }

  // If no explicit github.com provider was added, put one in the list as
  // a convenience
  if (!providers.some(p => p.target === 'https://github.com')) {
    providers.push({
      target: 'https://github.com',
      apiBaseUrl: 'https://api.github.com',
      token: legacyToken,
    });
  }

  return providers;
}

/**
 * A processor that adds the ability to read files from GitHub v3 APIs, such as
 * the one exposed by GitHub itself.
 */
export class GithubApiReaderProcessor implements LocationProcessor {
  private providers: ProviderConfig[];

  static fromConfig(config: Config) {
    return new GithubApiReaderProcessor(readConfig(config));
  }

  constructor(providers: ProviderConfig[]) {
    this.providers = providers;
  }

  async readLocation(
    location: LocationSpec,
    optional: boolean,
    emit: LocationProcessorEmit,
  ): Promise<boolean> {
    if (location.type !== 'github/api') {
      return false;
    }

    const provider = this.providers.find(p =>
      location.target.startsWith(`${p.target}/`),
    );
    if (!provider) {
      throw new Error(
        `There is no GitHub provider that matches ${location.target}. Please add a configuration entry for it under catalog.github.processors.githubApi.`,
      );
    }

    try {
      const url = getRawUrl(location.target, provider);
      const options = getRequestOptions(provider);
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
