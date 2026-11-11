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
  AuthService,
  LoggerService,
  SchedulerService,
  SchedulerServiceTaskRunner,
} from '@backstage/backend-plugin-api';
import { LocationEntity } from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import {
  BitbucketCloudIntegration,
  ScmIntegrations,
} from '@backstage/integration';
import {
  BitbucketCloudClient,
  CodeSearch,
  Events,
  Models,
} from '@backstage/plugin-bitbucket-cloud-common';
import {
  CatalogService,
  DeferredEntity,
  EntityProvider,
  EntityProviderConnection,
  locationSpecToLocationEntity,
} from '@backstage/plugin-catalog-node';
import { LocationSpec } from '@backstage/plugin-catalog-common';
import { EventsService } from '@backstage/plugin-events-node';
import {
  BitbucketCloudEntityProviderConfig,
  readProviderConfigs,
} from './BitbucketCloudEntityProviderConfig';
import { randomUUID } from 'node:crypto';

const DEFAULT_BRANCH = 'master';
const TOPIC_REPO_PUSH = 'bitbucketCloud.repo:push';
const TOPIC_REPO_UPDATED = 'bitbucketCloud.repo:updated';

/** @public */
export const ANNOTATION_BITBUCKET_CLOUD_REPO_URL = 'bitbucket.org/repo-url';

interface IngestionTarget {
  fileUrl: string;
  repoUrl: string;
}

/**
 * Discovers catalog files located in [Bitbucket Cloud](https://bitbucket.org).
 * The provider will search your Bitbucket Cloud account and register catalog files matching the configured path
 * as Location entity and via following processing steps add all contained catalog entities.
 * This can be useful as an alternative to static locations or manually adding things to the catalog.
 *
 * @public
 */
export class BitbucketCloudEntityProvider implements EntityProvider {
  private readonly auth: AuthService;
  private readonly catalog: CatalogService;
  private readonly client: BitbucketCloudClient;
  private readonly config: BitbucketCloudEntityProviderConfig;
  private readonly events: EventsService;
  private readonly logger: LoggerService;
  private readonly scheduleFn: () => Promise<void>;

  private connection?: EntityProviderConnection;

  static fromConfig(
    config: Config,
    options: {
      auth: AuthService;
      catalog: CatalogService;
      events: EventsService;
      logger: LoggerService;
      schedule?: SchedulerServiceTaskRunner;
      scheduler?: SchedulerService;
    },
  ): BitbucketCloudEntityProvider[] {
    const integrations = ScmIntegrations.fromConfig(config);
    const integration = integrations.bitbucketCloud.byHost('bitbucket.org');
    if (!integration) {
      // this should never happen as we add a default integration,
      // but as a general safeguard, e.g. if this approach gets changed
      throw new Error('No integration for bitbucket.org available');
    }

    if (!options.schedule && !options.scheduler) {
      throw new Error('Either schedule or scheduler must be provided.');
    }

    return readProviderConfigs(config).map(providerConfig => {
      if (!options.schedule && !providerConfig.schedule) {
        throw new Error(
          `No schedule provided neither via code nor config for bitbucketCloud-provider:${providerConfig.id}.`,
        );
      }

      const taskRunner =
        options.schedule ??
        options.scheduler!.createScheduledTaskRunner(providerConfig.schedule!);

      return new BitbucketCloudEntityProvider(
        options.auth,
        options.catalog,
        providerConfig,
        options.events,
        integration,
        options.logger,
        taskRunner,
      );
    });
  }

  private constructor(
    auth: AuthService,
    catalog: CatalogService,
    config: BitbucketCloudEntityProviderConfig,
    events: EventsService,
    integration: BitbucketCloudIntegration,
    logger: LoggerService,
    taskRunner: SchedulerServiceTaskRunner,
  ) {
    this.auth = auth;
    this.catalog = catalog;
    this.client = BitbucketCloudClient.fromConfig(integration.config);
    this.config = config;
    this.events = events;
    this.logger = logger.child({
      target: this.getProviderName(),
    });
    this.scheduleFn = this.createScheduleFn(taskRunner);
  }

