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

import { PluginTaskScheduler, TaskRunner } from '@backstage/backend-tasks';
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
  LoggerService,
  SchedulerService,
  SchedulerServiceTaskRunner,
} from '@backstage/backend-plugin-api';
import { BitbucketServerEvents } from '../lib';
import { EventsService } from '@backstage/plugin-events-node';
import { CatalogApi } from '@backstage/catalog-client';
import { TokenManager } from '@backstage/backend-common';

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
  private readonly catalogApi?: CatalogApi;
  private readonly events?: EventsService;
  private readonly tokenManager?: TokenManager;
  private eventConfigErrorThrown = false;
  private readonly targetAnnotation: string;
  private readonly defaultBranchAnnotation: string;

  static fromConfig(
    config: Config,
    options: {
      logger: LoggerService;
      events?: EventsService;
      parser?: BitbucketServerLocationParser;
      schedule?: TaskRunner;
      scheduler?: PluginTaskScheduler;
      catalogApi?: CatalogApi;
      tokenManager?: TokenManager;
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
        options.tokenManager,
      );
    });
  }

  private constructor(
    config: BitbucketServerEntityProviderConfig,
    integration: BitbucketServerIntegration,
    logger: LoggerService,
    taskRunner: SchedulerServiceTaskRunner,
    parser?: BitbucketServerLocationParser,
    catalogApi?: CatalogApi,
    events?: EventsService,
    tokenManager?: TokenManager,
  ) {
    this.integration = integration;
    this.config = config;
    this.parser = parser || defaultBitbucketServerLocationParser;
    this.logger = logger.child({
      target: this.getProviderName(),
    });
    this.scheduleFn = this.createScheduleFn(taskRunner);
    this.catalogApi = catalogApi;
    this.tokenManager = tokenManager;
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

  /**
   * Checks if the webhook was triggered on a commit to the head branch of a repository
   * @param event Bitbucket Server webhook repo:refs_changed event
   */
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
    if (
      this.catalogApi !== undefined &&
      this.catalogApi !== null &&
      this.tokenManager !== undefined &&
      this.tokenManager !== null
    ) {
      return true;
    }

    if (!this.eventConfigErrorThrown) {
      this.eventConfigErrorThrown = true;
      throw new Error(
        `${this.getProviderName()} not well configured to handle repo:push. Missing CatalogApi and/or TokenManager.`,
      );
    }

    return false;
  }

  /**
   * Creates a Bitbucket Server location entity for the repository that is referenced in the push event passed in.
   *
   * @param event A Bitbucket Server push event with repository information.
   *
   * @returns An array of location entities for the repository.
   *
   * @example
   *
   * const RefsChangedEvent = {
   *   "eventKey": "repo:refs_changed",
   *   "date": "2022-01-01T00:00:00Z",
   *   "actor": {
   *     "name": "johndoe",
   *     "emailAddress": "johndoe@example.com",
   *     "id": 123,
   *     "displayName": "John Doe",
   *     "active": true,
   *     "slug": "johndoe",
   *     "type": "NORMAL"
   *   },
   *   "repository": {
   *     "slug": "my-repo",
   *     "id": 123,
   *     "name": "My Repository",
   *     "project": {
   *       "key": "my-project",
   *       "id": 456,
   *       "name": "My Project",
   *       "description": "My project description",
   *       "public": true,
   *       "type": "NORMAL"
   *     }
   *   },
   *   "changes": [
   *     {
   *       "ref": {
   *         "id": "refs/heads/master",
   *         "displayId": "master",
   *         "type": "BRANCH"
   *       },
   *       "refId": "refs/heads/master",
   *       "fromHash": "0123456789abcdef0123456789abcdef0123456",
   *       "toHash": "fedcba9876543210fedcba9876543210fedcba9",
   *       "type": "UPDATE"
   *     }
   *   ]
   * };
   *
   * const locationEntities = await getLocationEntity(RefsChangedEvent);
   *
   * // locationEntities:
   * // [
   * //   {
   * //     kind: 'Location',
   * //     metadata: {
   * //       name: 'my-repo',
   * //       namespace: 'my-project',
   * //       annotations: {
   * //         'backstage.io/managed-by-location': 'url/catalog-info-path',
   * //         'backstage.io/managed-by-origin-location': 'url/catalog-info-path',
   * //         'host/repo-url': 'url',
   * //       },
   * //     },
   * //     spec: {
   * //       type: 'bitbucket',
   * //       target: 'url/catalog-info-path',
   * //       presence: 'optional',
   * //     },
   * //   },
   * // ]
   */
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

  /**
   * Finds if there are existing location entities for the repository that was pushed. If there are, it simply refreshes those entities,
   * if not, it discovers any entity that was added and removed in the list of entities
   * @param event - A Bitbucket Server webhook event for repo:refs_change
   */
  private async onRepoPush(
    event: BitbucketServerEvents.RefsChangedEvent,
  ): Promise<void> {
    if (!this.canHandleEvents()) {
      this.logger.error(
        'Bitbucket Server catalog entity provider is not set up to handle events. Missing tokenManager or catalogApi.',
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
    const { token } = await this.tokenManager!.getToken();
    const existing = await this.findExistingLocations(catalogRepoUrl, token);
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

  /**
   * Gets the location entities that are to be newly added to the catalog.
   * @param targets Location entities for catalog files in the repository that was pushed
   * @param existing The location entities in the repository that was pushed that already exist
   * @returns Returns all deferred entities that represent location entities that don't exist in the catalog yet
   */
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

  /**
   * Finds all location entities in the catalog that already have the annotation `metadata.annotations.${this.config.host}/repo-url`
   * that is equivalent to @param repoURL\.
   * @param repoURL URL for the reposity that the method finds the existing location entities for
   * @param token Token from class token manager
   */
  private async findExistingLocations(
    catalogRepoUrl: string,
    token: string,
  ): Promise<LocationEntity[]> {
    const filter: Record<string, string> = {};
    filter.kind = 'Location';
    filter[`metadata.annotations.${this.targetAnnotation}`] = catalogRepoUrl;

    return this.catalogApi!.getEntities({ filter }, { token }).then(
      result => result.items,
    ) as Promise<LocationEntity[]>;
  }

  //   private static toLocationSpec(target: string): LocationSpec {
  //     return {
  //       type: 'url',
  //       target: target,
  //       presence: 'required',
  //     };
  //   }
}

/**
 * Converts an array of entities into an array of deferred entities with the provider's name as the location key.
 *
 * @param targets An array of entities to convert.
 *
 * @returns An array of deferred entities with the provider's name as the location key.
 *
 * @example
 *
 * const entities = [
 *   { kind: 'Component', namespace: 'default', name: 'my-component' },
 *   { kind: 'System', namespace: 'default', name: 'my-system' },
 *   { kind: 'API', namespace: 'default', name: 'my-api' },
 * ];
 *
 * const deferredEntities = toDeferredEntities(entities);
 *
 * // deferredEntities:
 * // [
 * //   { locationKey: 'my-provider', entity: { kind: 'Component', namespace: 'default', name: 'my-component' } },
 * //   { locationKey: 'my-provider', entity: { kind: 'System', namespace: 'default', name: 'my-system' } },
 * //   { locationKey: 'my-provider', entity: { kind: 'API', namespace: 'default', name: 'my-api' } },
 * // ]
 */
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
