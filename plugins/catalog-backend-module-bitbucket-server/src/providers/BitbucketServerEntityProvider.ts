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

import { Entity, LocationEntity } from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import { InputError } from '@backstage/errors';
import {
  BitbucketServerIntegration,
  ScmIntegrations,
} from '@backstage/integration';
import {
  EntityProvider,
  EntityProviderConnection,
  DeferredEntity,
  CatalogService,
} from '@backstage/plugin-catalog-node';
import * as uuid from 'uuid';
import { BitbucketServerClient, paginated } from '../lib';
import {
  BitbucketServerEntityProviderConfig,
  readProviderConfigs,
} from './BitbucketServerEntityProviderConfig';
import {
  BitbucketServerLocationParser,
  defaultBitbucketServerLocationParser,
} from './BitbucketServerLocationParser';
import {
  AuthService,
  BackstageCredentials,
  LoggerService,
  SchedulerService,
  SchedulerServiceTaskRunner,
} from '@backstage/backend-plugin-api';
import { BitbucketServerEvents } from '../lib';
import { EventsService } from '@backstage/plugin-events-node';

const TOPIC_REPO_REFS_CHANGED = 'bitbucketServer.repo:refs_changed';

/**
 * Discovers catalog files located in Bitbucket Server.
 * The provider will search your Bitbucket Server instance and register catalog files matching the configured path
 * as Location entity and via following processing steps add all contained catalog entities.
 * This can be useful as an alternative to static locations or manually adding things to the catalog.
 *
 * @public
 */
export class BitbucketServerEntityProvider implements EntityProvider {
  private readonly integration: BitbucketServerIntegration;
  private readonly config: BitbucketServerEntityProviderConfig;
  private readonly parser: BitbucketServerLocationParser;
  private readonly logger: LoggerService;
  private readonly scheduleFn: () => Promise<void>;
  private connection?: EntityProviderConnection;
  private readonly catalogApi?: CatalogService;
  private readonly events?: EventsService;
  private readonly auth?: AuthService;
  private eventConfigErrorThrown = false;
  private readonly targetAnnotation: string;
  private readonly defaultBranchAnnotation: string;

  static fromConfig(
    config: Config,
    options: {
      logger: LoggerService;
      events?: EventsService;
      parser?: BitbucketServerLocationParser;
      schedule?: SchedulerServiceTaskRunner;
      scheduler?: SchedulerService;
      catalogApi?: CatalogService;
      auth?: AuthService;
    },
  ): BitbucketServerEntityProvider[] {
    const integrations = ScmIntegrations.fromConfig(config);

    if (!options.schedule && !options.scheduler) {
      throw new Error('Either schedule or scheduler must be provided.');
    }

    return readProviderConfigs(config).map(providerConfig => {
      const integration = integrations.bitbucketServer.byHost(
        providerConfig.host,
      );
      if (!integration) {
        throw new InputError(
          `No BitbucketServer integration found that matches host ${providerConfig.host}`,
        );
      }

      if (!options.schedule && !providerConfig.schedule) {
        throw new Error(
          `No schedule provided neither via code nor config for bitbucketServer-provider:${providerConfig.id}.`,
        );
      }

      const taskRunner =
        options.schedule ??
        options.scheduler!.createScheduledTaskRunner(providerConfig.schedule!);

      return new BitbucketServerEntityProvider(
        providerConfig,
        integration,
        options.logger,
        taskRunner,
        options.parser,
        options.catalogApi,
        options.events,
        options.auth,
      );
    });
  }

