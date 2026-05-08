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
  CacheService,
  LoggerService,
  SchedulerServiceTaskRunner,
} from '@backstage/backend-plugin-api';
import { Entity, isGroupEntity, isUserEntity } from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import {
  DefaultGithubCredentialsProvider,
  GithubCredentialsProvider,
  GithubIntegrationConfig,
  ScmIntegrations,
  SingleInstanceGithubCredentialsProvider,
} from '@backstage/integration';
import {
  EntityProvider,
  EntityProviderConnection,
} from '@backstage/plugin-catalog-node';
import { EventParams, EventsService } from '@backstage/plugin-events-node';
import { Octokit } from '@octokit/core';
import {
  MembershipEvent,
  OrganizationEvent,
  OrganizationMemberAddedEvent,
  OrganizationMemberRemovedEvent,
  TeamEditedEvent,
  TeamEvent,
} from '@octokit/webhooks-types';
import { randomUUID } from 'node:crypto';
import {
  defaultOrganizationTeamTransformer,
  defaultUserTransformer,
  TeamTransformer,
  UserTransformer,
} from '../lib/defaultTransformers';
import {
  createAddEntitiesOperation,
  createOctokit,
  createRemoveEntitiesOperation,
  DEFAULT_PAGE_SIZES,
  DeferredEntitiesBuilder,
  getOrganizationTeam,
  getOrganizationTeams,
  getOrganizationTeamsForUser,
  getOrganizationTeamsFromUsers,
  getOrganizationUsers,
  GithubPageSizes,
  GithubTeam,
  isGitHubEnterprise,
  isSuspended,
} from '../lib/github';
import { areGroupEntities, areUserEntities } from '../lib/guards';
import {
  assignGroupsToUser,
  assignGroupsToUsers,
  buildOrgHierarchy,
} from '../lib/org';
import { parseGithubOrgUrl } from '../lib/util';
import { withLocations } from '../lib/withLocations';

const EVENT_TOPICS = [
  'github.membership',
  'github.organization',
  'github.team',
];

/**
 * Options for {@link GithubOrgEntityProvider}.
 *
 * @public
 */
export interface GithubOrgEntityProviderOptions {
  /**
   * A unique, stable identifier for this provider.
   *
   * @example "production"
   */
  id: string;

  /**
   * The target that this provider should consume.
   *
   * @example "https://github.com/backstage"
   */
  orgUrl: string;

  /**
   * Passing the optional EventsService enables event-based delta updates.
   */
  events?: EventsService;

  /**
   * The refresh schedule to use.
   *
   * @defaultValue "manual"
   * @remarks
   *
   * If you pass in 'manual', you are responsible for calling the `read` method
   * manually at some interval.
   *
   * But more commonly you will pass in the result of
   * {@link @backstage/backend-plugin-api#SchedulerService.createScheduledTaskRunner}
   * to enable automatic scheduling of tasks.
   */
  schedule?: 'manual' | SchedulerServiceTaskRunner;

  /**
   * The logger to use.
   */
  logger: LoggerService;

  /**
   * Cache service used to make conditional HTTP requests when checking for
   * suspended users. Responses are cached and revalidated using
   * Last-Modified/ETag headers, so unchanged responses from GitHub don't count
   * against the REST API rate limit.
   */
  cache: CacheService;

  /**
   * Optionally supply a custom credentials provider, replacing the default one.
   */
  githubCredentialsProvider?: GithubCredentialsProvider;

  /**
   * Optionally include a user transformer for transforming from GitHub users to User Entities
   */
  userTransformer?: UserTransformer;

  /**
   * Optionally include a team transformer for transforming from GitHub teams to Group Entities
   */
  teamTransformer?: TeamTransformer;

  /**
   * Optionally configure page sizes for GitHub GraphQL API queries.
   * Reduce these values if hitting RESOURCE_LIMITS_EXCEEDED errors.
   */
  pageSizes?: Partial<GithubPageSizes>;