  private createScheduleFn(
    schedule: SchedulerServiceTaskRunner,
  ): () => Promise<void> {
    return async () => {
      const taskId = this.getTaskId();
      return schedule.run({
        id: taskId,
        fn: async () => {
          const logger = this.logger.child({
            class: BitbucketCloudEntityProvider.prototype.constructor.name,
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
    return `bitbucketCloud-provider:${this.config.id}`;
  }

  /** {@inheritdoc @backstage/plugin-catalog-node#EntityProvider.getTaskId} */
  getTaskId(): string {
    return `${this.getProviderName()}:refresh`;
  }

  /** {@inheritdoc @backstage/plugin-catalog-node#EntityProvider.connect} */
  async connect(connection: EntityProviderConnection): Promise<void> {
    this.connection = connection;
    await this.scheduleFn();

    await this.events.subscribe({
      id: this.getProviderName(),
      topics: [TOPIC_REPO_PUSH, TOPIC_REPO_UPDATED],
      onEvent: async params => {
        if (params.topic === TOPIC_REPO_PUSH) {
          await this.onRepoPush(params.eventPayload as Events.RepoPushEvent);
        }

        if (params.topic === TOPIC_REPO_UPDATED) {
          await this.onRepoUpdated(
            params.eventPayload as Events.RepoUpdatedEvent,
          );
        }
      },
    });
  }

  async refresh(logger: LoggerService) {
    if (!this.connection) {
      throw new Error('Not initialized');
    }

    logger.info('Discovering catalog files in Bitbucket Cloud repositories');

    const targets = await this.findCatalogFiles();
    const entities = this.toDeferredEntities(targets);

    await this.connection.applyMutation({
      type: 'full',
      entities: entities,
    });

    logger.info(
      `Committed ${entities.length} Locations for catalog files in Bitbucket Cloud repositories`,
    );
  }

  private enhanceEvent(event: Events.RepoEvent): void {
    // add missing slug
    event.repository.slug = event.repository.full_name!.split('/', 2)[1];
  }

  private shouldProcessEvent(event: Events.RepoEvent): boolean {
    if (!this.connection) {
      throw new Error('Not initialized');
    }

    this.enhanceEvent(event);

    if (event.repository.workspace.slug !== this.config.workspace) {
      return false;
    }

    if (!this.matchesFilters(event.repository)) {
      return false;
    }

    return true;
  }

  async onRepoPush(event: Events.RepoPushEvent): Promise<void> {
    if (!this.shouldProcessEvent(event)) {
      return;
    }

    const repoSlug = event.repository.slug!;
    const repoUrl = event.repository.links!.html!.href!;
    this.logger.info(`handle repo:push event for ${repoUrl}`);

    // The commit information at the webhook only contains some high level metadata.
    // In order to understand whether relevant files have changed we would need to
    // look up all commits which would cost additional API calls.
    // The overall goal is to optimize the necessary amount of API calls.
    // Hence, we will just trigger a refresh for catalog file(s) within the repository
    // if we get notified about changes there.

    const expected = await this.findCatalogFiles(repoSlug);
    const existing = await this.findExistingLocations(repoUrl);

    await this.updateForChanges(expected, existing);
  }

  private async onRepoUpdated(event: Events.RepoUpdatedEvent): Promise<void> {
    if (!this.shouldProcessEvent(event)) {
      return;
    }

    // The event is triggered on every change to the repository.
    // We are only interested in changes that affect the repository URL.
    // This is the case when the repository name (slug), or the full name changes.
    if (!event.changes.links?.old.html?.href) {
      return;
    }

    const repoSlug = event.repository.slug!;
    const repoUrl = event.repository.links!.html!.href!;
    const oldRepoUrl = event.changes.links.old.html.href;
    this.logger.info(
      `handle repo:updated event for ${repoUrl}, previous: ${oldRepoUrl}`,
    );

    const expected = await this.findCatalogFiles(repoSlug);
    const existing = await this.findExistingLocations(oldRepoUrl);

    await this.updateForChanges(expected, existing);
  }

  private async updateForChanges(
    expected: IngestionTarget[],
    existing: LocationEntity[],
  ): Promise<void> {
    const added: DeferredEntity[] = this.toDeferredEntities(
      expected.filter(
        // All Locations are managed by this provider and only have `target`, never `targets`.
        // All URLs (fileUrl, target) are created using `BitbucketCloudEntityProvider.toUrl`.
        // Hence, we can keep the comparison simple and don't need to handle different
        // casing  or encoding, etc.
        target => !existing.find(item => item.spec.target === target.fileUrl),
      ),
    );

    const stillExisting: LocationEntity[] = [];
    const removed: DeferredEntity[] = [];
    existing.forEach(item => {
      if (expected.find(value => value.fileUrl === item.spec.target)) {
        stillExisting.push(item);
      } else {
        removed.push({
          locationKey: this.getProviderName(),
          entity: item,
        });
      }
    });

    const promises: Promise<void>[] =
      stillExisting.length === 0
        ? []
        : [
            this.connection!.refresh({
              keys: stillExisting.map(entity => `url:${entity.spec.target}`),
            }),
          ];

    if (added.length > 0 || removed.length > 0) {
      const connection = this.connection!;
      promises.push(
        connection.applyMutation({
          type: 'delta',
          added: added,
          removed: removed,
        }),
      );
    }

    await Promise.all(promises);
  }

  private async findExistingLocations(
    repoUrl: string,
  ): Promise<LocationEntity[]> {
    const filter: Record<string, string> = {};
    filter.kind = 'Location';
    filter[`metadata.annotations.${ANNOTATION_BITBUCKET_CLOUD_REPO_URL}`] =
      repoUrl;

    return this.catalog
      .getEntities(
        { filter },
        { credentials: await this.auth.getOwnServiceCredentials() },
      )
      .then(result => result.items) as Promise<LocationEntity[]>;
  }

  private async findCatalogFiles(
    repoSlug?: string,
  ): Promise<IngestionTarget[]> {
    const workspace = this.config.workspace;

    // The code search results do not hold the main branch and the project of
    // a repository. Load them from the repository list instead.
    const repositories = (await this.findRepositories(repoSlug)).filter(
      repository => this.matchesFilters(repository),
    );

    const repositoriesByProject = new Map<string, Models.Repository[]>();
    for (const repository of repositories) {
      const projectKey = repository.project!.key!;
      const projectRepositories = repositoriesByProject.get(projectKey) ?? [];
      projectRepositories.push(repository);
      repositoriesByProject.set(projectKey, projectRepositories);
    }

    const pathFilter = BitbucketCloudEntityProvider.toPathFilter(
      this.config.catalogPath,
    );

    let results: IngestionTarget[] = [];
    for (const [projectKey, projectRepositories] of repositoriesByProject) {
      const scopeFilter: CodeSearch.Filter = repoSlug
        ? { attribute: 'repository', eq: repoSlug }
        : { attribute: 'project', eq: projectKey };
      const result = await this.processQuery(
        workspace,
        { and: [pathFilter, scopeFilter] },
        projectRepositories,
      );
      results = results.concat(result);
    }

    return results;
  }

  private async findRepositories(
    repoSlug?: string,
  ): Promise<Models.Repository[]> {
    const fields = [
      'next',
      'values.slug',
      'values.project.key',
      'values.mainbranch.name',
      'values.links.html.href',
    ].join(',');
    const q = repoSlug ? `slug="${repoSlug}"` : undefined;

    const repositories: Models.Repository[] = [];
    for await (const repository of this.client
      .listRepositoriesByWorkspace(this.config.workspace, { fields, q })
      .iterateResults()) {
      repositories.push(repository);
    }

    return repositories;
  }

  private async processQuery(
    workspace: string,
    filters: CodeSearch.Filter,
    repositories: Models.Repository[],
  ): Promise<IngestionTarget[]> {
    const catalogPath = this.config.catalogPath;
    const catalogFilename = catalogPath.substring(
      catalogPath.lastIndexOf('/') + 1,
    );

    const pathPattern = BitbucketCloudEntityProvider.toPathPattern(catalogPath);

    const pages = this.client.searchWorkspaceCode(
      workspace,
      { search_term: catalogFilename, filters },
      { maxResults: this.config.pagelen ?? 100 },
    );

    // The code search can return the same file on more than one page.
    const result = new Map<string, IngestionTarget>();

    for await (const page of pages) {
      for (const file of page.matched_files ?? []) {
        if (!pathPattern.test(file.path)) {
          continue;
        }

        const repository = repositories.find(repo =>
          file.url.startsWith(`${repo.links!.html!.href!}/`),
        );
        if (!repository) {
          continue;
        }

        const fileUrl = BitbucketCloudEntityProvider.toUrl(
          repository,
          file.path,
        );
        result.set(fileUrl, {
          fileUrl,
          repoUrl: repository.links!.html!.href!,
        });
      }
    }

    return [...result.values()];
  }

  /**
   * Creates the code search filter for the configured catalog path.
   *
   * The code search can return files at other paths than the filter
   * describes, so the filter only reduces the results and
   * `toPathPattern` decides which files match.
   */
  private static toPathFilter(catalogPath: string): CodeSearch.Filter {
    const path = catalogPath.replace(/^\//, '');
    if (!/[*?]/.test(path)) {
      // matches the path at the root and in any folder
      return { attribute: 'path', eq: path };
    }

    if (catalogPath.startsWith('/')) {
      return { attribute: 'path', wildcard: path };
    }

    return {
      or: [
        { attribute: 'path', wildcard: path },
        { attribute: 'path', wildcard: `*/${path}` },
      ],
    };
  }

  /**
   * Creates the pattern that a file path must match.
   *
   * A catalog path that starts with `/` matches from the repository root.
   * Any other catalog path matches at the root and in any folder.
   * In the catalog path, `*` matches any characters and `?` matches one character.
   */
  private static toPathPattern(catalogPath: string): RegExp {
    const absolute = catalogPath.startsWith('/');
    const pattern = catalogPath
      .replace(/^\//, '')
      .split('')
      .map(char => {
        if (char === '*') return '.*';
        if (char === '?') return '.';
        return char.replace(/[.+^${}()|[\]\\]/g, '\\$&');
      })
      .join('');

    return new RegExp(absolute ? `^${pattern}$` : `^(.*/)?${pattern}$`);
  }

  private matchesFilters(repository: Models.Repository): boolean {
    const filters = this.config.filters;
    return (
      !filters ||
      ((!filters.projectKey ||
        filters.projectKey.test(repository.project!.key!)) &&
        (!filters.repoSlug || filters.repoSlug.test(repository.slug!)))
    );
  }

  private toDeferredEntities(targets: IngestionTarget[]): DeferredEntity[] {
    return targets
      .map(target => {
        const location = BitbucketCloudEntityProvider.toLocationSpec(
          target.fileUrl,
        );
        const entity = locationSpecToLocationEntity({ location });
        entity.metadata.annotations = {
          ...entity.metadata.annotations,
          [ANNOTATION_BITBUCKET_CLOUD_REPO_URL]: target.repoUrl,
        };
        return entity;
      })
      .map(entity => {
        return {
          locationKey: this.getProviderName(),
          entity: entity,
        };
      });
  }

  private static toUrl(
    repository: Models.Repository,
    filePath: string,
  ): string {
    const repoUrl = repository.links!.html!.href!;
    const branch = repository.mainbranch?.name ?? DEFAULT_BRANCH;

    return `${repoUrl}/src/${branch}/${filePath}`;
  }

  private static toLocationSpec(target: string): LocationSpec {
    return {
      type: 'url',
      target: target,
      presence: 'required',
    };
  }
}
