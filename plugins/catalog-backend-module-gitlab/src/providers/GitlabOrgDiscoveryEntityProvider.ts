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

import { PluginTaskScheduler, TaskRunner } from '@backstage/backend-tasks';
import { Config } from '@backstage/config';
import { GitLabIntegration, ScmIntegrations } from '@backstage/integration';
import {
  EntityProvider,
  EntityProviderConnection,
} from '@backstage/plugin-catalog-node';
import * as uuid from 'uuid';
import { Logger } from 'winston';
import {
  GitLabClient,
  GitlabProviderConfig,
  paginated,
  readGitlabConfigs,
} from '../lib';
import { GitLabGroup, GitLabUser } from '../lib/types';
import {
  ANNOTATION_LOCATION,
  ANNOTATION_ORIGIN_LOCATION,
  Entity,
  UserEntity,
  GroupEntity,
} from '@backstage/catalog-model';
import { merge } from 'lodash';

type Result = {
  scanned: number;
  matches: GitLabUser[];
};

type GroupResult = {
  scanned: number;
  matches: GitLabGroup[];
};

/**
 * Discovers users and groups from a Gitlab instance.
 * @public
 */
export class GitlabOrgDiscoveryEntityProvider implements EntityProvider {
  private readonly config: GitlabProviderConfig;
  private readonly integration: GitLabIntegration;
  private readonly logger: Logger;
  private readonly scheduleFn: () => Promise<void>;
  private connection?: EntityProviderConnection;

  static fromConfig(
    config: Config,
    options: {
      logger: Logger;
      schedule?: TaskRunner;
      scheduler?: PluginTaskScheduler;
    },
  ): GitlabOrgDiscoveryEntityProvider[] {
    if (!options.schedule && !options.scheduler) {
      throw new Error('Either schedule or scheduler must be provided.');
    }

    const providerConfigs = readGitlabConfigs(config);
    const integrations = ScmIntegrations.fromConfig(config).gitlab;
    const providers: GitlabOrgDiscoveryEntityProvider[] = [];

    providerConfigs.forEach(providerConfig => {
      const integration = integrations.byHost(providerConfig.host);

      if (!providerConfig.orgEnabled) {
        return;
      }

      if (!integration) {
        throw new Error(
          `No gitlab integration found that matches host ${providerConfig.host}`,
        );
      }

      if (!options.schedule && !providerConfig.schedule) {
        throw new Error(
          `No schedule provided neither via code nor config for GitlabOrgDiscoveryEntityProvider:${providerConfig.id}.`,
        );
      }

      const taskRunner =
        options.schedule ??
        options.scheduler!.createScheduledTaskRunner(providerConfig.schedule!);

      providers.push(
        new GitlabOrgDiscoveryEntityProvider({
          ...options,
          config: providerConfig,
          integration,
          taskRunner,
        }),
      );
    });
    return providers;
  }

  private constructor(options: {
    config: GitlabProviderConfig;
    integration: GitLabIntegration;
    logger: Logger;
    taskRunner: TaskRunner;
  }) {
    this.config = options.config;
    this.integration = options.integration;
    this.logger = options.logger.child({
      target: this.getProviderName(),
    });
    this.scheduleFn = this.createScheduleFn(options.taskRunner);
  }

  getProviderName(): string {
    return `GitlabOrgDiscoveryEntityProvider:${this.config.id}`;
  }

  async connect(connection: EntityProviderConnection): Promise<void> {
    this.connection = connection;
    await this.scheduleFn();
  }

  private createScheduleFn(taskRunner: TaskRunner): () => Promise<void> {
    return async () => {
      const taskId = `${this.getProviderName()}:refresh`;
      return taskRunner.run({
        id: taskId,
        fn: async () => {
          const logger = this.logger.child({
            class: GitlabOrgDiscoveryEntityProvider.prototype.constructor.name,
            taskId,
            taskInstanceId: uuid.v4(),
          });

          try {
            await this.refresh(logger);
          } catch (error) {
            logger.error(`${this.getProviderName()} refresh failed`, error);
          }
        },
      });
    };
  }