  /**
   * Whether to skip the suspended user check when querying organization users.
   * By default, suspended users are automatically excluded on GitHub Enterprise
   * instances using the REST API (without requiring site_admin scope).
   * Set this to true to disable the check if needed.
   * Be aware that if this check is disabled, suspended users will appear in the
   * catalog with no way of distinguishing them from active valid users.
   * @defaultValue false
   */
  dangerouslySkipSuspendedUserCheck?: boolean;
}

/**
 * Ingests org data (users and groups) from GitHub.
 *
 * @public
 */
export class GithubOrgEntityProvider implements EntityProvider {
  private readonly credentialsProvider: GithubCredentialsProvider;
  private readonly octokit: Octokit;
  private connection?: EntityProviderConnection;
  private scheduleFn?: () => Promise<void>;

  static fromConfig(config: Config, options: GithubOrgEntityProviderOptions) {
    const integrations = ScmIntegrations.fromConfig(config);
    const gitHubConfig = integrations.github.byUrl(options.orgUrl)?.config;

    if (!gitHubConfig) {
      throw new Error(
        `There is no GitHub Org provider that matches ${options.orgUrl}. Please add a configuration for an integration.`,
      );
    }

    const logger = options.logger.child({
      target: options.orgUrl,
    });

    const provider = new GithubOrgEntityProvider({
      id: options.id,
      orgUrl: options.orgUrl,
      logger,
      gitHubConfig,
      githubCredentialsProvider:
        options.githubCredentialsProvider ||
        DefaultGithubCredentialsProvider.fromIntegrations(integrations),
      userTransformer: options.userTransformer,
      teamTransformer: options.teamTransformer,
      events: options.events,
      pageSizes: options.pageSizes,
      dangerouslySkipSuspendedUserCheck:
        options.dangerouslySkipSuspendedUserCheck,
      cache: options.cache,
    });

    provider.schedule(options.schedule);

    return provider;
  }

  constructor(
    private options: {
      events?: EventsService;
      id: string;
      orgUrl: string;
      gitHubConfig: GithubIntegrationConfig;
      logger: LoggerService;
      githubCredentialsProvider?: GithubCredentialsProvider;
      userTransformer?: UserTransformer;
      teamTransformer?: TeamTransformer;
      pageSizes?: Partial<GithubPageSizes>;
      dangerouslySkipSuspendedUserCheck?: boolean;
      cache: CacheService;
    },
  ) {
    this.credentialsProvider =
      options.githubCredentialsProvider ||
      SingleInstanceGithubCredentialsProvider.create(this.options.gitHubConfig);

    this.octokit = createOctokit({
      baseUrl: this.options.gitHubConfig.apiBaseUrl,
      orgUrl: this.options.orgUrl,
      credentialsProvider: this.credentialsProvider,
      logger: this.options.logger,
      cache: this.options.cache,
    });
  }

  /** {@inheritdoc @backstage/plugin-catalog-node#EntityProvider.getProviderName} */
  getProviderName() {
    return `GithubOrgEntityProvider:${this.options.id}`;
  }

  private async shouldFilterSuspendedUsers(): Promise<boolean> {
    if (this.options.dangerouslySkipSuspendedUserCheck) {
      return false;
    }
    return isGitHubEnterprise(this.octokit);
  }

  private async shouldExclude(login: string, org: string): Promise<boolean> {
    return (
      (await this.shouldFilterSuspendedUsers()) &&
      (await isSuspended(login, this.octokit, { org }))
    );
  }

  private getPageSizes(): GithubPageSizes {
    return {
      ...DEFAULT_PAGE_SIZES,
      ...this.options.pageSizes,
    };
  }

  /** {@inheritdoc @backstage/plugin-catalog-node#EntityProvider.connect} */
  async connect(connection: EntityProviderConnection) {
    this.connection = connection;
    await this.options.events?.subscribe({
      id: this.getProviderName(),
      topics: EVENT_TOPICS,
      onEvent: params => this.onEvent(params),
    });
    await this.scheduleFn?.();
  }

