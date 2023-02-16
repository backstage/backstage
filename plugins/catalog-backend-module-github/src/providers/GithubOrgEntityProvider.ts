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
import {
  ANNOTATION_LOCATION,
  ANNOTATION_ORIGIN_LOCATION,
  Entity,
} from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import {
  DefaultGithubCredentialsProvider,
  GithubCredentialsProvider,
  GithubIntegrationConfig,
  ScmIntegrations,
  SingleInstanceGithubCredentialsProvider,
} from '@backstage/integration';
import { EventParams } from '@backstage/plugin-events-node';
import { EventSubscriber } from '@backstage/plugin-events-node';
import {
  EntityProvider,
  EntityProviderConnection,
} from '@backstage/plugin-catalog-backend';
import { graphql } from '@octokit/graphql';
import {
  OrganizationEvent,
  OrganizationMemberAddedEvent,
  OrganizationMemberRemovedEvent,
  TeamEvent,
  TeamEditedEvent,
  MembershipEvent,
} from '@octokit/webhooks-types';
import { merge } from 'lodash';
import * as uuid from 'uuid';
import { Logger } from 'winston';
import {
  assignGroupsToUsers,
  buildOrgHierarchy,
  defaultOrganizationTeamTransformer,
  defaultUserTransformer,
  getOrganizationTeams,
  getOrganizationUsers,
  GithubTeam,
  parseGithubOrgUrl,
} from '../lib';
import { TeamTransformer, UserTransformer } from '../lib';
import {
  createAddEntitiesOperation,
  createRemoveEntitiesOperation,
  createReplaceEntitiesOperation,
  DeferredEntitiesBuilder,
  getOrganizationTeam,
  getOrganizationTeamsFromUsers,
} from '../lib/github';

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
   * The refresh schedule to use.
   *
   * @defaultValue "manual"
   * @remarks
   *
   * If you pass in 'manual', you are responsible for calling the `read` method
   * manually at some interval.
   *
   * But more commonly you will pass in the result of
   * {@link @backstage/backend-tasks#PluginTaskScheduler.createScheduledTaskRunner}
   * to enable automatic scheduling of tasks.
   */
  schedule?: 'manual' | TaskRunner;

  /**
   * The logger to use.
   */
  logger: Logger;

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
}

/**
 * Ingests org data (users and groups) from GitHub.
 *
 * @public
 */
