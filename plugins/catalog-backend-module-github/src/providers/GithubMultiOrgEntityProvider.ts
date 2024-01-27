/*
 * Copyright 2023 The Backstage Authors
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
  isGroupEntity,
  isUserEntity,
  parseEntityRef,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import {
  DefaultGithubCredentialsProvider,
  GithubAppCredentialsMux,
  GithubCredentialsProvider,
  GithubIntegrationConfig,
  ScmIntegrations,
} from '@backstage/integration';
import {
  DeferredEntity,
  EntityProvider,
  EntityProviderConnection,
} from '@backstage/plugin-catalog-node';
import { EventBroker, EventParams } from '@backstage/plugin-events-node';
import { graphql } from '@octokit/graphql';
import {
  InstallationCreatedEvent,
  InstallationEvent,
  OrganizationEvent,
  OrganizationMemberAddedEvent,
  OrganizationMemberRemovedEvent,
  MembershipEvent,
  TeamCreatedEvent,
  TeamDeletedEvent,
  TeamEditedEvent,
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
  TeamTransformer,
  TransformerContext,
  UserTransformer,
} from '../lib';
import {
  ANNOTATION_GITHUB_TEAM_SLUG,
  ANNOTATION_GITHUB_USER_LOGIN,
} from '../lib/annotation';
import {
  getOrganizationsFromUser,
  getOrganizationTeam,
  getOrganizationTeamsFromUsers,
} from '../lib/github';
import { splitTeamSlug } from '../lib/util';
import { areGroupEntities, areUserEntities } from '../lib/guards';

/**
 * Options for {@link GithubMultiOrgEntityProvider}.
 *
 * @public
 */
export interface GithubMultiOrgEntityProviderOptions {
  /**
   * A unique, stable identifier for this provider.
   *
   * @example "production"
   */
  id: string;

  /**
   * The target that this provider should consume.
   *
   * @example "https://mycompany.github.com"
   */
  githubUrl: string;

  /**
   * The list of the GitHub orgs to consume. By default will consume all accessible
   * orgs on the given GitHub instance (support for GitHub App integration only).
   */
  orgs?: string[];

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
   * Optionally include a team transformer for transforming from GitHub teams to Group Entities.
   * By default groups will be namespaced according to their GitHub org.
   */
  teamTransformer?: TeamTransformer;

  /**
   * An EventBroker to subscribe this provider to GitHub events to trigger delta mutations
   */
  eventBroker?: EventBroker;
}

type CreateDeltaOperation = (entities: Entity[]) => {
  added: DeferredEntity[];
  removed: DeferredEntity[];
};

/**
 * Ingests org data (users and groups) from GitHub.
 *
 * @public
 */
export class GithubMultiOrgEntityProvider implements EntityProvider {
  private connection?: EntityProviderConnection;
  private scheduleFn?: () => Promise<void>;

  static fromConfig(
    config: Config,
    options: GithubMultiOrgEntityProviderOptions,
  ) {
    const integrations = ScmIntegrations.fromConfig(config);
    const gitHubConfig = integrations.github.byUrl(options.githubUrl)?.config;

    if (!gitHubConfig) {
      throw new Error(
        `There is no GitHub integration that matches ${options.githubUrl}. Please add a configuration entry for it under integrations.github.`,
      );
    }

    const logger = options.logger.child({
      target: options.githubUrl,
    });

    const provider = new GithubMultiOrgEntityProvider({
      id: options.id,
      gitHubConfig,
      githubCredentialsProvider:
        options.githubCredentialsProvider ||
        DefaultGithubCredentialsProvider.fromIntegrations(integrations),
      githubUrl: new URL(options.githubUrl).origin,
      logger,
      orgs: options.orgs,
      userTransformer: options.userTransformer,
      teamTransformer: options.teamTransformer,
    });

    provider.schedule(options.schedule);

    if (options.eventBroker) {
      options.eventBroker.subscribe({
        supportsEventTopics: provider.supportsEventTopics.bind(provider),
        onEvent: provider.onEvent.bind(provider),
      });
    }

    return provider;
  }