  /**
   * Runs one single complete ingestion. This is only necessary if you use
   * manual scheduling.
   */
  async read(options?: { logger?: LoggerService }) {
    if (!this.connection) {
      throw new Error('Not initialized');
    }

    const logger = options?.logger ?? this.options.logger;
    const { markReadComplete } = trackProgress(logger);

    const { org } = parseGithubOrgUrl(this.options.orgUrl);
    const pageSizes = this.getPageSizes();
    const shouldFilter = await this.shouldFilterSuspendedUsers();
    const { users } = await getOrganizationUsers(
      this.octokit,
      org,
      this.options.userTransformer,
      pageSizes,
      shouldFilter,
    );
    const { teams } = await getOrganizationTeams(
      this.octokit,
      org,
      this.options.teamTransformer,
      pageSizes,
    );

    if (areGroupEntities(teams)) {
      buildOrgHierarchy(teams);
      if (areUserEntities(users)) {
        assignGroupsToUsers(users, teams);
      }
    }

    const { markCommitComplete } = markReadComplete({ users, teams });

    await this.connection.applyMutation({
      type: 'full',
      entities: [...users, ...teams].map(entity => ({
        locationKey: `github-org-provider:${this.options.id}`,
        entity: withLocations(
          `https://${this.options.gitHubConfig.host}`,
          org,
          entity,
        ),
      })),
    });

    markCommitComplete();
  }

  private async onEvent(params: EventParams): Promise<void> {
    const { logger } = this.options;
    logger.debug(`Received event from ${params.topic}`);

    const addEntitiesOperation = createAddEntitiesOperation(
      this.options.id,
      this.options.gitHubConfig.host,
    );
    const removeEntitiesOperation = createRemoveEntitiesOperation(
      this.options.id,
      this.options.gitHubConfig.host,
    );

    // handle change users in the org
    // https://docs.github.com/en/developers/webhooks-and-events/webhooks/webhook-events-and-payloads#organization
    if (params.topic.includes('organization')) {
      const orgEvent = params.eventPayload as OrganizationEvent;

      if (
        orgEvent.action === 'member_added' ||
        orgEvent.action === 'member_removed'
      ) {
        const createDeltaOperation =
          orgEvent.action === 'member_added'
            ? addEntitiesOperation
            : removeEntitiesOperation;
        await this.onMemberChangeInOrganization(orgEvent, createDeltaOperation);
      }
    }

    // handle change teams in the org
    // https://docs.github.com/en/developers/webhooks-and-events/webhooks/webhook-events-and-payloads#team
    if (params.topic.includes('team')) {
      const teamEvent = params.eventPayload as TeamEvent;
      if (teamEvent.action === 'created' || teamEvent.action === 'deleted') {
        const createDeltaOperation =
          teamEvent.action === 'created'
            ? addEntitiesOperation
            : removeEntitiesOperation;
        await this.onTeamChangeInOrganization(teamEvent, createDeltaOperation);
      } else if (teamEvent.action === 'edited') {
        await this.onTeamEditedInOrganization(
          teamEvent,
          addEntitiesOperation,
          removeEntitiesOperation,
        );
      }
    }

    // handle change membership in the org
    // https://docs.github.com/en/developers/webhooks-and-events/webhooks/webhook-events-and-payloads#membership
    if (params.topic.includes('membership')) {
      const membershipEvent = params.eventPayload as MembershipEvent;
      await this.onMembershipChangedInOrganization(
        membershipEvent,
        addEntitiesOperation,
        removeEntitiesOperation,
      );
    }

    return;
  }

