/*
 * Copyright 2020 The Backstage Authors
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

import { basicIntegrations, defaultScmResolveUrl } from '../helpers';
import {
  RateLimitInfo,
  ScmIntegration,
  ScmIntegrationsFactory,
} from '../types';
import {
  GithubIntegrationConfig,
  readGithubIntegrationConfigs,
} from './config';
import { ConsumedResponse } from '@backstage/errors';

/**
 * A GitHub based integration.
 *
 * @public
 */
export class GithubIntegration implements ScmIntegration {
  static factory: ScmIntegrationsFactory<GithubIntegration> = ({ config }) => {
    const configs = readGithubIntegrationConfigs(
      config.getOptionalConfigArray('integrations.github') ?? [],
    );
    return basicIntegrations(
      configs.map(c => new GithubIntegration(c)),
      i => i.config.host,
    );
  };

  constructor(private readonly integrationConfig: GithubIntegrationConfig) {}

  get type(): string {
    return 'github';
  }

  get title(): string {
    return this.integrationConfig.host;
  }

  get config(): GithubIntegrationConfig {
    return this.integrationConfig;
  }

  resolveUrl(options: {
    url: string;
    base: string;
    lineNumber?: number;
  }): string {
    // GitHub uses blob URLs for files and tree urls for directory listings. But
    // there is a redirect from tree to blob for files, so we can always return
    // tree urls here.
    return replaceGithubUrlType(defaultScmResolveUrl(options), 'tree');
  }

  resolveEditUrl(url: string): string {
    return replaceGithubUrlType(url, 'edit');
  }

  parseRateLimitInfo(response: ConsumedResponse): RateLimitInfo {
    return {
      isRateLimited:
        response.status === 429 ||
        (response.status === 403 &&
          response.headers.get('x-ratelimit-remaining') === '0'),
    };
  }
}

/**
 * Takes a GitHub URL and replaces the type part (blob, tree etc).
 *
 * @param url - The original URL
 * @param type - The desired type, e.g. "blob"
 * @public
 */
export function replaceGithubUrlType(
  url: string,
  type: 'blob' | 'tree' | 'edit',
): string {
  return url.replace(
    /\/\/([^/]+)\/([^/]+)\/([^/]+)\/(blob|tree|edit)\//,
    (_, host, owner, repo) => {
      return `//${host}/${owner}/${repo}/${type}/`;
    },
  );
}
