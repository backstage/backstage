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
import { Entity } from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import { stringifyError } from '@backstage/errors';
import { ScmIntegrations } from '@backstage/integration';
import {
  EntityProvider,
  EntityProviderConnection,
} from '@backstage/plugin-catalog-backend';
import * as uuid from 'uuid';
import { Logger } from 'winston';
import {
  GitLabClient,
  GroupTransformer,
  readGroups,
  readUsers,
  UserTransformer,
} from './lib';

/**
 * Options for {@link GitLabOrgEntityProvider}.
 *
 * @public
 */
export interface GitLabOrgEntityProviderOptions {
  /**
   * A unique, stable identifier for this provider.
   *
   * @example "production"
   */
  id: string;

  /**
   * The URLs of some GitLab groups or subgroup namespaces.
   *
   * @remarks
   *
   * Each should be the URL of a GitLab target to get org data from.
   *
   * Please see the GitLab documentation for more information on namespaces:
   * https://docs.gitlab.com/ee/user/group/#namespaces
   *
   * Examples:
   * - https://gitlab.com/gitlab-org/delivery
   * - https://self-hosted.example.com/group/subgroup
   */
  target: string | string[];

  /**
   * The logger to use.
   */
  logger: Logger;

  /**
   * The refresh schedule to use.
   *
   * @remarks
   *
   * If you pass in 'manual', you are responsible for calling the `read` method
   * manually at some interval.
   *
   * But more commonly you will pass in the result of
   * {@link @backstage/backend-tasks#PluginTaskScheduler.createScheduledTaskRunner}
   * to enable automatic scheduling of tasks.
   */
  schedule: 'manual' | TaskRunner;

  /**
   * The function that transforms a user entry in GitLab to an entity.
   */
  userTransformer?: UserTransformer;

  /**
   * The function that transforms a group entry in GitLab to an entity.
   */
  groupTransformer?: GroupTransformer;
}

/**
 * Extracts teams and users out of GitLab or a GitLab EE instance.
 *
 * @public
 */
export class GitLabOrgEntityProvider implements EntityProvider {
  private connection?: EntityProviderConnection;
  private scheduleFn?: () => Promise<void>;

  static fromConfig(
    configRoot: Config,
    options: GitLabOrgEntityProviderOptions,
  ) {
    const integrations = ScmIntegrations.fromConfig(configRoot);

    const result = new GitLabOrgEntityProvider({
      id: options.id,
      targets: [options.target].flat(),
      client: new GitLabClient({
        integrations,
        logger: options.logger,
      }),
      logger: options.logger,
      userTransformer: options.userTransformer,
      groupTransformer: options.groupTransformer,
    });

    result.schedule(options.schedule);

    return result;
  }

  constructor(
    private readonly options: {
      id: string;
      targets: string[];
      client: GitLabClient;
      logger: Logger;
      userTransformer?: UserTransformer;
      groupTransformer?: GroupTransformer;
    },
  ) {}

  getProviderName(): string {
    return `GitLabOrgEntityProvider:${this.options.id}`;
  }

  async connect(connection: EntityProviderConnection) {
    this.connection = connection;
    await this.scheduleFn?.();
  }

  async read(options?: { logger?: Logger }) {
    if (!this.connection) {
      throw new Error(`${this.getProviderName()} not initialized`);
    }

    const logger = options?.logger ?? this.options.logger;

    const entities = new Array<Entity>();
    for (const target of this.options.targets) {
      await this.readTarget(target, logger, entities);
    }

    await this.connection.applyMutation({
      type: 'full',
      entities: entities.map(entity => ({
        locationKey: `gitlab-org-provider:${this.options.id}`,
        entity: entity,
      })),
    });
  }

  private async readTarget(target: string, logger: Logger, output: Entity[]) {
    try {
      logger.info(`Reading users and groups from ${target}`);

      const users = await readUsers(this.options.client, target, {
        userTransformer: this.options.userTransformer,
      });
      const groups = await readGroups(this.options.client, target, {
        userTransformer: this.options.userTransformer,
        groupTransformer: this.options.groupTransformer,
      });

      logger.info(
        `Read ${users.length} users and ${groups.length} groups from ${target}`,
      );

      output.push(...users);
      output.push(...groups);
    } catch (e) {
      logger.warn(`Failed to read ${target}, ${stringifyError(e)}`);
      return;
    }
  }

  private schedule(schedule: GitLabOrgEntityProviderOptions['schedule']) {
    if (schedule === 'manual') {
      return;
    }

    this.scheduleFn = async () => {
      const id = `${this.getProviderName()}:refresh`;
      await schedule.run({
        id,
        fn: async () => {
          const logger = this.options.logger.child({
            class: GitLabOrgEntityProvider.prototype.constructor.name,
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
