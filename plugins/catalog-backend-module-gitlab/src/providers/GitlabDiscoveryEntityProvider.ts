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

import { TaskRunner } from '@backstage/backend-tasks';
import { Config } from '@backstage/config';
import { GitLabIntegration, ScmIntegrations } from '@backstage/integration';
import {
  EntityProvider,
  EntityProviderConnection,
} from '@backstage/plugin-catalog-backend';
import { LocationSpec } from '@backstage/plugin-catalog-backend';
import { Logger } from 'winston';
import {
  GitLabClient,
  GitLabProject,
  GitlabProviderConfig,
  paginated,
  readGitlabConfigs,
} from '../lib';
import * as uuid from 'uuid';
import { locationSpecToLocationEntity } from '@backstage/plugin-catalog-backend';

type Result = {
  scanned: number;
  matches: GitLabProject[];
};

/**
 * Discovers entity definition files in the groups of a Gitlab instance.
 * @public
 */
export class GitlabDiscoveryEntityProvider implements EntityProvider {
  private readonly config: GitlabProviderConfig;
  private readonly integration: GitLabIntegration;
  private readonly logger: Logger;
  private readonly scheduleFn: () => Promise<void>;
  private connection?: EntityProviderConnection;

  static fromConfig(
    config: Config,
    options: { logger: Logger; schedule: TaskRunner },
  ): GitlabDiscoveryEntityProvider[] {
    const providerConfigs = readGitlabConfigs(config);
    const integrations = ScmIntegrations.fromConfig(config).gitlab;
    const providers: GitlabDiscoveryEntityProvider[] = [];

    providerConfigs.forEach(providerConfig => {
      const integration = integrations.byHost(providerConfig.host);
      if (!integration) {
        throw new Error(
          `No gitlab integration found that matches host ${providerConfig.host}`,
        );
      }
      providers.push(
        new GitlabDiscoveryEntityProvider({
          ...options,
          config: providerConfig,
          integration,
        }),
      );
    });
    return providers;
  }

  private constructor(options: {
    config: GitlabProviderConfig;
    integration: GitLabIntegration;
    logger: Logger;
    schedule: TaskRunner;
  }) {
    this.config = options.config;
    this.integration = options.integration;
    this.logger = options.logger.child({
      target: this.getProviderName(),
    });
    this.scheduleFn = this.createScheduleFn(options.schedule);
  }

  getProviderName(): string {
    return `GitlabDiscoveryEntityProvider:${this.config.id}`;
  }

  async connect(connection: EntityProviderConnection): Promise<void> {
    this.connection = connection;
    await this.scheduleFn();
  }

  private createScheduleFn(schedule: TaskRunner): () => Promise<void> {
    return async () => {
      const taskId = `${this.getProviderName()}:refresh`;
      return schedule.run({
        id: taskId,
        fn: async () => {
          const logger = this.logger.child({
            class: GitlabDiscoveryEntityProvider.prototype.constructor.name,
            taskId,
            taskInstanceId: uuid.v4(),
          });

          try {
            await this.refresh(logger);
          } catch (error) {
            logger.error(error);
          }
        },
      });
    };
  }

  async refresh(logger: Logger): Promise<void> {
    if (!this.connection) {
      throw new Error(
        `Gitlab discovery connection not initialized for ${this.getProviderName()}`,
      );
    }

    const client = new GitLabClient({
      config: this.integration.config,
      logger: logger,
    });

    const projects = paginated<GitLabProject>(
      options => client.listProjects(options),
      {
        group: this.config.group,
        page: 1,
        per_page: 50,
      },
    );

    const res: Result = {
      scanned: 0,
      matches: [],
    };

    for await (const project of projects) {
      res.scanned++;

      if (project.archived) {
        continue;
      }

      if (this.config.branch === '*' && project.default_branch === undefined) {
        continue;
      }

      const project_branch = project.default_branch ?? this.config.branch;

      const projectHasFile: boolean = await client.hasFile(
        project.path_with_namespace ?? '',
        project_branch,
        this.config.catalogFile,
      );
      if (projectHasFile) {
        res.matches.push(project);
      }
    }

    const locations = res.matches.map(p => this.createLocationSpec(p));
    await this.connection.applyMutation({
      type: 'full',
      entities: locations.map(location => ({
        locationKey: this.getProviderName(),
        entity: locationSpecToLocationEntity({ location }),
      })),
    });
  }

  private createLocationSpec(project: GitLabProject): LocationSpec {
    const project_branch = project.default_branch ?? this.config.branch;
    return {
      type: 'url',
      target: `${project.web_url}/-/blob/${project_branch}/${this.config.catalogFile}`,
      presence: 'optional',
    };
  }
}
