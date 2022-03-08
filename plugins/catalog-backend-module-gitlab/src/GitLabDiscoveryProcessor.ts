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

import {
  CacheClient,
  CacheManager,
  PluginCacheManager,
} from '@backstage/backend-common';
import { Config } from '@backstage/config';
import {
  ScmIntegrationRegistry,
  ScmIntegrations,
} from '@backstage/integration';
import {
  CatalogProcessor,
  CatalogProcessorEmit,
  LocationSpec,
  processingResult,
} from '@backstage/plugin-catalog-backend';
import { Logger } from 'winston';
import { GitLabClient, GitLabProject, paginated } from './lib';

/**
 * Extracts repositories out of an GitLab instance.
 * @public
 */
export class GitLabDiscoveryProcessor implements CatalogProcessor {
  private readonly integrations: ScmIntegrationRegistry;
  private readonly logger: Logger;
  private readonly cache: CacheClient;

  static fromConfig(config: Config, options: { logger: Logger }) {
    const integrations = ScmIntegrations.fromConfig(config);
    const pluginCache =
      CacheManager.fromConfig(config).forPlugin('gitlab-discovery');

    return new GitLabDiscoveryProcessor({
      ...options,
      integrations,
      pluginCache,
    });
  }

  private constructor(options: {
    integrations: ScmIntegrationRegistry;
    pluginCache: PluginCacheManager;
    logger: Logger;
  }) {
    this.integrations = options.integrations;
    this.cache = options.pluginCache.getClient();
    this.logger = options.logger;
  }

  getProcessorName(): string {
    return 'GitLabDiscoveryProcessor';
  }

  async readLocation(
    location: LocationSpec,
    _optional: boolean,
    emit: CatalogProcessorEmit,
  ): Promise<boolean> {
    if (location.type !== 'gitlab-discovery') {
      return false;
    }

    const { group, host, branch, catalogPath } = parseUrl(location.target);

    const integration = this.integrations.gitlab.byUrl(`https://${host}`);
    if (!integration) {
      throw new Error(
        `There is no GitLab integration that matches ${host}. Please add a configuration entry for it under integrations.gitlab`,
      );
    }

    const client = new GitLabClient({
      config: integration.config,
      logger: this.logger,
    });
    const startTimestamp = Date.now();
    this.logger.debug(`Reading GitLab projects from ${location.target}`);

    const projects = paginated(options => client.listProjects(options), {
      group,
      last_activity_after: await this.updateLastActivity(),
      page: 1,
    });

    const res: Result = {
      scanned: 0,
      matches: [],
    };
    for await (const project of projects) {
      res.scanned++;

      if (project.archived) {
        continue;
      }

      if (branch === '*' && project.default_branch === undefined) {
        continue;
      }

      res.matches.push(project);
    }

    for (const project of res.matches) {
      const project_branch = branch === '*' ? project.default_branch : branch;

      emit(
        processingResult.location({
          type: 'url',
          // The format expected by the GitLabUrlReader:
          // https://gitlab.com/groupA/teams/teamA/subgroupA/repoA/-/blob/branch/filepath
          //
          // This unfortunately will trigger another API call in `getGitLabFileFetchUrl` to get the project ID.
          // The alternative is using the `buildRawUrl` function, which does not support subgroups, so providing a raw
          // URL here won't work either.
          target: `${project.web_url}/-/blob/${project_branch}/${catalogPath}`,
          presence: 'optional',
        }),
      );
    }

    const duration = ((Date.now() - startTimestamp) / 1000).toFixed(1);
    this.logger.debug(
      `Read ${res.scanned} GitLab repositories in ${duration} seconds`,
    );

    return true;
  }

  private async updateLastActivity(): Promise<string | undefined> {
    const cacheKey = `processors/${this.getProcessorName()}/last-activity`;
    const lastActivity = await this.cache.get(cacheKey);
    await this.cache.set(cacheKey, new Date().toISOString());
    return lastActivity as string | undefined;
  }
}

type Result = {
  scanned: number;
  matches: GitLabProject[];
};

/*
 * Helpers
 */

export function parseUrl(urlString: string): {
  group?: string;
  host: string;
  branch: string;
  catalogPath: string;
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
      branch: decodeURIComponent(path[blobIndex + 1]),
      catalogPath: decodeURIComponent(path.slice(blobIndex + 2).join('/')),
    };
  }

  throw new Error(`Failed to parse ${urlString}`);
}
