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
  DEFAULT_NAMESPACE,
  Entity,
  GroupEntity,
  UserEntity,
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
  TeamEditedEvent,
  MembershipEvent,
} from '@octokit/webhooks-types';
import { CatalogApi } from '@backstage/catalog-client';
import { TokenManager } from '@backstage/backend-common';
import { merge, omit } from 'lodash';
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

  catalogApi?: CatalogApi;
  tokenManager?: TokenManager;
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

  private eventConfigErrorThrown = false;

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
      catalogApi: options.catalogApi,
      tokenManager: options.tokenManager,
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
      catalogApi?: CatalogApi;
      tokenManager?: TokenManager;
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

    if (!this.canHandleEvents()) {
      logger.debug(`Skiping event ${params.topic}`);
      return;
    }

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

    const replaceEntities: DeltaOperationFactory = (org, entities) => {
      const entitiesToReplace = entities.map(entity => ({
        locationKey: `github-org-provider:${this.options.id}`,
        entity: withLocations(
          `https://${this.options.gitHubConfig.host}`,
          org,
          entity,
        ),
      }));

      return {
        removed: entitiesToReplace,
        added: entitiesToReplace,
      };
    };

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
    if (params.topic.includes('team')) {
      const teamEvent = params.eventPayload as TeamEvent;

      if (teamEvent.action === 'created') {
        await this.onTeamDeltaChangeInOrganization(teamEvent, addEntities);
      } else if (teamEvent.action === 'deleted') {
        await this.onTeamDeltaChangeInOrganization(teamEvent, removeEntities);
      } else if (teamEvent.action === 'edited') {
        await this.onTeamEditedInOrganization(teamEvent, replaceEntities);
      }
    }

    // handle change membership in the org https://docs.github.com/en/developers/webhooks-and-events/webhooks/webhook-events-and-payloads#membership
    if (params.topic.includes('membership')) {
      const membershipEvent = params.eventPayload as MembershipEvent;
      await this.onMemberChangeToTeam(membershipEvent, replaceEntities);
    }

    return;
  }

  /** {@inheritdoc @backstage/plugin-events-node#EventSubscriber.supportsEventTopics} */
  supportsEventTopics(): string[] {
    return ['github.organization', 'github.team', 'github.membership'];
  }

  private canHandleEvents(): boolean {
    if (this.options.catalogApi && this.options.tokenManager) {
      return true;
    }

    // throw only once
    if (!this.eventConfigErrorThrown) {
      this.eventConfigErrorThrown = true;
      throw new Error(
        `${this.getProviderName()} not well configured to handle ${this.supportsEventTopics()}. Missing CatalogApi and/or TokenManager.`,
      );
    }

    return false;
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
    const { node_id: id, name, html_url: url, description, slug } = event.team;
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
        id,
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

  private async onTeamEditedInOrganization(
    event: TeamEditedEvent,
    createDeltaOperation: DeltaOperationFactory,
  ) {
    if (!this.connection) {
      throw new Error('Not initialized');
    }

    const { name } = event.changes;
    const org = event.organization.login;

    const { token } = await this.options.tokenManager!.getToken();
    const groups = await this.options.catalogApi!.getEntities(
      {
        filter: [
          {
            kind: 'Group',
            [`metadata.annotations.github.com/node-id`]: event.team.node_id,
          },
        ],
        fields: ['apiVersion', 'kind', 'metadata', 'spec'],
      },
      { token },
    );

    if (groups.items.length === 0) {
      this.options.logger.debug(
        `Skipping event because couldn't found group with 'github.com/node-id':${event.team.node_id}`,
      );
      return;
    }

    const group = groups.items[0] as GroupEntity;
    const { removed } = createDeltaOperation(org, [group]);
    const { name: newTeamName, html_url: url, description, slug } = event.team;

    if (name) {
      merge(group, {
        metadata: {
          name: slug,
          annotations: {
            [`backstage.io/edit-url`]: `${url}/edit`,
            [`github.com/team-slug`]: `${org}/${slug}`,
            [ANNOTATION_LOCATION]: `url:${url}`,
            [ANNOTATION_ORIGIN_LOCATION]: `url:${url}`,
          },
        },
        spec: {
          profile: {
            displayName: newTeamName,
          },
        },
      });
    }

    if (description) {
      group.metadata.description = description;
    }

    const { added } = createDeltaOperation(org, [group]);
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

  private async onMemberChangeToTeam(
    event: MembershipEvent,
    createDeltaOperation: DeltaOperationFactory,
  ) {
    if (!this.connection) {
      throw new Error('Not initialized');
    }

    // The docs are saying I will receive the slug for the removed event, but the types don't reflect that,
    // so I will just check to be sure the slug is there
    // https://docs.github.com/en/developers/webhooks-and-events/webhooks/webhook-events-and-payloads#membership
    if (!('slug' in event.team)) {
      return;
    }
    const teamSlug = event.team.slug;

    const { token } = await this.options.tokenManager!.getToken();
    const org = event.organization.login;
    let group = (await this.options.catalogApi!.getEntityByRef(
      {
        kind: 'Group',
        namespace: DEFAULT_NAMESPACE,
        name: teamSlug,
      },
      { token },
    )) as GroupEntity;

    if (!group) {
      this.options.logger.debug(
        `Skipping event because couldn't found group ':${event.team.slug} for namespace ${DEFAULT_NAMESPACE}`,
      );
      return;
    }

    let user = (await this.options.catalogApi!.getEntityByRef(
      {
        kind: 'User',
        namespace: DEFAULT_NAMESPACE,
        name: event.member.login,
      },
      { token },
    )) as UserEntity;

    group = omit(group, 'relations');

    if (!user) {
      this.options.logger.debug(
        `Skipping event because couldn't found user ':${event.member.login} for namespace ${DEFAULT_NAMESPACE}`,
      );
      return;
    }
    user = omit(user, 'relations');

    const { removed } = createDeltaOperation(org, [group, user]);

    if (event.action === 'added') {
      group.spec?.members?.push(event.member.login);
      user.spec?.memberOf?.push(event.team.slug);
    } else {
      group = merge(omit(group, 'spec.members'), {
        spec: {
          members: group?.spec?.members?.filter(m => m !== event.member.login),
        },
      });

      user = merge(omit(user, 'spec.memberOf'), {
        spec: {
          memberOf: user?.spec?.memberOf?.filter(m => m !== teamSlug),
        },
      });
    }

    const { added } = createDeltaOperation(org, [group, user]);
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
