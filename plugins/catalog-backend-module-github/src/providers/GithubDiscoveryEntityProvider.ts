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

import { TaskRunner } from '@backstage/backend-tasks';
import { Config } from '@backstage/config';
import {
  GithubCredentialsProvider,
  ScmIntegrations,
  ScmIntegrationRegistry,
  DefaultGithubCredentialsProvider,
} from '@backstage/integration';
import {
  ANNOTATION_LOCATION,
  ANNOTATION_ORIGIN_LOCATION,
  Entity,
} from '@backstage/catalog-model';
import {
  EntityProvider,
  EntityProviderConnection,
} from '@backstage/plugin-catalog-backend';
import { graphql } from '@octokit/graphql';
import * as uuid from 'uuid';
import { Logger } from 'winston';
import { parseAllDocuments } from 'yaml';
import { merge, camelCase } from 'lodash';
import {
  YamlObject,
  ProviderConfigItem,
  getOrganizationEntities,
} from '../lib/github';

/**
 * Provider which discovers catalog files (any name) within an S3 bucket.
 *
 * Use `GithubDiscoveryEntityProvider.fromConfig(...)` to create instances.
 *
 * @public
 */
export class GithubDiscoveryEntityProvider implements EntityProvider {
  private readonly logger: Logger;
  private readonly integrations: ScmIntegrationRegistry;
  private readonly providerConfig: ProviderConfigItem;
  private readonly scheduleFn: () => Promise<void>;
  private connection?: EntityProviderConnection;
  private readonly githubCredentialsProvider: GithubCredentialsProvider;

  static fromConfig(
    config: Config,
    options: {
      providerConfig: ProviderConfigItem;
      logger: Logger;
      schedule: TaskRunner;
    },
  ) {
    const integrations = ScmIntegrations.fromConfig(config);
    if (!integrations) {
      throw new Error('No integrations found for github');
    }
    console.log('testing integrations');
    return new GithubDiscoveryEntityProvider(integrations, options);
  }

  private constructor(
    integrations: ScmIntegrations,
    options: {
      logger: Logger;
      schedule: TaskRunner;
      providerConfig: ProviderConfigItem;
    },
  ) {
    // this.id = options.providerConfig.id
    this.logger = options.logger.child({ target: this.getProviderName() });
    this.integrations = integrations;
    console.log('WHAT IS THIS????');
    this.githubCredentialsProvider =
      DefaultGithubCredentialsProvider.fromIntegrations(this.integrations);
    this.providerConfig = options.providerConfig;
    this.scheduleFn = this.createScheduleFn(options.schedule);
  }

  /** {@inheritdoc @backstage/plugin-catalog-backend#EntityProvider.getProviderName} */
  getProviderName(): string {
    console.log('this.providerConfig', this.providerConfig);
    return `github-discovery-entity-provider:${this.providerConfig.id}`;
  }

  /** {@inheritdoc @backstage/plugin-catalog-backend#EntityProvider.connect} */
  async connect(connection: EntityProviderConnection): Promise<void> {
    this.connection = connection;
    return await this.scheduleFn();
  }