  private async onTeamEditedInOrganization(
    event: TeamEditedEvent,
    addEntitiesOperation: DeferredEntitiesBuilder,
    removeEntitiesOperation: DeferredEntitiesBuilder,
  ) {
    if (!this.connection) {
      throw new Error('Not initialized');
    }

    const teamSlug = event.team.slug;

    const { org } = parseGithubOrgUrl(this.options.orgUrl);
    const pageSizes = this.getPageSizes();
    const { team } = await getOrganizationTeam(
      this.octokit,
      org,
      teamSlug,
      this.options.teamTransformer,
    );

    const { users } = await getOrganizationUsers(
      this.octokit,
      org,
      this.options.userTransformer,
      pageSizes,
      await this.shouldFilterSuspendedUsers(),
    );

    if (!isGroupEntity(team)) {
      return;
    }

    const usersFromChangedGroup = team.spec.members || [];
    const usersToRebuild = users.filter(u =>
      usersFromChangedGroup.includes(u.metadata.name),
    );

    const { teams } = await getOrganizationTeamsFromUsers(
      this.octokit,
      org,
      usersToRebuild.map(u => u.metadata.name),
      this.options.teamTransformer,
      pageSizes,
    );

    if (areGroupEntities(teams)) {
      buildOrgHierarchy(teams);
      if (areUserEntities(usersToRebuild)) {
        assignGroupsToUsers(usersToRebuild, teams);
      }
    }

    const teamTransformer =
      this.options.teamTransformer || defaultOrganizationTeamTransformer;

    const oldName = event.changes.name?.from || '';
    const oldSlug = oldName.toLowerCase().replaceAll(/\s/gi, '-');
    const oldGroup = (await teamTransformer(
      {
        name: event.changes.name?.from,
        slug: oldSlug,
        combinedSlug: `${org}/${oldSlug}`,
        description: event.changes.description?.from,
        parentTeam: event.team?.parent?.slug
          ? ({ slug: event.team.parent.slug } as GithubTeam)
          : undefined,
        // entity will be removed
        members: [],
      },
      {
        org,
        client: this.octokit.graphql,
        query: '',
      },
    )) as Entity;

    // Remove the old group entity in case the entity ref is now different
    const { removed } = removeEntitiesOperation(org, [oldGroup]);
    const { added } = addEntitiesOperation(org, [...usersToRebuild, team]);
    await this.connection.applyMutation({
      type: 'delta',
      removed,
      added,
    });
  }

  private async onMembershipChangedInOrganization(
    event: MembershipEvent,
    addEntitiesOperation: DeferredEntitiesBuilder,
    removeEntitiesOperation: DeferredEntitiesBuilder,
  ) {
    if (!this.connection) {
      throw new Error('Not initialized');
    }

    // The docs are saying I will receive the slug for the removed event,
    // but the types don't reflect that,
    // so I will just check to be sure the slug is there
    // https://docs.github.com/en/developers/webhooks-and-events/webhooks/webhook-events-and-payloads#membership
    if (!('slug' in event.team)) {
      return;
    }

    const teamSlug = event.team.slug;

    const { org } = parseGithubOrgUrl(this.options.orgUrl);
    const pageSizes = this.getPageSizes();
    const { team } = await getOrganizationTeam(
      this.octokit,
      org,
      teamSlug,
      this.options.teamTransformer,
      pageSizes,
    );

    const userTransformer =
      this.options.userTransformer || defaultUserTransformer;
    const { name, avatar_url: avatarUrl, email, login, node_id } = event.member;
    const user = await userTransformer(
      {
        name,
        avatarUrl,
        login,
        email: email ?? undefined,
        id: node_id,
      },
      {
        org,
        client: this.octokit.graphql,
        query: '',
      },
    );

    const addedEntities: Entity[] = [team];
    const removedEntities: Entity[] = [];

    if (user && isUserEntity(user)) {
      // This event is nothing to do with the user's status, but any changes to
      // their membership can affect their access, so it's a good moment to
      // recheck whether they're suspended and remove them from the org if
      // needed.
      if (await this.shouldExclude(login, org)) {
        removedEntities.push(user);
      } else {
        const teamTransformer =
          this.options.teamTransformer || defaultOrganizationTeamTransformer;
        const { teams } = await getOrganizationTeamsForUser(
          this.octokit,
          org,
          login,
          teamTransformer,
          pageSizes,
        );

        if (areGroupEntities(teams)) {
          assignGroupsToUser(user, teams);
        }

        // This function handles both added and removed events, but the
        // additions are to teams in the org, implying that in either case,
        // they're a member of the org itself. So either way, an event implies
        // that the user should be added to the catalog.
        addedEntities.push(user);
      }
    }

    const materializedAddOperation = addEntitiesOperation(org, addedEntities);
    const materializedRemoveOperation = removeEntitiesOperation(
      org,
      removedEntities,
    );

    await this.connection.applyMutation({
      type: 'delta',
      removed: [
        ...materializedAddOperation.removed,
        ...materializedRemoveOperation.removed,
      ],
      added: [
        ...materializedAddOperation.added,
        ...materializedRemoveOperation.added,
      ],
    });
  }