export class GithubOrgEntityProvider
  implements EntityProvider, EventSubscriber
{
  private readonly credentialsProvider: GithubCredentialsProvider;
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
    });

    provider.schedule(options.schedule);

    return provider;
  }

  constructor(
    private options: {
      id: string;
      orgUrl: string;
      gitHubConfig: GithubIntegrationConfig;
      logger: Logger;
      githubCredentialsProvider?: GithubCredentialsProvider;
      userTransformer?: UserTransformer;
      teamTransformer?: TeamTransformer;
    },
  ) {
    this.credentialsProvider =
      options.githubCredentialsProvider ||
      SingleInstanceGithubCredentialsProvider.create(this.options.gitHubConfig);
  }

  /** {@inheritdoc @backstage/plugin-catalog-backend#EntityProvider.getProviderName} */
  getProviderName() {
    return `GithubOrgEntityProvider:${this.options.id}`;
  }

  /** {@inheritdoc @backstage/plugin-catalog-backend#EntityProvider.connect} */
  async connect(connection: EntityProviderConnection) {
    this.connection = connection;
    await this.scheduleFn?.();
  }

  /**
   * Runs one single complete ingestion. This is only necessary if you use
   * manual scheduling.
   */
  async read(options?: { logger?: Logger }) {
    if (!this.connection) {
      throw new Error('Not initialized');
    }

    const logger = options?.logger ?? this.options.logger;
    const { markReadComplete } = trackProgress(logger);

    const { headers, type: tokenType } =
      await this.credentialsProvider.getCredentials({
        url: this.options.orgUrl,
      });
    const client = graphql.defaults({
      baseUrl: this.options.gitHubConfig.apiBaseUrl,
      headers,
    });

    const { org } = parseGithubOrgUrl(this.options.orgUrl);
    const { users } = await getOrganizationUsers(
      client,
      org,
      tokenType,
      this.options.userTransformer,
    );
    const { groups } = await getOrganizationTeams(
      client,
      org,
      this.options.teamTransformer,
    );

    assignGroupsToUsers(users, groups);
    buildOrgHierarchy(groups);

    const { markCommitComplete } = markReadComplete({ users, groups });

    await this.connection.applyMutation({
      type: 'full',
      entities: [...users, ...groups].map(entity => ({
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

  /** {@inheritdoc @backstage/plugin-events-node#EventSubscriber.onEvent} */
  async onEvent(params: EventParams): Promise<void> {
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

    const replaceEntitiesOperation = createReplaceEntitiesOperation(
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
          replaceEntitiesOperation,
        );
      }
    }

    // handle change membership in the org
    // https://docs.github.com/en/developers/webhooks-and-events/webhooks/webhook-events-and-payloads#membership
    if (params.topic.includes('membership')) {
      const membershipEvent = params.eventPayload as MembershipEvent;
      this.onMembershipChangedInOrganization(
        membershipEvent,
        replaceEntitiesOperation,
      );
    }

    return;
  }

  /** {@inheritdoc @backstage/plugin-events-node#EventSubscriber.supportsEventTopics} */
  supportsEventTopics(): string[] {
    return ['github.organization', 'github.team', 'github.membership'];
  }

  private async onTeamEditedInOrganization(
    event: TeamEditedEvent,
    createDeltaOperation: DeferredEntitiesBuilder,
  ) {
    if (!this.connection) {
      throw new Error('Not initialized');
    }

    const teamSlug = event.team.slug;
    const { headers, type: tokenType } =
      await this.credentialsProvider.getCredentials({
        url: this.options.orgUrl,
      });
    const client = graphql.defaults({
      baseUrl: this.options.gitHubConfig.apiBaseUrl,
      headers,
    });

    const { org } = parseGithubOrgUrl(this.options.orgUrl);
    const { group } = await getOrganizationTeam(
      client,
      org,
      teamSlug,
      this.options.teamTransformer,
    );

    const { users } = await getOrganizationUsers(
      client,
      org,
      tokenType,
      this.options.userTransformer,
    );

    const usersFromChangedGroup = group.spec.members || [];
    const usersToRebuild = users.filter(u =>
      usersFromChangedGroup.includes(u.metadata.name),
    );

    const { groups } = await getOrganizationTeamsFromUsers(
      client,
      org,
      usersToRebuild.map(u => u.metadata.name),
      this.options.teamTransformer,
    );

    assignGroupsToUsers(usersToRebuild, groups);
    buildOrgHierarchy(groups);

    const oldName = event.changes.name?.from || '';
    const oldSlug = oldName.toLowerCase().replaceAll(/\s/gi, '-');

    const { removed } = createDeltaOperation(org, [
      {
        ...group,
        metadata: {
          name: oldSlug,
        },
      },
    ]);
    const { added } = createDeltaOperation(org, [...usersToRebuild, ...groups]);
    await this.connection.applyMutation({
      type: 'delta',
      removed,
      added,
    });
  }

  private async onMembershipChangedInOrganization(
    event: MembershipEvent,
    createDeltaOperation: DeferredEntitiesBuilder,
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
    const userLogin = event.member.login;
    const { headers, type: tokenType } =
      await this.credentialsProvider.getCredentials({
        url: this.options.orgUrl,
      });
    const client = graphql.defaults({
      baseUrl: this.options.gitHubConfig.apiBaseUrl,
      headers,
    });

    const { org } = parseGithubOrgUrl(this.options.orgUrl);
    const { group } = await getOrganizationTeam(
      client,
      org,
      teamSlug,
      this.options.teamTransformer,
    );

    const { users } = await getOrganizationUsers(
      client,
      org,
      tokenType,
      this.options.userTransformer,
    );

    const usersToRebuild = users.filter(u => u.metadata.name === userLogin);

    const { groups } = await getOrganizationTeamsFromUsers(
      client,
      org,
      [userLogin],
      this.options.teamTransformer,
    );

    // we include group because the removed event need to update the old group too
    if (!groups.some(g => g.metadata.name === group.metadata.name)) {
      groups.push(group);
    }

    assignGroupsToUsers(usersToRebuild, groups);
    buildOrgHierarchy(groups);

    const { added, removed } = createDeltaOperation(org, [
      ...usersToRebuild,
      ...groups,
    ]);
    await this.connection.applyMutation({
      type: 'delta',
      removed,
      added,
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
    const { headers } = await this.credentialsProvider.getCredentials({
      url: this.options.orgUrl,
    });
    const client = graphql.defaults({
      baseUrl: this.options.gitHubConfig.apiBaseUrl,
      headers,
    });

    const group = (await organizationTeamTransformer(
      {
        name,
        slug,
        editTeamUrl: `${url}/edit`,
        combinedSlug: `${org}/${slug}`,
        description: description || undefined,
        parentTeam: { slug: event.team?.parent?.slug || '' } as GithubTeam,
        // entity will be removed
        members: [],
      },
      {
        org,
        client,
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
    const { name, avatar_url: avatarUrl, email, login } = event.membership.user;
    const org = event.organization.login;
    const { headers } = await this.credentialsProvider.getCredentials({
      url: this.options.orgUrl,
    });
    const client = graphql.defaults({
      baseUrl: this.options.gitHubConfig.apiBaseUrl,
      headers,
    });

    const user = (await userTransformer(
      {
        name,
        avatarUrl,
        login,
        email: email || undefined,
        // we don't have this information in the event, so the refresh will handle that for us
        organizationVerifiedDomainEmails: [],
      },
      {
        org,
        client,
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
            taskInstanceId: uuid.v4(),
          });

          try {
            await this.read({ logger });
          } catch (error) {
            logger.error(`${this.getProviderName()} refresh failed`, error);
          }
        },
      });
    };
  }
}

// Helps wrap the timing and logging behaviors
function trackProgress(logger: Logger) {
  let timestamp = Date.now();
  let summary: string;

  logger.info('Reading GitHub users and groups');

  function markReadComplete(read: { users: unknown[]; groups: unknown[] }) {
    summary = `${read.users.length} GitHub users and ${read.groups.length} GitHub groups`;
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