  constructor(
    private readonly options: {
      id: string;
      gitHubConfig: GithubIntegrationConfig;
      githubCredentialsProvider: GithubCredentialsProvider;
      githubUrl: string;
      logger: Logger;
      orgs?: string[];
      userTransformer?: UserTransformer;
      teamTransformer?: TeamTransformer;
    },
  ) {}

  /** {@inheritdoc @backstage/plugin-catalog-backend#EntityProvider.getProviderName} */
  getProviderName() {
    return `GithubMultiOrgEntityProvider:${this.options.id}`;
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

    const allUsersMap = new Map();
    const allTeams: Entity[] = [];

    const orgsToProcess = this.options.orgs?.length
      ? this.options.orgs
      : await this.getAllOrgs(this.options.gitHubConfig);

    for (const org of orgsToProcess) {
      const { headers, type: tokenType } =
        await this.options.githubCredentialsProvider.getCredentials({
          url: `${this.options.githubUrl}/${org}`,
        });
      const client = graphql.defaults({
        baseUrl: this.options.gitHubConfig.apiBaseUrl,
        headers,
      });

      logger.info(`Reading GitHub users and teams for org: ${org}`);

      const { users } = await getOrganizationUsers(
        client,
        org,
        tokenType,
        this.options.userTransformer,
      );

      const { teams } = await getOrganizationTeams(
        client,
        org,
        this.defaultMultiOrgTeamTransformer.bind(this),
      );

      // Grab current users from `allUsersMap` if they already exist in our
      // pending users so we can append to their group membership relations
      const pendingUsers = users.map(u => {
        const userRef = stringifyEntityRef(u);
        if (!allUsersMap.has(userRef)) {
          allUsersMap.set(userRef, u);
        }

        return allUsersMap.get(userRef);
      });

      if (areGroupEntities(teams)) {
        buildOrgHierarchy(teams);
        if (areUserEntities(pendingUsers)) {
          assignGroupsToUsers(pendingUsers, teams);
        }
      }

      allTeams.push(...teams);
    }

    const allUsers = Array.from(allUsersMap.values());

    const { markCommitComplete } = markReadComplete({ allUsers, allTeams });

    await this.connection.applyMutation({
      type: 'full',
      entities: [...allUsers, ...allTeams].map(entity => ({
        locationKey: `github-multi-org-provider:${this.options.id}`,
        entity: withLocations(
          `https://${this.options.gitHubConfig.host}`,
          entity,
        ),
      })),
    });

    markCommitComplete();
  }

  private supportsEventTopics(): string[] {
    return [
      'github.installation',
      'github.organization',
      'github.team',
      'github.membership',
    ];
  }

