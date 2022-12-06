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
  DEFAULT_NAMESPACE,
  GroupEntity,
  stringifyEntityRef,
  UserEntity,
} from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import {
  DefaultGithubCredentialsProvider,
  GithubAppCredentialsMux,
  GithubCredentialsProvider,
  GithubIntegrationConfig,
  ScmIntegrationRegistry,
  ScmIntegrations,
} from '@backstage/integration';
import {
  CatalogProcessor,
  CatalogProcessorEmit,
  LocationSpec,
  processingResult,
} from '@backstage/plugin-catalog-backend';
import { graphql } from '@octokit/graphql';
import { Logger } from 'winston';
import {
  assignGroupsToUsers,
  buildOrgHierarchy,
  defaultOrganizationTeamTransformer,
  defaultUserTransformer,
  getOrganizationTeams,
  getOrganizationUsers,
  GithubMultiOrgConfig,
  readGithubMultiOrgConfig,
  TeamTransformer,
  UserTransformer,
} from '../lib';

/**
 * Extracts teams and users out of a multiple GitHub orgs namespaced per org.
 *
 * Be aware that this processor may not be compatible with future org structures in the catalog.
 *
 * @public
 */
export class GithubMultiOrgReaderProcessor implements CatalogProcessor {
  private readonly integrations: ScmIntegrationRegistry;
  private readonly orgs: GithubMultiOrgConfig;
  private readonly logger: Logger;
  private readonly githubCredentialsProvider: GithubCredentialsProvider;

  static fromConfig(
    config: Config,
    options: {
      logger: Logger;
      githubCredentialsProvider?: GithubCredentialsProvider;
      userTransformer?: UserTransformer;
      teamTransformer?: TeamTransformer;
    },
  ) {
    const c = config.getOptionalConfig('catalog.processors.githubMultiOrg');
    const integrations = ScmIntegrations.fromConfig(config);

    return new GithubMultiOrgReaderProcessor({
      ...options,
      integrations,
      orgs: c ? readGithubMultiOrgConfig(c) : [],
    });
  }

  constructor(
    private options: {
      integrations: ScmIntegrationRegistry;
      logger: Logger;
      orgs: GithubMultiOrgConfig;
      githubCredentialsProvider?: GithubCredentialsProvider;
      userTransformer?: UserTransformer;
      teamTransformer?: TeamTransformer;
    },
  ) {
    this.integrations = options.integrations;
    this.logger = options.logger;
    this.orgs = options.orgs;
    this.githubCredentialsProvider =
      options.githubCredentialsProvider ||
      DefaultGithubCredentialsProvider.fromIntegrations(this.integrations);
  }
  getProcessorName(): string {
    return 'GithubMultiOrgReaderProcessor';
  }

  async readLocation(
    location: LocationSpec,
    _optional: boolean,
    emit: CatalogProcessorEmit,
  ): Promise<boolean> {
    if (location.type !== 'github-multi-org') {
      return false;
    }

    const gitHubConfig = this.integrations.github.byUrl(
      location.target,
    )?.config;
    if (!gitHubConfig) {
      throw new Error(
        `There is no GitHub integration that matches ${location.target}. Please add a configuration entry for it under integrations.github`,
      );
    }

    const allUsersMap = new Map();
    const baseUrl = new URL(location.target).origin;

    const orgsToProcess = this.orgs.length
      ? this.orgs
      : await this.getAllOrgs(gitHubConfig);

    for (const orgConfig of orgsToProcess) {
      try {
        const { headers, type: tokenType } =
          await this.githubCredentialsProvider.getCredentials({
            url: `${baseUrl}/${orgConfig.name}`,
          });
        const client = graphql.defaults({
          baseUrl: gitHubConfig.apiBaseUrl,
          headers,
        });

        const startTimestamp = Date.now();
        this.logger.info(
          `Reading GitHub users and teams for org: ${orgConfig.name}`,
        );
        const { users } = await getOrganizationUsers(
          client,
          orgConfig.name,
          tokenType,
          async (githubUser, ctx): Promise<UserEntity | undefined> => {
            const result = this.options.userTransformer
              ? await this.options.userTransformer(githubUser, ctx)
              : await defaultUserTransformer(githubUser, ctx);

            if (result) {
              result.metadata.namespace = orgConfig.userNamespace;
            }

            return result;
          },
        );

        const { groups } = await getOrganizationTeams(
          client,
          orgConfig.name,
          async (team, ctx): Promise<GroupEntity | undefined> => {
            const result = this.options.teamTransformer
              ? await this.options.teamTransformer(team, ctx)
              : await defaultOrganizationTeamTransformer(team, ctx);

            if (result) {
              result.metadata.namespace = orgConfig.groupNamespace;
              // Group `spec.members` inherits the namespace of it's group so need to explicitly specify refs here
              result.spec.members = team.members.map(
                user =>
                  `${orgConfig.userNamespace ?? DEFAULT_NAMESPACE}/${
                    user.login
                  }`,
              );
            }

            return result;
          },
        );

        const duration = ((Date.now() - startTimestamp) / 1000).toFixed(1);
        this.logger.debug(
          `Read ${users.length} GitHub users and ${groups.length} GitHub teams from ${orgConfig.name} in ${duration} seconds`,
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

        for (const group of groups) {
          emit(processingResult.entity(location, group));
        }
      } catch (e) {
        this.logger.error(
          `Failed to read GitHub org data for ${orgConfig.name}: ${e}`,
        );
      }
    }

    // Emit all users at the end after all orgs have been processed
    // so all memberships across org groups are accounted for
    const allUsers = Array.from(allUsersMap.values());
    for (const user of allUsers) {
      emit(processingResult.entity(location, user));
    }

    return true;
  }

  // Note: Does not support usage of PATs
  private async getAllOrgs(
    gitHubConfig: GithubIntegrationConfig,
  ): Promise<GithubMultiOrgConfig> {
    const githubAppMux = new GithubAppCredentialsMux(gitHubConfig);
    const installs = await githubAppMux.getAllInstallations();

    return installs
      .map(install =>
        install.target_type === 'Organization' &&
        install.account &&
        install.account.login
          ? {
              name: install.account.login,
              groupNamespace: install.account.login.toLowerCase(),
            }
          : undefined,
      )
      .filter(Boolean) as GithubMultiOrgConfig;
  }
}