  private async refresh(logger: Logger): Promise<void> {
    if (!this.connection) {
      throw new Error(
        `Gitlab discovery connection not initialized for ${this.getProviderName()}`,
      );
    }

    const client = new GitLabClient({
      config: this.integration.config,
      logger: logger,
    });

    const users = paginated<GitLabUser>(options => client.listUsers(options), {
      page: 1,
      per_page: 100,
      active: true,
    });

    const groups = paginated<GitLabGroup>(
      options => client.listGroups(options),
      {
        page: 1,
        per_page: 100,
      },
    );

    const idMappedUser: { [userId: number]: GitLabUser } = {};

    const res: Result = {
      scanned: 0,
      matches: [],
    };

    const groupRes: GroupResult = {
      scanned: 0,
      matches: [],
    };

    for await (const user of users) {
      if (!this.config.userPattern.test(user.email ?? user.username ?? '')) {
        continue;
      }

      res.scanned++;

      if (user.state !== 'active') {
        continue;
      }

      idMappedUser[user.id] = user;
      res.matches.push(user);
    }

    for await (const group of groups) {
      if (!this.config.groupPattern.test(group.full_path ?? '')) {
        continue;
      }

      if (
        this.config.group &&
        !group.full_path.startsWith(`${this.config.group}/`)
      ) {
        continue;
      }

      groupRes.scanned++;
      groupRes.matches.push(group);

      for (const id of await client.getGroupMembers(group.full_path)) {
        const user = idMappedUser[id];
        if (user) {
          user.groups = (user.groups ?? []).concat(group);
        }
      }
    }

    const groupsWithUsers = groupRes.matches.filter(group => {
      return (
        res.matches.filter(x => {
          return !!x.groups?.find(y => y.id === group.id);
        }).length > 0
      );
    });

    const userEntities = res.matches.map(p =>
      this.createUserEntity(p, this.integration.config.host),
    );
    const groupEntities = this.createGroupEntities(
      groupsWithUsers,
      this.integration.config.host,
    );

    await this.connection.applyMutation({
      type: 'full',
      entities: [...userEntities, ...groupEntities].map(entity => ({
        locationKey: this.getProviderName(),
        entity: this.withLocations(
          this.integration.config.host,
          this.integration.config.baseUrl,
          entity,
        ),
      })),
    });
  }

  private createGroupEntities(
    groupResult: GitLabGroup[],
    host: string,
  ): GroupEntity[] {
    const idMapped: { [groupId: number]: GitLabGroup } = {};
    const entities: GroupEntity[] = [];

    for (const group of groupResult) {
      idMapped[group.id] = group;
    }

    for (const group of groupResult) {
      const entity = this.createGroupEntity(group, host);

      if (group.parent_id && idMapped.hasOwnProperty(group.parent_id)) {
        entity.spec.parent = this.groupName(
          idMapped[group.parent_id].full_path,
        );
      }

      entities.push(entity);
    }

    return entities;
  }

  private withLocations(host: string, baseUrl: string, entity: Entity): Entity {
    const location =
      entity.kind === 'Group'
        ? `url:${baseUrl}/${entity.metadata.annotations?.[`${host}/team-path`]}`
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

  private createUserEntity(user: GitLabUser, host: string): UserEntity {
    const annotations: { [annotationName: string]: string } = {};

    annotations[`${host}/user-login`] = user.web_url;

    const entity: UserEntity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'User',
      metadata: {
        name: user.username,
        annotations: annotations,
      },
      spec: {
        profile: {
          displayName: user.name || undefined,
          picture: user.avatar_url || undefined,
        },
        memberOf: [],
      },
    };

    if (user.email) {
      if (!entity.spec) {
        entity.spec = {};
      }

      if (!entity.spec.profile) {
        entity.spec.profile = {};
      }

      entity.spec.profile.email = user.email;
    }

    if (user.groups) {
      for (const group of user.groups) {
        if (!entity.spec.memberOf) {
          entity.spec.memberOf = [];
        }
        entity.spec.memberOf.push(this.groupName(group.full_path));
      }
    }

    return entity;
  }

  private groupName(full_path: string): string {
    if (this.config.group && full_path.startsWith(`${this.config.group}/`)) {
      return full_path
        .replace(`${this.config.group}/`, '')
        .replaceAll('/', '-');
    }
    return full_path.replaceAll('/', '-');
  }

  private createGroupEntity(group: GitLabGroup, host: string): GroupEntity {
    const annotations: { [annotationName: string]: string } = {};

    annotations[`${host}/team-path`] = group.full_path;

    const entity: GroupEntity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Group',
      metadata: {
        name: this.groupName(group.full_path),
        annotations: annotations,
      },
      spec: {
        type: 'team',
        children: [],
        profile: {
          displayName: group.name,
        },
      },
    };

    if (group.description) {
      entity.metadata.description = group.description;
    }

    return entity;
  }
}
