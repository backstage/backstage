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
  DeferredEntity,
  EntityProvider,
  EntityProviderConnection,
} from '@backstage/plugin-catalog-backend';
import { graphql } from '@octokit/graphql';
import {
  OrganizationEvent,
  OrganizationMemberAddedEvent,
  OrganizationMemberRemovedEvent,
  TeamEvent,
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
import { TeamTransformer, UserTransformer } from '../lib/defaultTransformers';

type DeltaOperationFactory = (
  org: string,
  entities: Entity[],
) => { added: DeferredEntity[]; removed: DeferredEntity[] };
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

// TODO: Consider supporting an (optional) webhook that reacts on org changes
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

    const addEntities: DeltaOperationFactory = (org, entities) => ({
      removed: [],
      added: entities.map(entity => ({
        locationKey: `github-org-provider:${this.options.id}`,
        entity: withLocations(
          `https://${this.options.gitHubConfig.host}`,
          org,
          entity,
        ),
      })),
    });

    const removeEntities: DeltaOperationFactory = (org, entities) => ({
      added: [],
      removed: entities.map(entity => ({
        locationKey: `github-org-provider:${this.options.id}`,
        entity: withLocations(
          `https://${this.options.gitHubConfig.host}`,
          org,
          entity,
        ),
      })),
    });

    // handle change users in the org https://docs.github.com/en/developers/webhooks-and-events/webhooks/webhook-events-and-payloads#organization
    if (params.topic.includes('organization')) {
      const orgEvent = params.eventPayload as OrganizationEvent;

      if (orgEvent.action === 'member_added') {
        await this.onMemberChangeInOrganization(orgEvent, addEntities);
      } else if (orgEvent.action === 'member_removed') {
        await this.onMemberChangeInOrganization(orgEvent, removeEntities);
      }
    }

    // handle change teams in the org https://docs.github.com/en/developers/webhooks-and-events/webhooks/webhook-events-and-payloads#team
    // we don't handle team.edited because isn't possible now to correlate this process when the team name changes
    // so the full refresh will be responsible for that operation
    if (params.topic.includes('team')) {
      const teamEvent = params.eventPayload as TeamEvent;

      if (teamEvent.action === 'created') {
        await this.onTeamDeltaChangeInOrganization(teamEvent, addEntities);
      } else if (teamEvent.action === 'deleted') {
        await this.onTeamDeltaChangeInOrganization(teamEvent, removeEntities);
      }
    }

    return;
  }

  /** {@inheritdoc @backstage/plugin-events-node#EventSubscriber.supportsEventTopics} */
  supportsEventTopics(): string[] {
    return ['github.organization', 'github.team'];
  }

  private async onTeamDeltaChangeInOrganization(
    event: TeamEvent,
    createDeltaOperation: DeltaOperationFactory,
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
    createDeltaOperation: DeltaOperationFactory,
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
            logger.error(error);
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