  private constructor(
    config: BitbucketServerEntityProviderConfig,
    integration: BitbucketServerIntegration,
    logger: LoggerService,
    taskRunner: SchedulerServiceTaskRunner,
    parser?: BitbucketServerLocationParser,
    catalogApi?: CatalogService,
    events?: EventsService,
    auth?: AuthService,
  ) {
    this.integration = integration;
    this.config = config;
    this.parser = parser || defaultBitbucketServerLocationParser;
    this.logger = logger.child({
      target: this.getProviderName(),
    });
    this.scheduleFn = this.createScheduleFn(taskRunner);
    this.catalogApi = catalogApi;
    this.auth = auth;
    this.targetAnnotation = `${this.config.host.split(':')[0]}/repo-url`;
    this.defaultBranchAnnotation = 'bitbucket.org/default-branch';
    this.events = events;
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
            class: BitbucketServerEntityProvider.prototype.constructor.name,
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

  /** {@inheritdoc @backstage/plugin-catalog-node#EntityProvider.getProviderName} */
  getProviderName(): string {
    return `bitbucketServer-provider:${this.config.id}`;
  }

  /** {@inheritdoc @backstage/plugin-catalog-node#EntityProvider.connect} */
  async connect(connection: EntityProviderConnection): Promise<void> {
    this.connection = connection;
    await this.scheduleFn();

    if (this.events) {
      await this.events.subscribe({
        id: this.getProviderName(),
        topics: [TOPIC_REPO_REFS_CHANGED],
        onEvent: async params => {
          if (params.topic !== TOPIC_REPO_REFS_CHANGED) {
            return;
          }

          await this.onRepoPush(
            params.eventPayload as BitbucketServerEvents.RefsChangedEvent,
          );
        },
      });
    }
  }

  async refresh(logger: LoggerService) {
    if (!this.connection) {
      throw new Error('Not initialized');
    }

    logger.info('Discovering catalog files in Bitbucket Server repositories');

    const entities = await this.findEntities();

    await this.connection.applyMutation({
      type: 'full',
      entities: entities.map(entity => ({
        locationKey: this.getProviderName(),
        entity: entity,
      })),
    });

    logger.info(
      `Committed ${entities.length} entities for Bitbucket Server repositories`,
    );
  }

  private async findEntities(): Promise<Entity[]> {
    const client = BitbucketServerClient.fromConfig({
      config: this.integration.config,
    });
    const projects = paginated(options =>
      client.listProjects({ listOptions: options }),
    );
    const result: Entity[] = [];
    for await (const project of projects) {
      if (
        this.config?.filters?.projectKey &&
        !this.config.filters.projectKey.test(project.key)
      ) {
        continue;
      }
      const repositories = paginated(options =>
        client.listRepositories({
          projectKey: project.key,
          listOptions: options,
        }),
      );
      for await (const repository of repositories) {
        if (
          this.config?.filters?.repoSlug &&
          !this.config.filters.repoSlug.test(repository.slug)
        ) {
          continue;
        }
        if (this.config?.filters?.skipArchivedRepos && repository.archived) {
          continue;
        }
        for await (const entity of this.parser({
          client,
          logger: this.logger,
          location: {
            type: 'url',
            target: `${repository.links.self[0].href}${this.config.catalogPath}`,
            presence: 'optional',
          },
        })) {
          if (entity.metadata.annotations === undefined) {
            entity.metadata.annotations = {};
          }
          if (repository.defaultBranch === undefined) {
            const defaultBranchResponse = await client.getDefaultBranch({
              repo: repository.slug,
              projectKey: project.key,
            });
            entity.metadata.annotations[this.defaultBranchAnnotation] =
              defaultBranchResponse.displayId;
          } else {
            entity.metadata.annotations[this.defaultBranchAnnotation] =
              repository.defaultBranch;
          }
          result.push(entity);
        }
      }
    }
    return result;
  }

  private isDefaultBranchPush(
    defaultBranch: String,
    event: BitbucketServerEvents.RefsChangedEvent,
  ): boolean {
    return event.changes.some(c => defaultBranch === c.ref.displayId);
  }

  /**
   * Checks if the provider is able to handle events
   * @returns Boolean
   */
  private canHandleEvents(): boolean {
    if (this.catalogApi && this.auth) {
      return true;
    }

    if (!this.eventConfigErrorThrown) {
      this.eventConfigErrorThrown = true;
      throw new Error(
        `${this.getProviderName()} not well configured to handle repo:push. Missing CatalogApi and/or AuthService.`,
      );
    }

    return false;
  }

  private async getLocationEntity(
    event: BitbucketServerEvents.RefsChangedEvent,
  ): Promise<Entity[]> {
    const client = BitbucketServerClient.fromConfig({
      config: this.integration.config,
    });
    const result: Entity[] = [];
    try {
      const repository = await client.getRepository({
        projectKey: event.repository.project.key,
        repo: event.repository.slug,
      });

      for await (const entity of this.parser({
        client,
        logger: this.logger,
        location: {
          type: 'url',
          target: `${repository.links.self[0].href}${this.config.catalogPath}`,
          presence: 'optional',
        },
      })) {
        entity.metadata.annotations![
          this.targetAnnotation
        ] = `${repository.links.self[0].href}${this.config.catalogPath}`;

        if (entity.metadata.annotations === undefined) {
          entity.metadata.annotations = {};
        }

        if (repository.defaultBranch === undefined) {
          const defaultBranchResponse = await client.getDefaultBranch({
            repo: repository.slug,
            projectKey: event.repository.project.key,
          });
          entity.metadata.annotations[this.defaultBranchAnnotation] =
            defaultBranchResponse.displayId;
        } else {
          entity.metadata.annotations[this.defaultBranchAnnotation] =
            repository.defaultBranch;
        }
        result.push(entity);
      }
    } catch (error: any) {
      if (error.name === 'NotFoundError') {
        this.logger.error(error.message);
      }
    }

    return result;
  }

  private async onRepoPush(
    event: BitbucketServerEvents.RefsChangedEvent,
  ): Promise<void> {
    if (!this.canHandleEvents()) {
      this.logger.error(
        'Bitbucket Server catalog entity provider is not set up to handle events. Missing authService or catalogApi.',
      );
      return;
    }

    if (!this.connection) {
      throw new Error('Not initialized');
    }

    const repoSlug = event.repository.slug;
    const catalogRepoUrl: string = `https://${this.config.host}/projects/${event.repository.project.key}/repos/${repoSlug}/browse${this.config.catalogPath}`;
    this.logger.info(`handle repo:push event for ${catalogRepoUrl}`);
    const targets = await this.getLocationEntity(event);
    if (targets.length === 0) {
      this.logger.error('Failed to create location entity.');
      return;
    }
    const existing = await this.findExistingLocations(
      catalogRepoUrl,
      await this.auth!.getOwnServiceCredentials(),
    );
    const stillExisting: LocationEntity[] = [];
    const removed: DeferredEntity[] = [];
    existing.forEach(item => {
      if (
        targets.find(
          value =>
            value.metadata.annotations![this.targetAnnotation] ===
            item.spec.target,
        )
      ) {
        stillExisting.push(item);
      } else {
        removed.push({
          locationKey: this.getProviderName(),
          entity: item,
        });
      }
    });

    const added = await this.getAddedEntities(targets, existing);

    if (
      stillExisting.length > 0 &&
      stillExisting[0].metadata.annotations![this.defaultBranchAnnotation] !==
        undefined &&
      !this.isDefaultBranchPush(
        stillExisting[0].metadata.annotations![this.defaultBranchAnnotation],
        event,
      )
    ) {
      return;
    } else if (
      added.length > 0 &&
      added[0].entity.metadata.annotations![this.defaultBranchAnnotation] !==
        undefined &&
      !this.isDefaultBranchPush(
        added[0].entity.metadata.annotations![this.defaultBranchAnnotation],
        event,
      )
    ) {
      return;
    } else if (
      removed.length > 0 &&
      removed[0].entity.metadata.annotations![this.defaultBranchAnnotation] !==
        undefined &&
      !this.isDefaultBranchPush(
        removed[0].entity.metadata.annotations![this.defaultBranchAnnotation],
        event,
      )
    ) {
      return;
    }

    const promises: Promise<void>[] = [
      this.connection.refresh({
        keys: stillExisting.map(entity => `url:${entity.spec.target}`),
      }),
    ];

    if (added.length > 0 || removed.length > 0) {
      promises.push(
        this.connection.applyMutation({
          type: 'delta',
          added: added,
          removed: removed,
        }),
      );
    }

    await Promise.all(promises);

    return;
  }

  private async getAddedEntities(
    targets: Entity[],
    existing: LocationEntity[],
  ): Promise<DeferredEntity[]> {
    const added: DeferredEntity[] = toDeferredEntities(
      targets.filter(
        target =>
          !existing.find(
            item =>
              item.spec.target ===
              target.metadata.annotations![this.targetAnnotation],
          ),
      ),
      this.getProviderName(),
    );
    return added;
  }

  private async findExistingLocations(
    catalogRepoUrl: string,
    credentials: BackstageCredentials,
  ): Promise<LocationEntity[]> {
    const filter: Record<string, string> = {};
    filter.kind = 'Location';
    filter[`metadata.annotations.${this.targetAnnotation}`] = catalogRepoUrl;

    return this.catalogApi!.getEntities({ filter }, { credentials }).then(
      result => result.items,
    ) as Promise<LocationEntity[]>;
  }
}

export function toDeferredEntities(
  targets: Entity[],
  locationKey: string,
): DeferredEntity[] {
  return targets.map(entity => {
    return {
      locationKey,
      entity,
    };
  });
}