  private async onEvent(params: EventParams): Promise<void> {
    const { logger } = this.options;
    logger.debug(`Received event from ${params.topic}`);

    const orgs = this.options.orgs?.length
      ? this.options.orgs
      : await this.getAllOrgs(this.options.gitHubConfig);

    const eventPayload = params.eventPayload as
      | InstallationEvent
      | OrganizationEvent
      | MembershipEvent
      | TeamEvent;

    if (
      !orgs.includes(
        (eventPayload as InstallationEvent).installation?.account?.login,
      ) &&
      !orgs.includes(
        (eventPayload as OrganizationEvent | MembershipEvent | TeamEvent)
          .organization?.login,
      )
    ) {
      return;
    }

    // https://docs.github.com/webhooks-and-events/webhooks/webhook-events-and-payloads#installation
    if (
      params.topic.includes('installation') &&
      eventPayload.action === 'created'
    ) {
      // We can only respond to installation.created events to add new users/groups since a
      // installation.deleted event won't provide us info on what user/groups we should remove and
      // we can't query the uninstalled org since we will no longer have access. This will need to be
      // eventually resolved via occasional full mutation runs by calling read()
      await this.onInstallationChange(
        eventPayload as InstallationCreatedEvent,
        orgs,
      );
    }

    // https://docs.github.com/en/developers/webhooks-and-events/webhooks/webhook-events-and-payloads#organization
    if (
      params.topic.includes('organization') &&
      (eventPayload.action === 'member_added' ||
        eventPayload.action === 'member_removed')
    ) {
      await this.onMemberChangeInOrganization(eventPayload, orgs);
    }

    // https://docs.github.com/en/developers/webhooks-and-events/webhooks/webhook-events-and-payloads#team
    if (params.topic.includes('team')) {
      if (
        eventPayload.action === 'created' ||
        eventPayload.action === 'deleted'
      ) {
        await this.onTeamChangeInOrganization(
          eventPayload as TeamCreatedEvent | TeamDeletedEvent,
        );
      } else if (eventPayload.action === 'edited') {
        await this.onTeamEditedInOrganization(
          eventPayload as TeamEditedEvent,
          orgs,
        );
      }
    }

    // https://docs.github.com/en/developers/webhooks-and-events/webhooks/webhook-events-and-payloads#membership
    if (params.topic.includes('membership')) {
      await this.onMembershipChangedInTeam(
        eventPayload as MembershipEvent,
        orgs,
      );
    }

    return;
  }

  private async onInstallationChange(
    event: InstallationCreatedEvent,
    applicableOrgs: string[],
  ) {
    if (!this.connection) {
      throw new Error('Not initialized');
    }

    const org = event.installation.account.login;
    const { headers, type: tokenType } =
      await this.options.githubCredentialsProvider.getCredentials({
        url: `${this.options.githubUrl}/${org}`,
      });
    const client = graphql.defaults({
      baseUrl: this.options.gitHubConfig.apiBaseUrl,
      headers,
    });

    const { users } = await getOrganizationUsers(
      client,
      org,
      tokenType,
      this.options.userTransformer,
    );

    const { teams } = await getOrganizationTeams(
      client,
      org,
      this.defaultMultiOrgTeamTransformer.bind(this),
    );

    if (users.length) {
      // Fetch group memberships of users in case they already exist and
      // have memberships in groups from other applicable orgs
      for (const userOrg of applicableOrgs) {
        const { headers: orgHeaders } =
          await this.options.githubCredentialsProvider.getCredentials({
            url: `${this.options.githubUrl}/${userOrg}`,
          });
        const orgClient = graphql.defaults({
          baseUrl: this.options.gitHubConfig.apiBaseUrl,
          headers: orgHeaders,
        });

        const { teams: userTeams } = await getOrganizationTeamsFromUsers(
          orgClient,
          userOrg,
          users.map(
            u =>
              u.metadata.annotations?.[ANNOTATION_GITHUB_USER_LOGIN] ||
              u.metadata.name,
          ),
          this.defaultMultiOrgTeamTransformer.bind(this),
        );

        if (areGroupEntities(userTeams) && areUserEntities(users)) {
          assignGroupsToUsers(users, userTeams);
        }
      }
    }

    const { added, removed } = this.createAddEntitiesOperation([
      ...users,
      ...teams,
    ]);
    await this.connection.applyMutation({
      type: 'delta',
      removed,
      added,
    });
  }

