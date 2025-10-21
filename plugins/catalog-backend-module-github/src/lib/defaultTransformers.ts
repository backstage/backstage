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

import { Entity, GroupEntity, UserEntity } from '@backstage/catalog-model';
import { graphql } from '@octokit/graphql';
import {
  ANNOTATION_GITHUB_TEAM_SLUG,
  ANNOTATION_GITHUB_USER_LOGIN,
} from './annotation';
import { GithubTeam, GithubUser } from './github';

/**
 * Context passed to Transformers
 *
 * @public
 */
export interface TransformerContext {
  client: typeof graphql;
  query: string;
  org: string;
}

/**
 * Transformer for GitHub users to an Entity
 *
 * @public
 */
export type UserTransformer = (
  item: GithubUser,
  ctx: TransformerContext,
) => Promise<Entity | undefined>;

/**
 * Transformer for GitHub Team to an Entity
 *
 * @public
 */
export type TeamTransformer = (
  item: GithubTeam,
  ctx: TransformerContext,
) => Promise<Entity | undefined>;

/**
 * Default transformer for GitHub users to UserEntity
 *
 * @public
 */
export const defaultUserTransformer = async (
  item: GithubUser,
  _ctx: TransformerContext,
): Promise<UserEntity | undefined> => {
  const entity: UserEntity = {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'User',
    metadata: {
      name: item.login,
      annotations: {
        [ANNOTATION_GITHUB_USER_LOGIN]: item.login,
      },
    },
    spec: {
      profile: {},
      memberOf: [],
    },
  };

  if (item.bio) entity.metadata.description = item.bio;
  if (item.name) entity.spec.profile!.displayName = item.name;
  if (item.email) entity.spec.profile!.email = item.email;
  if (item.avatarUrl) entity.spec.profile!.picture = item.avatarUrl;
  return entity;
};

/**
 * Default transformer for GitHub Team to GroupEntity
 *
 * @public
 */
export const defaultOrganizationTeamTransformer: TeamTransformer =
  async team => {
    const annotations: { [annotationName: string]: string } = {
      [ANNOTATION_GITHUB_TEAM_SLUG]: team.combinedSlug,
    };

    if (team.editTeamUrl) {
      annotations['backstage.io/edit-url'] = team.editTeamUrl;
    }

    const entity: GroupEntity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Group',
      metadata: {
        name: team.slug,
        annotations,
      },
      spec: {
        type: 'team',
        profile: {},
        children: [],
      },
    };

    if (team.description) {
      entity.metadata.description = team.description;
    }
    if (team.name) {
      entity.spec.profile!.displayName = team.name;
    }
    if (team.avatarUrl) {
      entity.spec.profile!.picture = team.avatarUrl;
    }
    if (team.parentTeam) {
      entity.spec.parent = team.parentTeam.slug;
    }

    entity.spec.members = team.members.map(user => user.login);

    return entity;
  };
