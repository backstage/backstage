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
export type GitLabProviderConfig = {
  /**
   * The prefix of the target that this matches on, e.g. "https://gitlab.com",
   * with no trailing slash.
   */
  target: string;

  /**
   * The base URL of the API of this provider, e.g. "https://api.gitlab.com",
   * with no trailing slash.
   *
   * The API will always be preferred if both its base URL and a token are
   * present.
   */
  apiBaseUrl?: string;

  /**
   * The authorization token to use for requests to this provider.
   *
   * If no token is specified, anonymous access is used.
   */
  token?: string;
};

export function readConfig(
  config: Config,
  logger: Logger,
): GitLabProviderConfig[] {
  const providers: GitLabProviderConfig[] = [];

  const providerConfigs =
    config.getOptionalConfigArray('catalog.processors.gitlab.providers') ?? [];

  // First read all the explicit providers
  for (const providerConfig of providerConfigs) {
    const target = providerConfig.getString('target').replace(/\/+$/, '');
    let apiBaseUrl = providerConfig.getOptionalString('apiBaseUrl');
    const token = providerConfig.getOptionalString('token');

    if (apiBaseUrl) {
      apiBaseUrl = apiBaseUrl.replace(/\/+$/, '');
    } else if (target === 'https://gitlab.com') {
      apiBaseUrl = 'https://gitlab.com/api/v4';
    }

    if (!apiBaseUrl) {
      throw new Error(
        `Provider at ${target} must configure an explicit apiBaseUrl`,
      );
    }

    providers.push({ target, apiBaseUrl, token });
  }

  return providers;
}

// Converts for example
// from: https://gitlab.example.com/organization/group/project/blob/branchname/path/to/c.yaml
// to:   https://gitlab.example.com/api/v4/projects/13083/project/files/c.yaml?ref=branchname
export function getApiUrl(target: string, provider: GitLabProviderConfig): URL {
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

export function getApiRequestOptions(
  provider: GitLabProviderConfig,
): RequestInit {
  const headers: HeadersInit = {};

  if (provider.token) {
    headers['PRIVATE-TOKEN'] = provider.token;
  }

  headers['Content-Type'] = 'application/json';

  return {
    headers,
  };
}

export class GitlabReaderProcessor implements LocationProcessor {
  private providers: GitLabProviderConfig[];

  static fromConfig(config: Config, logger: Logger) {
    return new GitlabReaderProcessor(readConfig(config, logger));
  }

  constructor(providers: GitLabProviderConfig[]) {
    this.providers = providers;
  }

  async readLocation(
    location: LocationSpec,
    optional: boolean,
    emit: LocationProcessorEmit,
  ): Promise<boolean> {
    if (location.type !== 'gitlab') {
      return false;
    }

    const provider = this.providers.find(p =>
      location.target.startsWith(`${p.target}/`),
    );
    if (!provider) {
      throw new Error(
        `There is no GitLab provider that matches ${location.target}. Please add a configuration entry for it under catalog.processors.github.providers.`,
      );
    }

    try {
      const url = getApiUrl(location.target, provider);
      const options = getApiRequestOptions(provider);
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
