/*
 * Copyright 2021 The Backstage Authors
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
import { ScmIntegrations } from '@backstage/integration';
import { Logger } from 'winston';
import * as results from './results';
import { CatalogProcessor, CatalogProcessorEmit } from './types';
import { GitLabClient, BlobsSearchResult } from './gitlab';
import {
  CacheClient,
  CacheManager,
  PluginCacheManager,
} from '@backstage/backend-common';

/**
 * Extracts repositories out of an GitLab instance.
 */
export class GitLabESDiscoveryProcessor implements CatalogProcessor {
  private readonly integrations: ScmIntegrations;
  private readonly logger: Logger;
  private readonly cache: CacheClient;

  getProcessorName() {
    return 'gitlab-es-discovery';
  }

  static fromConfig(config: Config, options: { logger: Logger }) {
    const integrations = ScmIntegrations.fromConfig(config);
    const pluginCache = CacheManager.fromConfig(config).forPlugin(
      'gitlab-es-discovery',
    );

    return new GitLabESDiscoveryProcessor({
      ...options,
      integrations,
      pluginCache,
    });
  }

  private constructor(options: {
    integrations: ScmIntegrations;
    pluginCache: PluginCacheManager;
    logger: Logger;
  }) {
    this.integrations = options.integrations;
    this.cache = options.pluginCache.getClient();
    this.logger = options.logger;
  }

  async readLocation(
    location: LocationSpec,
    _optional: boolean,
    emit: CatalogProcessorEmit,
  ): Promise<boolean> {
    if (location.type !== 'gitlab-es-discovery') {
      return false;
    }

    const { group, host, searchStatement } = parseUrl(location.target);

    const integration = this.integrations.gitlab.byUrl(`https://${host}`);
    if (!integration) {
      throw new Error(
        `There is no GitLab integration that matches ${host}. Please add a configuration entry for it under integrations.gitlab`,
      );
    }

    const client = new GitLabClient({
      config: integration.config,
      logger: this.logger,
      cache: this.cache,
    });
    const startTimestamp = Date.now();

    const searchResults = await client.performSearch({
      id: group,
      scope: 'blobs',
      search: `path:${searchStatement}`,
    });

    const result: SearchResult = {
      scanned: 0,
      matches: [],
    };

    for (const searchResult of searchResults) {
      result.scanned++;
      result.matches.push(searchResult);
    }

    for (const res of result.matches) {
      // try to fetch the desired object before emitting a result
      let url: string;
      if (res.project) {
        url = `${res.project.web_url}/-/blob/${res.project.default_branch}/${res.path}`;
      } else {
        throw new Error(
          `cannot build URL with no project for search result ${JSON.stringify(
            res,
          )}`,
        );
      }
      emit(
        results.location(
          {
            type: 'url',
            target: url,
          },
          true,
        ),
      );
    }

    const duration = ((Date.now() - startTimestamp) / 1000).toFixed(1);
    this.logger.debug(
      `Read ${result.scanned} GitLab repositories in ${duration} seconds`,
    );

    return true;
  }
}

type SearchResult = {
  scanned: number;
  matches: BlobsSearchResult[];
};
/*
 * Helpers
 */

export function parseUrl(urlString: string): {
  group?: string;
  host: string;
  searchStatement: string;
} {
  const url = new URL(urlString);
  const path = url.pathname.substr(1).split('/');

  // (/group/subgroup)/blob/branch|*/filepath
  const blobIndex = path.findIndex(p => p === 'blob');
  if (blobIndex !== -1 && path.length > blobIndex + 2) {
    const group =
      blobIndex > 0 ? path.slice(0, blobIndex).join('/') : undefined;

    return {
      group,
      host: url.host,
      searchStatement: decodeURIComponent(path.slice(blobIndex + 2).join('/')),
    };
  }

  throw new Error(`Failed to parse ${urlString}`);
}