  private async onMemberChangeInOrganization(
    event: OrganizationMemberAddedEvent | OrganizationMemberRemovedEvent,
    applicableOrgs: string[],
  ) {
    if (!this.connection) {
      throw new Error('Not initialized');
    }

    const userTransformer =
      this.options.userTransformer || defaultUserTransformer;
    const { name, avatar_url: avatarUrl, email, login } = event.membership.user;
    const org = event.organization.login;
    const { headers } =
      await this.options.githubCredentialsProvider.getCredentials({
        url: `${this.options.githubUrl}/${org}`,
      });
    const client = graphql.defaults({
      baseUrl: this.options.gitHubConfig.apiBaseUrl,
      headers,
    });

    const { orgs } = await getOrganizationsFromUser(client, login);
    const userApplicableOrgs = orgs.filter(o => applicableOrgs.includes(o));

    let updateMemberships: boolean;
    let createDeltaOperation: CreateDeltaOperation;
    if (event.action === 'member_removed') {
      if (userApplicableOrgs.length) {
        // If the user is still associated with another applicable org then we don't want to remove
        // them, just update the entity to remove any potential group memberships from the old org
        createDeltaOperation = this.createAddEntitiesOperation.bind(this);
        updateMemberships = true;
      } else {
        // User is no longer part of any applicable orgs so we can remove it,
        // no need to take memberships into account
        createDeltaOperation = this.createRemoveEntitiesOperation.bind(this);
        updateMemberships = false;
      }
    } else {
      // We're not sure if this user was already added as part of another applicable org
      // so grab the latest memberships (potentially from teams of other orgs) to ensure
      // we're not accidentally omitting them
      createDeltaOperation = this.createAddEntitiesOperation.bind(this);
      updateMemberships = true;
    }

    const user = await userTransformer(
      {
        name,
        avatarUrl,
        login,
        email: email ?? undefined,
      },
      {
        org,
        client,
        query: '',
      },
    );

    if (!user) {
      return;
    }

    if (updateMemberships) {
      for (const userOrg of userApplicableOrgs) {
        const { headers: orgHeaders } =
          await this.options.githubCredentialsProvider.getCredentials({
            url: `${this.options.githubUrl}/${userOrg}`,
          });
        const orgClient = graphql.defaults({
          baseUrl: this.options.gitHubConfig.apiBaseUrl,
          headers: orgHeaders,
        });

        const { teams } = await getOrganizationTeamsFromUsers(
          orgClient,
          userOrg,
          [login],
          this.defaultMultiOrgTeamTransformer.bind(this),
        );

        if (isUserEntity(user) && areGroupEntities(teams)) {
          assignGroupsToUsers([user], teams);
        }
      }
    }

    const { added, removed } = createDeltaOperation([user]);
    await this.connection.applyMutation({
      type: 'delta',
      removed,
      added,
    });
  }

  private async onTeamChangeInOrganization(
    event: TeamCreatedEvent | TeamDeletedEvent,
  ) {
    if (!this.connection) {
      throw new Error('Not initialized');
    }

    const org = event.organization.login;
    const { headers } =
      await this.options.githubCredentialsProvider.getCredentials({
        url: `${this.options.githubUrl}/${org}`,
      });
    const client = graphql.defaults({
      baseUrl: this.options.gitHubConfig.apiBaseUrl,
      headers,
    });

    const { name, html_url: url, description, slug } = event.team;
    const group = (await this.defaultMultiOrgTeamTransformer(
      {
        name,
        slug,
        editTeamUrl: `${url}/edit`,
        combinedSlug: `${org}/${slug}`,
        description: description ?? undefined,
        parentTeam: { slug: event.team?.parent?.slug || '' } as GithubTeam,
        // entity will be removed or is new
        members: [],
      },
      {
        org,
        client,
        query: '',
      },
    )) as Entity;

    const createDeltaOperation =
      event.action === 'created'
        ? this.createAddEntitiesOperation.bind(this)
        : this.createRemoveEntitiesOperation.bind(this);
    const { added, removed } = createDeltaOperation([group]);

    await this.connection.applyMutation({
      type: 'delta',
      removed,
      added,
    });
  }

