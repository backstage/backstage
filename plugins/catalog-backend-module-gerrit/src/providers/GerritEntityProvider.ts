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

import { Config } from '@backstage/config';
import { InputError } from '@backstage/errors';
import {
  EntityProvider,
  EntityProviderConnection,
  LocationSpec,
  locationSpecToLocationEntity,
} from '@backstage/plugin-catalog-node';
import {
  GerritIntegration,
  getGerritProjectsApiUrl,
  getGerritRequestOptions,
  parseGerritJsonResponse,
  ScmIntegrations,
} from '@backstage/integration';
import * as uuid from 'uuid';

import { readGerritConfigs } from './config';
import { GerritProjectQueryResult, GerritProviderConfig } from './types';
import {
  LoggerService,
  SchedulerService,
  SchedulerServiceTaskRunner,
} from '@backstage/backend-plugin-api';

/** @public */
export class GerritEntityProvider implements EntityProvider {
  private readonly config: GerritProviderConfig;
  private readonly integration: GerritIntegration;
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
  ): GerritEntityProvider[] {
    if (!options.schedule && !options.scheduler) {
      throw new Error('Either schedule or scheduler must be provided.');
    }

    const providerConfigs = readGerritConfigs(configRoot);
    const integrations = ScmIntegrations.fromConfig(configRoot).gerrit;
    const providers: GerritEntityProvider[] = [];

    providerConfigs.forEach(providerConfig => {
      const integration = integrations.byHost(providerConfig.host);
      if (!integration) {
        throw new InputError(
          `No gerrit integration found that matches host ${providerConfig.host}`,
        );
      }

      if (!options.schedule && !providerConfig.schedule) {
        throw new Error(
          `No schedule provided neither via code nor config for gerrit-provider:${providerConfig.id}.`,
        );
      }

      const taskRunner =
        options.schedule ??
        options.scheduler!.createScheduledTaskRunner(providerConfig.schedule!);

      providers.push(
        new GerritEntityProvider(
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
    config: GerritProviderConfig,
    integration: GerritIntegration,
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
    return `gerrit-provider:${this.config.id}`;
  }

  async connect(connection: EntityProviderConnection): Promise<void> {
    this.connection = connection;
    await this.scheduleFn();
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
            class: GerritEntityProvider.prototype.constructor.name,
            taskId,
            taskInstanceId: uuid.v4(),
          });

          try {
            await this.refresh(logger);
          } catch (error) {
            logger.error(
              `${this.getProviderName()} refresh failed, ${error}`,
              error,
            );
          }
        },
      });
    };
  }

  async refresh(logger: LoggerService): Promise<void> {
    if (!this.connection) {
      throw new Error('Gerrit discovery connection not initialized');
    }

    let response: Response;

    const baseProjectApiUrl = getGerritProjectsApiUrl(this.integration.config);
    const projectQueryUrl = `${baseProjectApiUrl}?${this.config.query}`;
    try {
      response = await fetch(projectQueryUrl, {
        method: 'GET',
        ...getGerritRequestOptions(this.integration.config),
      });
    } catch (e) {
      throw new Error(
        `Failed to list Gerrit projects for query ${this.config.query}, ${e}`,
      );
    }
    const gerritProjectsResponse = (await parseGerritJsonResponse(
      response as any,
    )) as GerritProjectQueryResult;
    const projects = Object.keys(gerritProjectsResponse);

    const locations = projects.map(project => this.createLocationSpec(project));
    await this.connection.applyMutation({
      type: 'full',
      entities: locations.map(location => ({
        locationKey: this.getProviderName(),
        entity: locationSpecToLocationEntity({ location }),
      })),
    });
    logger.info(`Found ${locations.length} locations.`);
  }

  private createLocationSpec(project: string): LocationSpec {
    return {
      type: 'url',
      target: `${this.integration.config.gitilesBaseUrl}/${project}/+/refs/heads/${this.config.branch}/catalog-info.yaml`,
      presence: 'optional',
    };
  }
}
