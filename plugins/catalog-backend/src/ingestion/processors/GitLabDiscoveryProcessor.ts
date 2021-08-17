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
import { GitLabClient, GitLabProject, paginated } from './gitlab';
import {
  CacheClient,
  CacheManager,
  PluginCacheManager,
} from '@backstage/backend-common';

/**
 * Extracts repositories out of an GitLab instance.
 */
export class GitLabDiscoveryProcessor implements CatalogProcessor {
  private readonly integrations: ScmIntegrations;
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
    this.logger.info(`Reading GitLab projects from ${location.target}`);

    const projects = paginated(options => client.listProjects(options), {
      group,
      last_activity_after: await this.updateLastActivity(),
      page: 1,
    });

    const result: Result = {
      scanned: 0,
      matches: [],
    };
    for await (const project of projects) {
      result.scanned++;
      if (!project.archived) {
        result.matches.push(project);
      }
    }

    for (const project of result.matches) {
      const project_branch = branch === '*' ? project.default_branch : branch;

      emit(
        results.location(
          {
            type: 'url',
            // The format expected by the GitLabUrlReader:
            // https://gitlab.com/groupA/teams/teamA/subgroupA/repoA/-/blob/branch/filepath
            //
            // This unfortunately will trigger another API call in `getGitLabFileFetchUrl` to get the project ID.
            // The alternative is using the `buildRawUrl` function, which does not support subgroups, so providing a raw
            // URL here won't work either.
            target: `${project.web_url}/-/blob/${project_branch}/${catalogPath}`,
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

  async updateLastActivity(): Promise<string | undefined> {
    const lastActivity = await this.cache.get('last-activity');
    await this.cache.set('last-activity', new Date().toISOString());
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

export function escapeRegExp(str: string): RegExp {
  return new RegExp(`^${str.replace(/\*/g, '.*')}$`);
}
