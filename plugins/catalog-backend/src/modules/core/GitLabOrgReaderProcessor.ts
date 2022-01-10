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
import { Config } from '@backstage/config';
import { LocationSpec } from '@backstage/catalog-model';
import { ScmIntegrations } from '@backstage/integration';
import { Logger } from 'winston';

import * as results from './results';
import { CatalogProcessor, CatalogProcessorEmit } from './types';
import { GitLabClient, getGroups, getInstanceUsers } from './gitlab';

/**
 * Extracts teams and users out of GitLab group or GitLab EE instance.
 *
 * @alpha
 */
export class GitLabOrgReaderProcessor implements CatalogProcessor {
  private static processorName = 'gitlab-org';
  private readonly integrations: ScmIntegrations;
  private readonly logger: Logger;

  static fromConfig(config: Config, options: { logger: Logger }) {
    const integrations = ScmIntegrations.fromConfig(config);
    return new GitLabOrgReaderProcessor({
      ...options,
      integrations,
    });
  }

  constructor(options: { integrations: ScmIntegrations; logger: Logger }) {
    this.integrations = options.integrations;
    this.logger = options.logger;
  }

  getProcessorName(): string {
    return GitLabOrgReaderProcessor.processorName;
  }

  async readLocation(
    location: LocationSpec,
    _optional: boolean,
    emit: CatalogProcessorEmit,
  ): Promise<boolean> {
    if (location.type !== GitLabOrgReaderProcessor.processorName) {
      return false;
    }

    const config = this.getConfigForTarget(location.target);
    const client = new GitLabClient({
      logger: this.logger,
      config,
    });

    this.logger.debug(`Ingesting users from ${location.target}`);
    const users = await getInstanceUsers(client);
    for (const user of users) {
      emit(results.entity(location, user));
    }
    this.logger.debug(`Ingesting groups from ${location.target}`);
    const groups = await getGroups(client, '', '.');
    for (const [_, { entity: group }] of groups) {
      emit(results.entity(location, group));
    }

    return true;
  }

  private getConfigForTarget(target: string) {
    const config = this.integrations.gitlab.byUrl(target)?.config;
    if (!config) {
      throw new Error(
        `There is no GitLab Org provider for ${target}. Please add a configuration for an integration.`,
      );
    }
    return config;
  }
}
