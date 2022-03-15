/*
 * Copyright 2020 The Backstage Authors
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

import { Config } from '@backstage/config';
import {
  DefaultGithubCredentialsProvider,
  GithubCredentialsProvider,
  GithubCredentialType,
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
  getOrganizationTeams,
  getOrganizationUsers,
  parseGitHubOrgUrl,
} from './lib';

type GraphQL = typeof graphql;

/**
 * Extracts teams and users out of a GitHub org.
 * @public
 */
export class GithubOrgReaderProcessor implements CatalogProcessor {
  private readonly integrations: ScmIntegrationRegistry;
  private readonly logger: Logger;
  private readonly githubCredentialsProvider: GithubCredentialsProvider;

  static fromConfig(
    config: Config,
    options: {
      logger: Logger;
      githubCredentialsProvider?: GithubCredentialsProvider;
    },
  ) {
    const integrations = ScmIntegrations.fromConfig(config);

    return new GithubOrgReaderProcessor({
      ...options,
      integrations,
    });
  }

  constructor(options: {
    integrations: ScmIntegrationRegistry;
    logger: Logger;
    githubCredentialsProvider?: GithubCredentialsProvider;
  }) {
    this.integrations = options.integrations;
    this.githubCredentialsProvider =
      options.githubCredentialsProvider ||
      DefaultGithubCredentialsProvider.fromIntegrations(this.integrations);
    this.logger = options.logger;
  }
  getProcessorName(): string {
    return 'GithubOrgReaderProcessor';
  }

  async readLocation(
    location: LocationSpec,
    _optional: boolean,
    emit: CatalogProcessorEmit,
  ): Promise<boolean> {
    if (location.type !== 'github-org') {
      return false;
    }

    const { client, tokenType } = await this.createClient(location.target);
    const { org } = parseGitHubOrgUrl(location.target);

    // Read out all of the raw data
    const startTimestamp = Date.now();
    this.logger.info('Reading GitHub users and groups');

    const { users } = await getOrganizationUsers(client, org, tokenType);
    const { groups, groupMemberUsers } = await getOrganizationTeams(
      client,
      org,
    );

    const duration = ((Date.now() - startTimestamp) / 1000).toFixed(1);
    this.logger.debug(
      `Read ${users.length} GitHub users and ${groups.length} GitHub groups in ${duration} seconds`,
    );

    assignGroupsToUsers(users, groupMemberUsers);
    buildOrgHierarchy(groups);

    // Done!
    for (const group of groups) {
      emit(processingResult.entity(location, group));
    }
    for (const user of users) {
      emit(processingResult.entity(location, user));
    }

    return true;
  }

  private async createClient(
    orgUrl: string,
  ): Promise<{ client: GraphQL; tokenType: GithubCredentialType }> {
    const gitHubConfig = this.integrations.github.byUrl(orgUrl)?.config;

    if (!gitHubConfig) {
      throw new Error(
        `There is no GitHub Org provider that matches ${orgUrl}. Please add a configuration for an integration.`,
      );
    }

    const { headers, type: tokenType } =
      await this.githubCredentialsProvider.getCredentials({
        url: orgUrl,
      });

    const client = graphql.defaults({
      baseUrl: gitHubConfig.apiBaseUrl,
      headers,
    });

    return { client, tokenType };
  }
}