  private async onTeamChangeInOrganization(
    event: TeamEvent,
    createDeltaOperation: DeferredEntitiesBuilder,
  ) {
    if (!this.connection) {
      throw new Error('Not initialized');
    }

    const organizationTeamTransformer =
      this.options.teamTransformer || defaultOrganizationTeamTransformer;
    const { name, html_url: url, description, slug } = event.team;
    const org = event.organization.login;

    const group = (await organizationTeamTransformer(
      {
        name,
        slug,
        editTeamUrl: `${url}/edit`,
        combinedSlug: `${org}/${slug}`,
        description: description || undefined,
        parentTeam: event.team?.parent?.slug
          ? ({ slug: event.team.parent.slug } as GithubTeam)
          : undefined,
        // entity will be removed
        members: [],
      },
      {
        org,
        client: this.octokit.graphql,
        query: '',
      },
    )) as Entity;

    const { added, removed } = createDeltaOperation(org, [group]);

    await this.connection.applyMutation({
      type: 'delta',
      removed,
      added,
    });
  }

  private async onMemberChangeInOrganization(
    event: OrganizationMemberAddedEvent | OrganizationMemberRemovedEvent,
    createDeltaOperation: DeferredEntitiesBuilder,
  ) {
    if (!this.connection) {
      throw new Error('Not initialized');
    }

    const userTransformer =
      this.options.userTransformer || defaultUserTransformer;
    const {
      name,
      avatar_url: avatarUrl,
      email,
      login,
      node_id,
    } = event.membership.user;
    const org = event.organization.login;

    if (
      event.action === 'member_added' &&
      (await this.shouldExclude(login, org))
    ) {
      return;
    }

    const user = (await userTransformer(
      {
        name,
        avatarUrl,
        login,
        email: email || undefined,
        id: node_id,
        // we don't have this information in the event, so the refresh will handle that for us
        organizationVerifiedDomainEmails: [],
      },
      {
        org,
        client: this.octokit.graphql,
        query: '',
      },
    )) as Entity;

    const { added, removed } = createDeltaOperation(org, [user]);
    await this.connection.applyMutation({
      type: 'delta',
      removed,
      added,
    });
  }

  private schedule(schedule: GithubOrgEntityProviderOptions['schedule']) {
    if (!schedule || schedule === 'manual') {
      return;
    }

    this.scheduleFn = async () => {
      const id = `${this.getProviderName()}:refresh`;
      await schedule.run({
        id,
        fn: async () => {
          const logger = this.options.logger.child({
            class: GithubOrgEntityProvider.prototype.constructor.name,
            taskId: id,
            taskInstanceId: randomUUID(),
          });

          try {
            await this.read({ logger });
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
}

// Helps wrap the timing and logging behaviors
function trackProgress(logger: LoggerService) {
  let timestamp = Date.now();
  let summary: string;

  logger.info('Reading GitHub users and teams');

  function markReadComplete(read: { users: unknown[]; teams: unknown[] }) {
    summary = `${read.users.length} GitHub users and ${read.teams.length} GitHub teams`;
    const readDuration = ((Date.now() - timestamp) / 1000).toFixed(1);
    timestamp = Date.now();
    logger.info(`Read ${summary} in ${readDuration} seconds. Committing...`);
    return { markCommitComplete };
  }

  function markCommitComplete() {
    const commitDuration = ((Date.now() - timestamp) / 1000).toFixed(1);
    logger.info(`Committed ${summary} in ${commitDuration} seconds.`);
  }

  return { markReadComplete };
}
