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
  GroupEntity,
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
  EntityProvider,
  EntityProviderConnection,
} from '@backstage/plugin-catalog-node';
import { graphql } from '@octokit/graphql';
import { merge } from 'lodash';
import * as uuid from 'uuid';
import { Logger } from 'winston';

import {
  assignGroupsToUsers,
  buildOrgHierarchy,
  defaultOrganizationTeamTransformer,
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
import { splitTeamSlug } from '../lib/util';

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
}

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
    const allGroups: Entity[] = [];

    const orgsToProcess = this.options.orgs?.length
      ? this.options.orgs
      : await this.getAllOrgs(this.options.gitHubConfig);

    for (const org of orgsToProcess) {
      try {
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

        const { groups } = await getOrganizationTeams(
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

        assignGroupsToUsers(pendingUsers, groups);
        buildOrgHierarchy(groups);

        allGroups.push(...groups);
      } catch (e) {
        logger.error(`Failed to read GitHub org data for ${org}: ${e}`);
      }
    }

    const allUsers = Array.from(allUsersMap.values());

    const { markCommitComplete } = markReadComplete({ allUsers, allGroups });

    await this.connection.applyMutation({
      type: 'full',
      entities: [...allUsers, ...allGroups].map(entity => ({
        locationKey: `github-multi-org-provider:${this.options.id}`,
        entity: withLocations(
          `https://${this.options.gitHubConfig.host}`,
          entity,
        ),
      })),
    });

    markCommitComplete();
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
            logger.error(`${this.getProviderName()} refresh failed`, error);
          }
        },
      });
    };
  }

  private async defaultMultiOrgTeamTransformer(
    team: GithubTeam,
    ctx: TransformerContext,
  ): Promise<GroupEntity | undefined> {
    const result = this.options.teamTransformer
      ? await this.options.teamTransformer(team, ctx)
      : await defaultOrganizationTeamTransformer(team, ctx);

    if (result) {
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
        install.account.login
          ? install.account.login
          : undefined,
      )
      .filter(Boolean) as string[];
  }
}

// Helps wrap the timing and logging behaviors
function trackProgress(logger: Logger) {
  let timestamp = Date.now();
  let summary: string;

  logger.info('Reading GitHub users and groups');

  function markReadComplete(read: {
    allUsers: unknown[];
    allGroups: unknown[];
  }) {
    summary = `${read.allUsers.length} GitHub users and ${read.allGroups.length} GitHub groups`;
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
