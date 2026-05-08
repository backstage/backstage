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

import { Octokit } from '@octokit/core';
import { Config } from '@backstage/config';
import {
  DefaultGithubCredentialsProvider,
  GithubCredentialsProvider,
  ScmIntegrationRegistry,
  ScmIntegrations,
} from '@backstage/integration';
import {
  CatalogProcessor,
  CatalogProcessorEmit,
  LocationSpec,
  processingResult,
} from '@backstage/plugin-catalog-node';
import {
  assignGroupsToUsers,
  buildOrgHierarchy,
  createOctokit,
  getOrganizationTeams,
  getOrganizationUsers,
  parseGithubOrgUrl,
} from '../lib';
import { areGroupEntities, areUserEntities } from '../lib/guards';
import { LoggerService } from '@backstage/backend-plugin-api';

/**
 * Extracts teams and users out of a GitHub org.
 *
 * @remarks
 *
 * Consider using {@link GithubOrgEntityProvider} instead.
 *
 * @public
 */
export class GithubOrgReaderProcessor implements CatalogProcessor {
  private readonly integrations: ScmIntegrationRegistry;
  private readonly logger: LoggerService;
  private readonly githubCredentialsProvider: GithubCredentialsProvider;

  static fromConfig(
    config: Config,
    options: {
      logger: LoggerService;
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
    logger: LoggerService;
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

    const octokit = this.createClient(location.target);
    const { org } = parseGithubOrgUrl(location.target);

    // Read out all of the raw data
    const startTimestamp = Date.now();
    this.logger.info('Reading GitHub users and groups');

    const { users } = await getOrganizationUsers(octokit, org);
    const { teams } = await getOrganizationTeams(octokit, org);

    const duration = ((Date.now() - startTimestamp) / 1000).toFixed(1);
    this.logger.debug(
      `Read ${users.length} GitHub users and ${teams.length} GitHub teams in ${duration} seconds`,
    );

    if (areGroupEntities(teams)) {
      buildOrgHierarchy(teams);
      if (areUserEntities(users)) {
        assignGroupsToUsers(users, teams);
      }
    }

    // Done!
    for (const team of teams) {
      emit(processingResult.entity(location, team));
    }
    for (const user of users) {
      emit(processingResult.entity(location, user));
    }

    return true;
  }

  private createClient(orgUrl: string): Octokit {
    const gitHubConfig = this.integrations.github.byUrl(orgUrl)?.config;

    if (!gitHubConfig) {
      throw new Error(
        `There is no GitHub Org provider that matches ${orgUrl}. Please add a configuration for an integration.`,
      );
    }

    return createOctokit({
      baseUrl: gitHubConfig.apiBaseUrl!,
      orgUrl: orgUrl,
      credentialsProvider: this.githubCredentialsProvider,
      logger: this.logger,
    });
  }
}