  private async onTeamEditedInOrganization(
    event: TeamEditedEvent,
    applicableOrgs: string[],
  ) {
    if (!this.connection) {
      throw new Error('Not initialized');
    }

    const org = event.organization.login;
    const { headers, type: tokenType } =
      await this.options.githubCredentialsProvider.getCredentials({
        url: `${this.options.githubUrl}/${org}`,
      });
    const client = graphql.defaults({
      baseUrl: this.options.gitHubConfig.apiBaseUrl,
      headers,
    });

    const teamSlug = event.team.slug;
    const { team } = await getOrganizationTeam(
      client,
      org,
      teamSlug,
      this.defaultMultiOrgTeamTransformer.bind(this),
    );

    const { users } = await getOrganizationUsers(
      client,
      org,
      tokenType,
      this.options.userTransformer,
    );

    const usersFromChangedGroup = isGroupEntity(team)
      ? team.spec.members?.map(m =>
          stringifyEntityRef(parseEntityRef(m, { defaultKind: 'user' })),
        ) || []
      : [];
    const usersToRebuild = users.filter(u =>
      usersFromChangedGroup.includes(stringifyEntityRef(u)),
    );

    if (usersToRebuild.length) {
      // Update memberships of associated members of this group in case the group entity ref changed
      for (const userOrg of applicableOrgs) {
        const { headers: orgHeaders } =
          await this.options.githubCredentialsProvider.getCredentials({
            url: `${this.options.githubUrl}/${userOrg}`,
          });
        const orgClient = graphql.defaults({
          baseUrl: this.options.gitHubConfig.apiBaseUrl,
          headers: orgHeaders,
        });

        const { teams } = await getOrganizationTeamsFromUsers(
          orgClient,
          userOrg,
          usersToRebuild.map(
            u =>
              u.metadata.annotations?.[ANNOTATION_GITHUB_USER_LOGIN] ||
              u.metadata.name,
          ),
          this.defaultMultiOrgTeamTransformer.bind(this),
        );

        if (areGroupEntities(teams) && areUserEntities(usersToRebuild)) {
          assignGroupsToUsers(usersToRebuild, teams);
        }
      }
    }

    const oldName = event.changes.name?.from || '';
    const oldSlug = oldName.toLowerCase().replaceAll(/\s/gi, '-');
    const oldGroup = (await this.defaultMultiOrgTeamTransformer(
      {
        name: event.changes.name?.from,
        slug: oldSlug,
        combinedSlug: `${org}/${oldSlug}`,
        description: event.changes.description?.from,
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

    // Remove the old group entity in case the entity ref is now different
    const { removed } = this.createRemoveEntitiesOperation([oldGroup]);
    const { added } = this.createAddEntitiesOperation([
      ...usersToRebuild,
      team,
    ]);
    await this.connection.applyMutation({
      type: 'delta',
      removed,
      added,
    });
  }

  private async onMembershipChangedInTeam(
    event: MembershipEvent,
    applicableOrgs: string[],
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

    const org = event.organization.login;
    const { headers } =
      await this.options.githubCredentialsProvider.getCredentials({
        url: `${this.options.githubUrl}/${org}`,
      });
    const client = graphql.defaults({
      baseUrl: this.options.gitHubConfig.apiBaseUrl,
      headers,
    });

    const teamSlug = event.team.slug;
    const { team } = await getOrganizationTeam(
      client,
      org,
      teamSlug,
      this.defaultMultiOrgTeamTransformer.bind(this),
    );

    const userTransformer =
      this.options.userTransformer || defaultUserTransformer;
    const { name, avatar_url: avatarUrl, email, login } = event.member;
    const user = await userTransformer(
      {
        name,
        avatarUrl,
        login,
        email: email ?? undefined,
      },
      {
        org,
        client,
        query: '',
      },
    );

    const mutationEntities = [team];

    if (user && isUserEntity(user)) {
      const { orgs } = await getOrganizationsFromUser(client, login);
      const userApplicableOrgs = orgs.filter(o => applicableOrgs.includes(o));
      for (const userOrg of userApplicableOrgs) {
        const { headers: orgHeaders } =
          await this.options.githubCredentialsProvider.getCredentials({
            url: `${this.options.githubUrl}/${userOrg}`,
          });
        const orgClient = graphql.defaults({
          baseUrl: this.options.gitHubConfig.apiBaseUrl,
          headers: orgHeaders,
        });

        const { teams } = await getOrganizationTeamsFromUsers(
          orgClient,
          userOrg,
          [login],
          this.defaultMultiOrgTeamTransformer.bind(this),
        );

        if (areGroupEntities(teams)) {
          assignGroupsToUsers([user], teams);
        }
      }

      mutationEntities.push(user);
    }

    const { added, removed } =
      this.createAddEntitiesOperation(mutationEntities);
    await this.connection.applyMutation({
      type: 'delta',
      removed,
      added,
    });
  }

  private schedule(schedule: GithubMultiOrgEntityProviderOptions['schedule']) {
    if (!schedule || schedule === 'manual') {
      return;
    }

    this.scheduleFn = async () => {
      const id = `${this.getProviderName()}:refresh`;
      await schedule.run({
        id,
        fn: async () => {
          const logger = this.options.logger.child({
            class: GithubMultiOrgEntityProvider.prototype.constructor.name,
            taskId: id,
            taskInstanceId: uuid.v4(),
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

  private async defaultMultiOrgTeamTransformer(
    team: GithubTeam,
    ctx: TransformerContext,
  ): Promise<Entity | undefined> {
    if (this.options.teamTransformer) {
      return await this.options.teamTransformer(team, ctx);
    }

    const result = await defaultOrganizationTeamTransformer(team, ctx);

    if (result && result.spec) {
      result.metadata.namespace = ctx.org.toLocaleLowerCase('en-US');
      // Group `spec.members` inherits the namespace of it's group so need to explicitly specify refs here
      result.spec.members = team.members.map(
        user => `${DEFAULT_NAMESPACE}/${user.login}`,
      );
    }

    return result;
  }

  // Note: Does not support usage of PATs
  private async getAllOrgs(
    gitHubConfig: GithubIntegrationConfig,
  ): Promise<string[]> {
    const githubAppMux = new GithubAppCredentialsMux(gitHubConfig);
    const installs = await githubAppMux.getAllInstallations();

    return installs
      .map(install =>
        install.target_type === 'Organization' &&
        install.account &&
        'login' in install.account &&
        install.account.login
          ? install.account.login
          : undefined,
      )
      .filter(Boolean) as string[];
  }

  private createAddEntitiesOperation(entities: Entity[]) {
    return {
      removed: [],
      added: entities.map(entity => ({
        locationKey: `github-multi-org-provider:${this.options.id}`,
        entity: withLocations(
          `https://${this.options.gitHubConfig.host}`,
          entity,
        ),
      })),
    };
  }

  private createRemoveEntitiesOperation(entities: Entity[]) {
    return {
      added: [],
      removed: entities.map(entity => ({
        locationKey: `github-multi-org-provider:${this.options.id}`,
        entity: withLocations(
          `https://${this.options.gitHubConfig.host}`,
          entity,
        ),
      })),
    };
  }
}

// Helps wrap the timing and logging behaviors
function trackProgress(logger: Logger) {
  let timestamp = Date.now();
  let summary: string;

  logger.info('Reading GitHub users and groups');

  function markReadComplete(read: {
    allUsers: unknown[];
    allTeams: unknown[];
  }) {
    summary = `${read.allUsers.length} GitHub users and ${read.allTeams.length} GitHub groups`;
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
export function withLocations(baseUrl: string, entity: Entity): Entity {
  const login =
    entity.metadata.annotations?.[ANNOTATION_GITHUB_USER_LOGIN] ||
    entity.metadata.name;

  let org = entity.metadata.namespace;
  let team = entity.metadata.name;
  const slug = entity.metadata.annotations?.[ANNOTATION_GITHUB_TEAM_SLUG];
  if (slug) {
    const [slugOrg, slugTeam] = splitTeamSlug(slug);
    org = slugOrg;
    team = slugTeam;
  }

  const location =
    entity.kind === 'Group'
      ? `url:${baseUrl}/orgs/${org}/teams/${team}`
      : `url:${baseUrl}/${login}`;
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
