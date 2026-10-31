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

import {
  Entity,
  LocationEntity,
  stringifyEntityRef,
} from '@backstage/catalog-model';
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
import { randomUUID } from 'node:crypto';
import { isDeepStrictEqual } from 'node:util';
import { BitbucketServerClient, paginated } from '../lib';
import type { BitbucketServerRepository } from '../lib';
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

type BitbucketServerRepositoryWithId = BitbucketServerRepository & {
  id?: unknown;
};

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
            taskInstanceId: randomUUID(),
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
    const repositoryCandidates = new Map<
      string,
      {
        projectKey: string;
        repository: BitbucketServerRepository;
      }
    >();

    for await (const project of projects) {
      if (!this.matchesRepositoryFilters({ projectKey: project.key })) {
        continue;
      }
      const projectRepositories = paginated(options =>
        client.listRepositories({
          projectKey: project.key,
          listOptions: options,
        }),
      );
      for await (const repository of projectRepositories) {
        if (
          !this.matchesRepositoryFilters({
            projectKey: project.key,
            repoSlug: repository.slug,
            archived: repository.archived,
          })
        ) {
          continue;
        }

        const repositoryKey = this.getRepositoryKey(repository);
        const existing = repositoryCandidates.get(repositoryKey);
        if (existing) {
          if (
            !this.hasMatchingRepositoryData(existing.repository, repository)
          ) {
            throw new Error(
              `Found conflicting Bitbucket Server repository data for '${repositoryKey}' in projects '${existing.projectKey}' and '${project.key}' (repositories '${existing.repository.slug}' and '${repository.slug}')`,
            );
          }

          if (
            this.isRepositoryPreferred(
              { projectKey: project.key, repository },
              existing,
            )
          ) {
            repositoryCandidates.set(repositoryKey, {
              projectKey: project.key,
              repository,
            });
          }
          continue;
        }

        repositoryCandidates.set(repositoryKey, {
          projectKey: project.key,
          repository,
        });
      }
    }

    const result = new Map<
      string,
      {
        entity: Entity;
        source: string;
      }
    >();

    for (const { projectKey, repository } of repositoryCandidates.values()) {
      if (this.config.validateLocationsExist) {
        try {
          const response = await client.getFile({
            projectKey,
            repo: repository.slug,
            path: this.config.catalogPath,
          });
          if (!response.ok) {
            if (response.status === 404) {
              this.logger.debug(
                `Skipping repository ${repository.slug} in project ${projectKey} because the catalog file does not exist.`,
              );
            } else {
              this.logger.warn(
                `Unexpected response code ${
                  response.status
                } while fetching the catalog file from repository ${
                  repository.slug
                } in project ${projectKey}. Response details: ${JSON.stringify(
                  response,
                )}`,
              );
            }
            continue;
          }
        } catch (error) {
          this.logger.error(
            `An error occurred while fetching the catalog file from repository ${repository.slug} in project ${projectKey}: ${error}`,
          );
        }
      }

      const source = `${projectKey}/${repository.slug}`;
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
            projectKey,
          });
          entity.metadata.annotations[this.defaultBranchAnnotation] =
            defaultBranchResponse.displayId;
        } else {
          entity.metadata.annotations[this.defaultBranchAnnotation] =
            repository.defaultBranch;
        }

        const entityRef = stringifyEntityRef(entity);
        const existing = result.get(entityRef);
        if (existing) {
          if (!isDeepStrictEqual(existing.entity, entity)) {
            throw new Error(
              `Found conflicting entities with the same entity ref '${entityRef}' from Bitbucket Server sources '${existing.source}' and '${source}'`,
            );
          }
          continue;
        }

        result.set(entityRef, { entity, source });
      }
    }

    return Array.from(result.values(), value => value.entity);
  }

  private getRepositoryKey(repository: BitbucketServerRepository): string {
    const repositoryId = (repository as BitbucketServerRepositoryWithId).id;
    return typeof repositoryId === 'number' &&
      Number.isSafeInteger(repositoryId)
      ? `id:${repositoryId}`
      : `url:${this.getRepositoryTarget(repository)}`;
  }

  private getRepositoryTarget(repository: BitbucketServerRepository): string {
    return repository.links.self[0].href;
  }

  private isRepositoryPreferred(
    candidate: { projectKey: string; repository: BitbucketServerRepository },
    existing: { projectKey: string; repository: BitbucketServerRepository },
  ): boolean {
    const candidateTarget = this.getRepositoryTarget(candidate.repository);
    const existingTarget = this.getRepositoryTarget(existing.repository);
    return (
      candidateTarget < existingTarget ||
      (candidateTarget === existingTarget &&
        candidate.projectKey < existing.projectKey)
    );
  }

  private hasMatchingRepositoryData(
    first: BitbucketServerRepository,
    second: BitbucketServerRepository,
  ): boolean {
    return (
      first.slug === second.slug &&
      first.archived === second.archived &&
      first.defaultBranch === second.defaultBranch
    );
  }

  private matchesRepositoryFilters(options: {
    projectKey: string;
    repoSlug?: string;
    archived?: boolean;
  }): boolean {
    const filters = this.config.filters;
    if (filters?.projectKey && !filters.projectKey.test(options.projectKey)) {
      return false;
    }
    if (
      filters?.repoSlug &&
      options.repoSlug !== undefined &&
      !filters.repoSlug.test(options.repoSlug)
    ) {
      return false;
    }
    if (filters?.skipArchivedRepos && options.archived) {
      return false;
    }
    return true;
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
  ): Promise<Entity[] | undefined> {
    const client = BitbucketServerClient.fromConfig({
      config: this.integration.config,
    });
    const result: Entity[] = [];
    try {
      const repository = await client.getRepository({
        projectKey: event.repository.project.key,
        repo: event.repository.slug,
      });

      if (
        !this.matchesRepositoryFilters({
          projectKey: repository.project.key,
          repoSlug: repository.slug,
          archived: repository.archived,
        })
      ) {
        return undefined;
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

    if (
      !this.matchesRepositoryFilters({
        projectKey: event.repository.project.key,
        repoSlug: event.repository.slug,
      })
    ) {
      return;
    }

    const repoSlug = event.repository.slug;
    const catalogRepoUrl: string = `https://${this.config.host}/projects/${event.repository.project.key}/repos/${repoSlug}/browse${this.config.catalogPath}`;
    this.logger.info(`handle repo:push event for ${catalogRepoUrl}`);
    const targets = await this.getLocationEntity(event);
    if (!targets) {
      return;
    }
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
