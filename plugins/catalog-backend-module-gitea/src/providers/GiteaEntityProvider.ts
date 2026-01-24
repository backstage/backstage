/*
 * Copyright 2022 The Backstage Authors
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
import * as uuid from 'uuid';
import { Config } from '@backstage/config';
import { InputError } from '@backstage/errors';
import {
  EntityProvider,
  EntityProviderConnection,
  locationSpecToLocationEntity,
} from '@backstage/plugin-catalog-node';
import { LocationSpec } from '@backstage/plugin-catalog-common';
import {
  GiteaIntegration,
  getGiteaRequestOptions,
  ScmIntegrations,
} from '@backstage/integration';
import { getGiteaApiUrl } from './core';

import { readGiteaConfigs } from './config';
import { GiteaProjectQueryResult, GiteaProviderConfig } from './types';
import {
  LoggerService,
  SchedulerService,
  SchedulerServiceTaskRunner,
} from '@backstage/backend-plugin-api';

/** @public */
export class GiteaEntityProvider implements EntityProvider {
  private readonly config: GiteaProviderConfig;
  private readonly integration: GiteaIntegration;
  private readonly logger: LoggerService;
  private readonly scheduleFn: () => Promise<void>;
  private connection?: EntityProviderConnection;

  static fromConfig(
    configRoot: Config,
    options: {
      logger: LoggerService;
      schedule?: SchedulerServiceTaskRunner;
      scheduler?: SchedulerService;
    },
  ): GiteaEntityProvider[] {
    if (!options.schedule && !options.scheduler) {
      throw new Error('Either schedule or scheduler must be provided.');
    }

    const providerConfigs = readGiteaConfigs(configRoot);
    const integrations = ScmIntegrations.fromConfig(configRoot).gitea;
    const providers: GiteaEntityProvider[] = [];

    providerConfigs.forEach(providerConfig => {
      const integration = integrations.byHost(providerConfig.host);
      if (!integration) {
        throw new InputError(
          `No Gitea integration found that matches host ${providerConfig.host}`,
        );
      }

      if (!options.schedule && !providerConfig.schedule) {
        throw new Error(
          `No schedule provided neither via code nor config for Gitea-provider:${providerConfig.id}.`,
        );
      }

      const taskRunner =
        options.schedule ??
        options.scheduler!.createScheduledTaskRunner(providerConfig.schedule!);

      providers.push(
        new GiteaEntityProvider(
          providerConfig,
          integration,
          options.logger,
          taskRunner,
        ),
      );
    });

    return providers;
  }

  private constructor(
    config: GiteaProviderConfig,
    integration: GiteaIntegration,
    logger: LoggerService,
    taskRunner: SchedulerServiceTaskRunner,
  ) {
    this.config = config;
    this.integration = integration;
    this.logger = logger.child({
      target: this.getProviderName(),
    });
    this.scheduleFn = this.createScheduleFn(taskRunner);
  }

  getProviderName(): string {
    return `gitea-provider:${this.config.id}`;
  }

  async connect(connection: EntityProviderConnection): Promise<void> {
    this.connection = connection;
    await this.scheduleFn();
  }

  private async parseGiteaJsonResponse(
    response: Response,
  ): Promise<GiteaProjectQueryResult> {
    if (!response.ok) {
      throw new Error(
        `Failed to fetch Gitea repositories, status: ${response.status}`,
      );
    }
    try {
      return await response.json();
    } catch (error) {
      throw new Error(`Failed to parse Gitea API response: ${error}`);
    }
  }

  private createScheduleFn(
    taskRunner: SchedulerServiceTaskRunner,
  ): () => Promise<void> {
    return async () => {
      const taskId = `${this.getProviderName()}:refresh`;
      return taskRunner.run({
        id: taskId,
        fn: async () => {
          const logger = this.logger.child({
            class: GiteaEntityProvider.prototype.constructor.name,
            taskId,
            taskInstanceId: uuid.v4(),
          });

          try {
            await this.refresh(logger);
          } catch (error) {
            logger.error(
              `${this.getProviderName()} refresh failed, ${error}`,
              error as Error,
            );
          }
        },
      });
    };
  }

  async refresh(logger: LoggerService): Promise<void> {
    if (!this.connection) {
      throw new Error('Gitea discovery connection not initialized');
    }
    let allRepos: any[] = [];

    try {
      // Fetch all repos for an organization
      const OrgRepoApiUrl = `${getGiteaApiUrl(this.integration.config)}orgs/${
        this.config.organization
      }/repos`;
      let page = 1;
      let hasMoreData = true;

      while (hasMoreData) {
        const url = `${OrgRepoApiUrl}?page=${page}`;
        const response = await fetch(url, {
          method: 'GET',
          ...getGiteaRequestOptions(this.integration.config),
        });

        if (!response.ok) {
          throw new Error(
            `Failed to fetch page ${page} of repos, status: ${response.status}`,
          );
        }

        const projectsPage = (await this.parseGiteaJsonResponse(
          response,
        )) as GiteaProjectQueryResult;

        if (!Array.isArray(projectsPage) || projectsPage.length === 0) {
          hasMoreData = false;
        } else {
          allRepos = allRepos.concat(projectsPage);
          page++;
        }
      }
    } catch (e) {
      throw new Error(
        `Failed to list Gitea projects for organization ${this.config.organization}, ${e}`,
      );
    }

    // Filter for repos that have catalog-info.yaml at root
    const { default: pLimit } = await import('p-limit');
    const limit = pLimit(5);
    const validRepos: string[] = [];

    await Promise.all(
      allRepos.map(repo =>
        limit(async () => {
          if (repo.empty) {
            logger.warn(`Repo ${repo.html_url} is empty, skipping`);
            return;
          }
          const contentsApiUrl = `${getGiteaApiUrl(
            this.integration.config,
          )}repos/${this.config.organization}/${repo.name}/contents/${
            this.config.catalogPath
          }`;

          const res = await fetch(contentsApiUrl, {
            method: 'GET',
            ...getGiteaRequestOptions(this.integration.config),
          });
          if (res.ok) {
            validRepos.push(repo.html_url);
          } else {
            logger.warn(
              `Repo ${repo.html_url} does not contain a catalog-info.yaml file`,
            );
            return;
          }
        }),
      ),
    );
    // Create location specs for each valid repo
    const locations = await Promise.all(
      validRepos.map(repo => limit(() => this.createLocationSpec(repo))),
    );
    // Apply the locations to the catalog
    try {
      const providerName: string = this.getProviderName();
      const entities = locations.map(location => ({
        locationKey: providerName,
        entity: locationSpecToLocationEntity({ location }),
      }));
      await this.connection.applyMutation({
        type: 'full',
        entities: entities,
      });
    } catch (e) {
      logger.error(`Failed to apply mutation: ${e}`);
    }
    logger.info(
      `Found ${locations.length} locations from ${allRepos.length} repos`,
    );
  }

  private async createLocationSpec(repo: string): Promise<LocationSpec> {
    return {
      type: 'url',
      target: `${repo}/src/branch/${this.config.branch}/${this.config.catalogPath}`,
    };
  }
}