  private createScheduleFn(schedule: TaskRunner): () => Promise<void> {
    return async () => {
      const taskId = `${this.getProviderName()}:refresh`;
      return schedule.run({
        id: taskId,
        fn: async () => {
          const logger = this.logger.child({
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

  async refresh(logger: Logger) {
    if (!this.connection) {
      throw new Error('Not initialized');
    }

    const gitHubConfig = this.integrations.github.byUrl(
      this.providerConfig.orgUrl,
    )?.config;

    if (!gitHubConfig) {
      throw new Error(
        `There is no GitHub integration that matches ${this.providerConfig.orgUrl}. Please add a configuration entry for it under integrations.github`,
      );
    }

    const { org, repoSearchPath } = parseUrl(this.providerConfig.orgUrl);

    const { headers } = await this.githubCredentialsProvider.getCredentials({
      url: this.providerConfig.orgUrl,
    });

    const client = graphql.defaults({
      baseUrl: gitHubConfig.apiBaseUrl,
      headers,
    });

    const startTimestamp = Date.now();

    this.logger.info(
      `Reading GitHub repositories from ${this.providerConfig.orgUrl}`,
    );

    const expectedEntityFiles = this.providerConfig.files;

    const { repositories } = await getOrganizationEntities(
      client,
      org,
      expectedEntityFiles,
    );

    const matching = repositories.filter(
      r => !r.isArchived && repoSearchPath.test(r.name),
    );

    const duration = ((Date.now() - startTimestamp) / 1000).toFixed(1);

    this.logger.info(
      `Read ${repositories.length} GitHub repositories (${matching.length} matching the pattern) in ${duration} seconds`,
    );

    const fileKeys = expectedEntityFiles.map(fileConfig =>
      camelCase(fileConfig.file),
    );

    const repoEntities: Array<YamlObject | Array<YamlObject>> = [];
    for (const entity of matching) {
      for (const key of fileKeys) {
        const entityObj: any = entity[key as keyof typeof entity];
        if (entityObj) {
          const yamlEntities = yamlStringToObjects(entityObj?.text);
          const validEntities = yamlEntities.filter(v => validateYamlObj(v));
          repoEntities.push(validEntities);
        }
      }
    }

    const validEntities = repoEntities.flat();

    this.logger.info(
      `Adding ${validEntities.length} valid entities to the catalog`,
    );

    await this.connection.applyMutation({
      type: 'full',
      entities: validEntities.map(e => ({
        locationKey: `github-discovery-graphql-provider:${this.providerConfig.id}`,
        entity: withLocations(this.providerConfig.orgUrl, org, e),
      })),
    });

    logger.info(`Committed ${repositories.length} Github repositories`);
  }
}

/*
 * Helpers
 */

/**
 *
 * @param entity Determines if the entity object has the minimum required backstage properties
 * @returns
 */
export function validateYamlObj(entity: YamlObject) {
  if (
    !entity?.apiVersion ||
    !entity?.kind ||
    !entity?.metadata?.name ||
    !entity?.spec?.owner
  )
    return false;
  return true;
}

export function yamlStringToObjects(
  yamlText: string | undefined,
): Array<YamlObject> {
  if (!yamlText) return [];
  const yamlObjects = parseAllDocuments(yamlText) || [];
  return yamlObjects.map(v => v.toJSON());
}

export function parseUrl(urlString: string): {
  org: string;
  repoSearchPath: RegExp;
  catalogPath: string;
  branch: string;
  host: string;
} {
  const url = new URL(urlString);
  const path = url.pathname.substr(1).split('/');

  // /backstage/techdocs-*/blob/master/catalog-info.yaml
  // can also be
  // /backstage
  if (path.length > 2 && path[0].length && path[1].length) {
    return {
      org: decodeURIComponent(path[0]),
      repoSearchPath: escapeRegExp(decodeURIComponent(path[1])),
      branch: decodeURIComponent(path[3]),
      catalogPath: `/${decodeURIComponent(path.slice(4).join('/'))}`,
      host: url.host,
    };
  } else if (path.length === 1 && path[0].length) {
    return {
      org: decodeURIComponent(path[0]),
      host: url.host,
      repoSearchPath: escapeRegExp('*'),
      catalogPath: '/catalog-info.yaml',
      branch: '-',
    };
  }

  throw new Error(`Failed to parse ${urlString}`);
}

export function escapeRegExp(str: string): RegExp {
  return new RegExp(`^${str.replace(/\*/g, '.*')}$`);
}

// Makes sure that emitted entities have a proper location
export function withLocations(
  baseUrl: string,
  org: string,
  entity: Entity,
): Entity {
  const location =
    entity.kind === 'Group'
      ? `url:${baseUrl}/orgs/${org}/teams/${entity.metadata.name}`
      : `url:${baseUrl}/${entity.metadata.name}`;
  return merge(
    {
      metadata: {
        annotations: {
          [ANNOTATION_LOCATION]: location,
          [ANNOTATION_ORIGIN_LOCATION]: location,
        },
      },
    },
    entity,
  ) as Entity;
}
