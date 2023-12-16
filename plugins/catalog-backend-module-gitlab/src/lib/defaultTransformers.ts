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
import { GroupEntity, UserEntity } from '@backstage/catalog-model';
import { GitLabGroup, GitLabUser, GitlabProviderConfig } from './types';
import { GitLabIntegrationConfig } from '@backstage/integration';

export function defaultGroupNameTransformer(
  full_path: string,
  config: GitlabProviderConfig,
): string {
  if (config.group && full_path.startsWith(`${config.group}/`)) {
    return full_path.replace(`${config.group}/`, '').replaceAll('/', '-');
  }
  return full_path.replaceAll('/', '-');
}

export function defaultGroupTransformer(
  group: GitLabGroup,
  provConfig: GitlabProviderConfig,
): GroupEntity {
  const annotations: { [annotationName: string]: string } = {};

  annotations[`${provConfig.host}/team-path`] = group.full_path;

  const entity: GroupEntity = {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Group',
    metadata: {
      name: defaultGroupNameTransformer(group.full_path, provConfig),
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

/**
 * If you want the groupId instead of the fullGroupPath as group name
 * @see https://github.com/backstage/backstage/issues/19838
 */
export function groupIdGroupTransformer(
  group: GitLabGroup,
  provConfig: GitlabProviderConfig,
): GroupEntity {
  const entity = defaultGroupTransformer(group, provConfig);
  entity.metadata.name = `${group.id}`;
  return entity;
}

/**
 * The default implementation of the transformation from a graph user entry to
 * a User entity.
 *
 * @public
 */
export function defaultUserTransformer(
  user: GitLabUser,
  intConfig: GitLabIntegrationConfig,
  provConfig: GitlabProviderConfig,
): UserEntity {
  const annotations: { [annotationName: string]: string } = {};

  annotations[`${intConfig.host}/user-login`] = user.web_url;
  if (user?.group_saml_identity?.extern_uid) {
    annotations[`${intConfig.host}/saml-external-uid`] =
      user.group_saml_identity.extern_uid;
  }

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
      entity.spec.memberOf.push(
        defaultGroupNameTransformer(group.full_path, provConfig),
      );
    }
  }

  return entity;
}
